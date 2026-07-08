"""
ai_engine/context_builder.py

Builds and maintains a flat JSON context file containing the full ticket table.
The file is written to disk on every ticket/comment change via Django signals.
The AI reads from this file instead of hitting the DB on every chat request.

File location: BASE_DIR/ai_context/tickets_context.json
File is regenerated atomically (write to .tmp then rename) so reads never see partial data.
"""

import json
import logging
import os
import tempfile
from pathlib import Path
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger('ai_engine')

CONTEXT_DIR  = Path(settings.BASE_DIR) / 'ai_context'
CONTEXT_FILE = CONTEXT_DIR / 'tickets_context.json'


def _ensure_dir():
    CONTEXT_DIR.mkdir(exist_ok=True)


def build_context_file() -> bool:
    """
    Query all tickets from DB and write full context to disk.
    Returns True on success, False on failure.
    Called from signals — must never raise.
    """
    try:
        _ensure_dir()
        from tickets.models import Ticket
        from departments.models import Department

        now = timezone.now()

        # ── Full ticket table ──────────────────────────────────────────────
        tickets_qs = Ticket.objects.select_related(
            'department', 'created_by', 'assignee'
        ).prefetch_related('comments').order_by('-created_at')

        tickets_data = []
        for t in tickets_qs:
            # Last 3 comments per ticket for context
            comments = [
                {
                    'author': c.author.full_name if hasattr(c.author, 'full_name') else str(c.author),
                    'body':   c.body[:300],
                    'at':     c.created_at.strftime('%d %b %Y %H:%M'),
                }
                for c in list(t.comments.order_by('-created_at')[:3])
            ]

            # SLA time remaining
            sla_info = ''
            if t.sla_deadline:
                delta = t.sla_deadline - now
                if t.sla_breached:
                    sla_info = f'BREACHED by {abs(int(delta.total_seconds() / 60))} min'
                elif delta.total_seconds() > 0:
                    sla_info = f'{int(delta.total_seconds() / 60)} min remaining'
                else:
                    sla_info = 'BREACHED'

            tickets_data.append({
                'ticket_number': t.ticket_number,
                'subject':       t.subject,
                'description':   t.description[:500],
                'type':          t.ticket_type,
                'status':        t.status,
                'priority':      t.priority,
                'department':    t.department.name,
                'dept_code':     t.department.code,
                'created_by':    t.created_by.full_name if hasattr(t.created_by, 'full_name') else str(t.created_by),
                'assignee':      t.assignee.full_name if t.assignee and hasattr(t.assignee, 'full_name') else 'Unassigned',
                'tags':          t.tags or [],
                'category':      t.problem_category or '',
                'sla_deadline':  t.sla_deadline.strftime('%d %b %Y %H:%M') if t.sla_deadline else '',
                'sla_status':    sla_info,
                'sla_breached':  t.sla_breached,
                'created_at':    t.created_at.strftime('%d %b %Y %H:%M'),
                'updated_at':    t.updated_at.strftime('%d %b %Y %H:%M'),
                'resolved_at':   t.resolved_at.strftime('%d %b %Y %H:%M') if t.resolved_at else '',
                'comments':      comments,
            })

        # ── Department summary ─────────────────────────────────────────────
        active_statuses = ['open', 'assigned', 'in_progress', 'escalated']
        dept_summary = []
        for dept in Department.objects.filter(is_active=True).order_by('name'):
            dept_tickets = [t for t in tickets_data if t['dept_code'] == dept.code]
            active  = [t for t in dept_tickets if t['status'] in active_statuses]
            breached = [t for t in active if t['sla_breached']]
            dept_summary.append({
                'name':          dept.name,
                'code':          dept.code,
                'active':        len(active),
                'critical':      sum(1 for t in active if t['priority'] == 'critical'),
                'high':          sum(1 for t in active if t['priority'] == 'high'),
                'sla_breached':  len(breached),
                'unassigned':    sum(1 for t in active if t['assignee'] == 'Unassigned'),
            })

        # ── Overall stats ──────────────────────────────────────────────────
        all_active   = [t for t in tickets_data if t['status'] in active_statuses]
        all_breached = [t for t in all_active if t['sla_breached']]

        context = {
            'generated_at':   now.strftime('%d %b %Y %H:%M UTC'),
            'total_tickets':  len(tickets_data),
            'total_active':   len(all_active),
            'total_breached': len(all_breached),
            'unassigned':     sum(1 for t in all_active if t['assignee'] == 'Unassigned'),
            'dept_summary':   dept_summary,
            'tickets':        tickets_data,
        }

        # Atomic write — never leave a partial file
        tmp_fd, tmp_path = tempfile.mkstemp(dir=CONTEXT_DIR, suffix='.tmp')
        try:
            with os.fdopen(tmp_fd, 'w', encoding='utf-8') as f:
                json.dump(context, f, ensure_ascii=False, indent=2)
            os.replace(tmp_path, CONTEXT_FILE)
        except Exception:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
            raise

        logger.info('AI context file rebuilt: %d tickets written to %s', len(tickets_data), CONTEXT_FILE)
        return True

    except Exception as e:
        logger.error('build_context_file failed: %s', e, exc_info=True)
        return False


def load_context_file() -> dict | None:
    """
    Load the context file from disk.
    Returns None if file doesn't exist or is unreadable.
    """
    try:
        if not CONTEXT_FILE.exists():
            return None
        with open(CONTEXT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.warning('load_context_file failed: %s', e)
        return None


def get_ticket_from_context(ticket_number: str) -> dict | None:
    """Look up a specific ticket by number from the context file."""
    ctx = load_context_file()
    if not ctx:
        return None
    for t in ctx.get('tickets', []):
        if t.get('ticket_number', '').upper() == ticket_number.upper():
            return t
    return None


def format_context_for_ai(ctx: dict) -> str:
    """
    Format context for the AI system prompt.
    Sends: system stats + department table + recent/breached tickets summary.
    Individual ticket full details are injected separately by chat_with_assistant.
    Kept compact to stay within Groq token limits.
    """
    if not ctx:
        return '(Context file not available.)'

    lines = []
    lines.append(f'SYSTEM SNAPSHOT (generated: {ctx.get("generated_at", "unknown")})')
    lines.append(f'Total tickets: {ctx.get("total_tickets", 0)} | Active: {ctx.get("total_active", 0)} | SLA breached: {ctx.get("total_breached", 0)} | Unassigned: {ctx.get("unassigned", 0)}')

    # Department summary table
    dept_sum = ctx.get('dept_summary', [])
    if dept_sum:
        lines.append('')
        lines.append('DEPARTMENT WORKLOAD:')
        lines.append(f'{"Department":<28} {"Active":>6} {"Crit":>5} {"High":>5} {"Breached":>8} {"Unassigned":>10}')
        lines.append('-' * 68)
        for d in dept_sum:
            lines.append(
                f'{d["name"]:<28} {d["active"]:>6} {d["critical"]:>5} {d["high"]:>5} '
                f'{d["sla_breached"]:>8} {d["unassigned"]:>10}'
            )

    # Breached tickets (up to 15)
    active_statuses = {'open', 'assigned', 'in_progress', 'escalated'}
    tickets = ctx.get('tickets', [])
    breached = [t for t in tickets if t['sla_breached'] and t['status'] in active_statuses][:15]
    if breached:
        lines.append('')
        lines.append('ACTIVE SLA BREACHES:')
        for t in breached:
            lines.append(f'  {t["ticket_number"]} [{t["priority"].upper()}] {t["dept_code"]}: {t["subject"][:70]} (assignee: {t["assignee"]})')

    # Most recent 10 active tickets
    active = [t for t in tickets if t['status'] in active_statuses][:10]
    if active:
        lines.append('')
        lines.append('MOST RECENT ACTIVE TICKETS:')
        lines.append(f'{"Ticket":<12} {"Status":<13} {"Priority":<10} {"Dept":<14} {"Assignee":<20} Subject')
        lines.append('-' * 100)
        for t in active:
            lines.append(
                f'{t["ticket_number"]:<12} {t["status"]:<13} {t["priority"]:<10} '
                f'{t["dept_code"]:<14} {t["assignee"][:18]:<20} {t["subject"][:40]}'
            )

    lines.append('')
    lines.append('NOTE: To get full details on any specific ticket, the user can ask by ticket number (e.g. TKT-0256) and full detail will be provided automatically.')

    return '\n'.join(lines)
