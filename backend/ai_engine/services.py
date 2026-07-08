"""
ai_engine/services.py

All AI feature implementations.
Every public method returns a dict with 'ai_available' key.
If ai_available=False, frontend shows the manual fallback form.
"""
import json
import logging
import re
from django.conf import settings

from . import client as ai_client
from .circuit_breaker import is_open, record_success, record_failure
from .prompts import (
    SYSTEM_BASE, CLASSIFY_PROMPT, SUMMARY_PROMPT,
    RESOLUTION_PROMPT, CHAT_SYSTEM, DUPLICATE_CHECK_PROMPT,
    PROMPT_VERSION,
)

logger = logging.getLogger('ai_engine')

_FALLBACK = {'ai_available': False}


def _ai_enabled() -> bool:
    return getattr(settings, 'AI_SERVICE_ENABLED', False)


def _extract_json(text: str) -> dict:
    """Extract first JSON object from LLM response (handles markdown fences)."""
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError(f'No JSON found in response: {text[:200]}')


# ── AI-01 & AI-02: Classification (category + priority + tags) ────────────────

def classify_ticket(
    subject: str,
    description: str,
    ticket_type: str,
    department: str,
    user_id: int | None = None,
    ip: str | None = None,
) -> dict:
    """
    Classify a new ticket: category, priority suggestion, tags, sentiment.
    Falls back gracefully if AI unavailable.
    """
    if not _ai_enabled():
        return {**_FALLBACK, 'fallback_reason': 'AI service disabled'}
    if is_open('groq'):
        return {**_FALLBACK, 'fallback_reason': 'AI service temporarily unavailable'}

    prompt = CLASSIFY_PROMPT.format(
        subject=subject[:300],
        description=description[:600],
        ticket_type=ticket_type,
        department=department,
    )

    try:
        raw = ai_client.chat_completion(
            messages=[
                {'role': 'system', 'content': SYSTEM_BASE},
                {'role': 'user',   'content': prompt},
            ],
            max_tokens=settings.AI_MAX_TOKENS_CLASSIFY,
            temperature=0.1,
            user_id=user_id,
            ip=ip,
        )
        data = _extract_json(raw['content'])
        record_success('groq')
        return {
            'ai_available':       True,
            'suggested_priority': data.get('suggested_priority', 'medium'),
            'priority_reason':    data.get('priority_reason', ''),
            'suggested_category': data.get('suggested_category', 'other'),
            'category_reason':    data.get('category_reason', ''),
            'suggested_tags':     data.get('suggested_tags', [])[:5],
            'sentiment':          data.get('sentiment', 'neutral'),
            'confidence':         float(data.get('confidence', 0.7)),
            'prompt_version':     PROMPT_VERSION,
        }
    except ai_client.AIRateLimitError as e:
        return {**_FALLBACK, 'fallback_reason': 'Rate limit reached. Try again later.'}
    except ai_client.AITimeoutError:
        record_failure('groq')
        return {**_FALLBACK, 'fallback_reason': 'AI response timed out'}
    except Exception as e:
        record_failure('groq')
        logger.error('classify_ticket error: %s', e, exc_info=True)
        return {**_FALLBACK, 'fallback_reason': 'AI classification unavailable'}


# ── AI-04: Ticket Summary ─────────────────────────────────────────────────────

def summarise_ticket(ticket, user_id: int | None = None, ip: str | None = None) -> dict:
    """Generate a concise summary of a ticket for department heads."""
    if not _ai_enabled():
        return {**_FALLBACK, 'fallback_reason': 'AI service disabled'}
    if is_open('groq'):
        return {**_FALLBACK, 'fallback_reason': 'AI service temporarily unavailable'}

    # Check cache first
    from .models import AIAnalysisCache
    cache_obj = AIAnalysisCache.objects.filter(
        ticket=ticket,
        prompt_version=PROMPT_VERSION,
    ).first()
    if cache_obj and cache_obj.summary and cache_obj.updated_at >= ticket.updated_at:
        return {'ai_available': True, 'summary': cache_obj.summary, 'cached': True}

    # Build comments context (last 5)
    try:
        comments_qs = ticket.comments.order_by('-created_at')[:5]
        comments_text = '\n'.join([
            f'- {c.created_by.get_full_name()}: {c.body[:150]}'
            for c in comments_qs
        ]) or 'No comments yet.'
    except Exception:
        comments_text = 'Comments unavailable.'

    prompt = SUMMARY_PROMPT.format(
        ticket_number=ticket.ticket_number,
        department=ticket.department.name,
        subject=ticket.subject,
        status=ticket.status,
        priority=ticket.priority,
        description=ticket.description[:600],
        comments=comments_text,
    )

    try:
        result = ai_client.chat_completion(
            messages=[
                {'role': 'system', 'content': SYSTEM_BASE},
                {'role': 'user',   'content': prompt},
            ],
            max_tokens=settings.AI_MAX_TOKENS_SUMMARY,
            temperature=0.2,
            user_id=user_id,
            ip=ip,
        )
        summary = result['content']
        record_success('groq')

        # Cache it
        AIAnalysisCache.objects.update_or_create(
            ticket=ticket,
            defaults={
                'summary':        summary,
                'prompt_version': PROMPT_VERSION,
                'used_fallback':  False,
            }
        )
        return {'ai_available': True, 'summary': summary, 'cached': False}

    except ai_client.AIRateLimitError:
        return {**_FALLBACK, 'fallback_reason': 'Rate limit reached'}
    except ai_client.AITimeoutError:
        record_failure('groq')
        return {**_FALLBACK, 'fallback_reason': 'Summary timed out'}
    except Exception as e:
        record_failure('groq')
        logger.error('summarise_ticket error: %s', e, exc_info=True)
        return {**_FALLBACK, 'fallback_reason': 'Summary unavailable'}


# ── AI-08: Resolution Suggestion ──────────────────────────────────────────────

def suggest_resolution(ticket, user_id: int | None = None, ip: str | None = None) -> dict:
    """Suggest resolution steps for an assigned ticket."""
    if not _ai_enabled():
        return {**_FALLBACK, 'fallback_reason': 'AI service disabled'}
    if is_open('groq'):
        return {**_FALLBACK, 'fallback_reason': 'AI service temporarily unavailable'}

    prompt = RESOLUTION_PROMPT.format(
        subject=ticket.subject,
        department=ticket.department.name,
        description=ticket.description[:600],
        priority=ticket.priority,
        ticket_type=ticket.ticket_type,
    )

    try:
        result = ai_client.chat_completion(
            messages=[
                {'role': 'system', 'content': SYSTEM_BASE},
                {'role': 'user',   'content': prompt},
            ],
            max_tokens=settings.AI_MAX_TOKENS_SUMMARY,
            temperature=0.3,
            user_id=user_id,
            ip=ip,
        )
        record_success('groq')
        return {'ai_available': True, 'suggestion': result['content']}

    except ai_client.AIRateLimitError:
        return {**_FALLBACK, 'fallback_reason': 'Rate limit reached'}
    except ai_client.AITimeoutError:
        record_failure('groq')
        return {**_FALLBACK, 'fallback_reason': 'Resolution suggestion timed out'}
    except Exception as e:
        record_failure('groq')
        logger.error('suggest_resolution error: %s', e, exc_info=True)
        return {**_FALLBACK, 'fallback_reason': 'Resolution suggestion unavailable'}


# ── AI-05: Chat Assistant ─────────────────────────────────────────────────────

def _get_live_db_context() -> str:
    """
    Load AI context from the pre-built context file.
    Falls back to a quick live DB query if the file doesn't exist yet.
    """
    from .context_builder import load_context_file, format_context_for_ai, build_context_file

    ctx = load_context_file()

    if ctx is None:
        # First run — build it now synchronously
        logger.info('Context file missing — building now')
        build_context_file()
        ctx = load_context_file()

    return format_context_for_ai(ctx)


def chat_with_assistant(
    conversation_history: list[dict],
    user_message: str,
    ticket_context: dict | None = None,
    user_id: int | None = None,
    ip: str | None = None,
) -> dict:
    """
    Chat assistant with live DB context injection.
    Queries real ticket/department data on every request so the AI
    always answers based on what's actually in the system right now.
    """
    if not _ai_enabled():
        return {
            **_FALLBACK,
            'message': 'AI assistant is currently disabled. Please use manual workflows.',
        }
    if is_open('groq'):
        return {
            **_FALLBACK,
            'message': 'AI assistant is temporarily offline. Please try again shortly.',
        }

    # Build live context from context file (all tickets, dept summary)
    live_context = _get_live_db_context()

    # If the user's message mentions a specific ticket number, inject its full detail
    import re as _re
    mentioned = _re.findall(r'TKT-\d+', user_message.upper())
    ticket_detail_ctx = ''
    if mentioned:
        from .context_builder import get_ticket_from_context
        details = []
        for tkt_num in mentioned[:3]:  # max 3 per message
            t = get_ticket_from_context(tkt_num)
            if t:
                comments_text = '\n    '.join(
                    f'[{c["at"]}] {c["author"]}: {c["body"]}' for c in t.get('comments', [])
                ) or 'No comments.'
                details.append(
                    f'FULL DETAIL FOR {t["ticket_number"]}:\n'
                    f'  Subject:     {t["subject"]}\n'
                    f'  Description: {t["description"]}\n'
                    f'  Type:        {t["type"]}\n'
                    f'  Status:      {t["status"]}\n'
                    f'  Priority:    {t["priority"]}\n'
                    f'  Department:  {t["department"]}\n'
                    f'  Assignee:    {t["assignee"]}\n'
                    f'  Created by:  {t["created_by"]}\n'
                    f'  Created at:  {t["created_at"]}\n'
                    f'  Updated at:  {t["updated_at"]}\n'
                    f'  SLA status:  {t["sla_status"]}\n'
                    f'  Tags:        {", ".join(t["tags"]) if t["tags"] else "none"}\n'
                    f'  Category:    {t["category"] or "none"}\n'
                    f'  Recent comments:\n    {comments_text}'
                )
            else:
                details.append(f'{tkt_num}: not found in context file.')
        if details:
            ticket_detail_ctx = '\n\n' + '\n\n'.join(details)

    # Build optional ticket-specific context
    ticket_ctx_text = ''
    if ticket_context:
        ticket_ctx_text = (
            f'\nCURRENT TICKET BEING VIEWED:\n'
            f'  Ticket: {ticket_context.get("ticket_number", "")}\n'
            f'  Subject: {ticket_context.get("subject", "")}\n'
            f'  Status: {ticket_context.get("status", "")}\n'
            f'  Priority: {ticket_context.get("priority", "")}\n'
            f'  Department: {ticket_context.get("department", "")}\n'
        )

    system_content = CHAT_SYSTEM.format(
        ticket_context=f'\n{live_context}{ticket_detail_ctx}{ticket_ctx_text}'
    )

    system_msg = {'role': 'system', 'content': system_content}
    history = conversation_history[-10:] if conversation_history else []
    messages = [system_msg] + history + [{'role': 'user', 'content': user_message}]

    try:
        result = ai_client.chat_completion(
            messages=messages,
            max_tokens=settings.AI_MAX_TOKENS_CHAT,
            temperature=0.3,
            user_id=user_id,
            ip=ip,
        )
        record_success('groq')
        # Get usage for this user
        usage = ai_client.get_user_usage(user_id) if user_id else {}
        return {
            'ai_available':    True,
            'message':         result['content'],
            'tokens_this_req': result.get('tokens_used', 0),
            'usage':           usage,
        }

    except ai_client.AIRateLimitError:
        return {**_FALLBACK, 'message': 'Daily AI limit reached. Manual mode active.'}
    except ai_client.AITimeoutError:
        record_failure('groq')
        return {**_FALLBACK, 'message': 'Assistant took too long. Please try again.'}
    except Exception as e:
        record_failure('groq')
        logger.error('chat_with_assistant error: %s', e, exc_info=True)
        return {**_FALLBACK, 'message': 'Assistant unavailable. Use manual workflow.'}


# ── AI-07: Duplicate Detection (lightweight, no embeddings) ───────────────────

def find_duplicates(
    subject: str,
    description: str,
    department_id: int,
    exclude_ticket_id: int | None = None,
) -> dict:
    """
    Find potential duplicate tickets using LLM comparison.
    Compares against last 50 open tickets in the same department.
    """
    if not _ai_enabled():
        return {'ai_available': False, 'duplicates': []}
    if is_open('groq'):
        return {'ai_available': False, 'duplicates': []}

    from tickets.models import Ticket
    qs = Ticket.objects.filter(
        department_id=department_id,
        status__in=['open', 'assigned', 'in_progress'],
    ).exclude(id=exclude_ticket_id or 0).order_by('-created_at')[:50]

    if not qs.exists():
        return {'ai_available': True, 'duplicates': []}

    existing = '\n'.join([
        f'- {t.ticket_number}: {t.subject[:100]}'
        for t in qs
    ])

    prompt = DUPLICATE_CHECK_PROMPT.format(
        subject=subject[:200],
        description=description[:400],
        existing_tickets=existing,
    )

    try:
        raw = ai_client.chat_completion(
            messages=[
                {'role': 'system', 'content': SYSTEM_BASE},
                {'role': 'user',   'content': prompt},
            ],
            max_tokens=300,
            temperature=0.1,
        )
        data  = _extract_json(raw['content'])
        dupes = data.get('duplicates', [])
        record_success('groq')
        return {'ai_available': True, 'duplicates': dupes[:5]}

    except Exception as e:
        record_failure('groq')
        logger.warning('find_duplicates error: %s', e)
        return {'ai_available': False, 'duplicates': []}
