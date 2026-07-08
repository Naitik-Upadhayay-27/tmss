"""
ai_engine/views.py — Phase 2 AI endpoints.
All endpoints return { ai_available: bool, ... }.
Frontend always checks ai_available before rendering AI content.
"""
import logging
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import services as ai_services
from . import client as ai_client
from .models import TrainingFeedback, AIRequestLog

logger = logging.getLogger('ai_engine')


def _get_ip(request) -> str:
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    return xff.split(',')[0].strip() if xff else request.META.get('REMOTE_ADDR', '')


def _log_request(request, feature: str, success: bool = True, error_type: str = ''):
    try:
        AIRequestLog.objects.create(
            user=request.user if request.user.is_authenticated else None,
            ip_address=_get_ip(request),
            feature=feature,
            model_used=settings.GROQ_CHAT_MODEL,
            success=success,
            error_type=error_type,
        )
    except Exception:
        pass


# ── AI Health (public) ────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([])
def health(request):
    """GET /api/v1/ai/health/ — public, no auth required."""
    if not getattr(settings, 'AI_SERVICE_ENABLED', False):
        return Response({'ai_available': False, 'status': 'AI service disabled'})
    result = ai_client.health_check()
    ai_up  = result.get('groq', False)
    return Response({'ai_available': ai_up, **result}, status=200 if ai_up else 503)


# ── Usage (authenticated) ─────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usage(request):
    """GET /api/v1/ai/usage/ — Today's request + token count for the current user."""
    data = ai_client.get_user_usage(request.user.id)
    return Response(data)


# ── AI-01 & AI-02: Ticket Classification ──────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyse_ticket(request):
    """POST /api/v1/ai/analyse/"""
    subject     = str(request.data.get('subject', ''))[:300]
    description = str(request.data.get('description', ''))[:800]
    ticket_type = str(request.data.get('ticket_type', 'internal'))
    department  = str(request.data.get('department', ''))
    dept_id     = request.data.get('department_id')

    if not subject:
        return Response({'error': 'subject is required'}, status=400)

    classification = ai_services.classify_ticket(
        subject=subject, description=description,
        ticket_type=ticket_type, department=department,
        user_id=request.user.id, ip=_get_ip(request),
    )

    duplicates = {'ai_available': False, 'duplicates': []}
    if dept_id and description:
        duplicates = ai_services.find_duplicates(
            subject=subject, description=description, department_id=int(dept_id),
        )

    _log_request(request, 'classify', classification.get('ai_available', False))
    return Response({'classification': classification, 'duplicates': duplicates})


# ── AI-04: Ticket Summary ─────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def ticket_summary(request, ticket_id):
    """GET/POST /api/v1/ai/tickets/:id/summary/"""
    from tickets.models import Ticket
    from .models import AIAnalysisCache

    try:
        ticket = Ticket.objects.select_related('department', 'assignee', 'created_by').get(pk=ticket_id)
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, status=404)

    if request.method == 'POST':
        AIAnalysisCache.objects.filter(ticket=ticket).update(summary='')

    result = ai_services.summarise_ticket(ticket, user_id=request.user.id, ip=_get_ip(request))
    _log_request(request, 'summary', result.get('ai_available', False))
    return Response(result)


# ── AI-08: Resolution Suggestion ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resolution_suggestion(request, ticket_id):
    """GET /api/v1/ai/tickets/:id/resolution-suggestion/"""
    from tickets.models import Ticket

    try:
        ticket = Ticket.objects.select_related('department').get(pk=ticket_id)
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, status=404)

    result = ai_services.suggest_resolution(ticket, user_id=request.user.id, ip=_get_ip(request))
    _log_request(request, 'resolution', result.get('ai_available', False))
    return Response(result)


# ── AI-05: Chat Assistant ─────────────────────────────────────────────────────

# ── AI-05: Chat Assistant ─────────────────────────────────────────────────────

EXCEL_KEYWORDS = ('excel', 'xlsx', 'spreadsheet', 'csv', 'download', 'export')


def _parse_csv_from_response(text: str) -> dict | None:
    """
    If the response contains a CSV block (ends with EXCEL_READY),
    parse it and return {headers, rows}. Returns None otherwise.
    """
    if 'EXCEL_READY' not in text:
        return None
    lines = [l.strip() for l in text.replace('EXCEL_READY', '').strip().splitlines() if l.strip()]
    if len(lines) < 2:
        return None
    headers = [h.strip() for h in lines[0].split(',')]
    rows = [[c.strip() for c in line.split(',')] for line in lines[1:]]
    return {'headers': headers, 'rows': rows}


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    """POST /api/v1/ai/chat/ — Body: { message, history, ticket_id? }"""
    message   = str(request.data.get('message', ''))[:1000]
    history   = request.data.get('history', [])
    ticket_id = request.data.get('ticket_id')

    if not message.strip():
        return Response({'error': 'message is required'}, status=400)

    clean_history = [
        {'role': str(m.get('role', 'user'))[:10], 'content': str(m.get('content', ''))[:500]}
        for m in (history or [])
        if isinstance(m, dict)
    ][-20:]

    ticket_context = None
    if ticket_id:
        try:
            from tickets.models import Ticket
            t = Ticket.objects.select_related('department').get(pk=ticket_id)
            ticket_context = {
                'ticket_number': t.ticket_number,
                'subject': t.subject,
                'status': t.status,
                'priority': t.priority,
                'department': t.department.name,
            }
        except Exception:
            pass

    result = ai_services.chat_with_assistant(
        conversation_history=clean_history,
        user_message=message,
        ticket_context=ticket_context,
        user_id=request.user.id,
        ip=_get_ip(request),
    )
    _log_request(request, 'chat', result.get('ai_available', False))

    # Detect excel intent — parse CSV and attach table_data
    msg_lower = message.lower()
    is_excel_request = any(kw in msg_lower for kw in EXCEL_KEYWORDS)
    if is_excel_request and result.get('ai_available') and result.get('message'):
        table_data = _parse_csv_from_response(result['message'])
        if table_data:
            result['table_data'] = table_data
            result['message'] = 'Excel file ready. Click below to download.'

    return Response(result)


# ── AI Bulk Assign ───────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_assign(request):
    """
    POST /api/v1/ai/bulk-assign/
    SUPER_ADMIN: can assign across all departments.
    DEPT_HEAD:   strictly scoped to their own department only.
                 Assignees are MEMBER users of that department only — no fallback.
    """
    from tickets.models import Ticket
    from tickets.services import TicketService
    from django.contrib.auth import get_user_model
    User = get_user_model()

    user = request.user
    if user.role not in ('SUPER_ADMIN', 'DEPT_HEAD'):
        return Response({'error': 'Only Super Admins and Department Heads can bulk assign tickets.'}, status=403)

    subject_contains = str(request.data.get('subject_contains', '')).strip()
    problem_category = str(request.data.get('problem_category', '')).strip()

    if not subject_contains and not problem_category:
        return Response({'error': 'subject_contains or problem_category is required'}, status=400)

    # Base queryset — DEPT_HEAD is hard-scoped to their own department
    qs = Ticket.objects.select_related('department', 'assignee').filter(
        status__in=['open', 'assigned', 'in_progress', 'escalated']
    )
    if user.role == 'DEPT_HEAD':
        qs = qs.filter(department=user.department)

    if subject_contains:
        qs = qs.filter(subject__icontains=subject_contains)
    if problem_category:
        qs = qs.filter(problem_category__iexact=problem_category)

    if not qs.exists():
        return Response({'assigned': [], 'message': 'No matching tickets found.'})

    # Group tickets by department
    dept_tickets: dict[int, list] = {}
    for ticket in qs:
        dept_tickets.setdefault(ticket.department_id, []).append(ticket)

    assigned = []
    skipped = []
    for dept_id, tickets in dept_tickets.items():
        # Strictly MEMBER users of this department only — no fallback
        members = list(
            User.objects.filter(
                role='MEMBER', is_active=True, department_id=dept_id
            ).order_by('id')
        )
        if not members:
            skipped.extend([t.ticket_number for t in tickets])
            continue

        for i, ticket in enumerate(tickets):
            assignee = members[i % len(members)]
            try:
                TicketService.assign_ticket(
                    ticket=ticket,
                    assignee_id=assignee.id,
                    assigned_by=user,
                )
                assigned.append({
                    'ticket_id':     ticket.id,
                    'ticket_number': ticket.ticket_number,
                    'subject':       ticket.subject[:80],
                    'department':    ticket.department.name,
                    'assignee_id':   assignee.id,
                    'assignee_name': assignee.full_name,
                })
            except Exception as e:
                logger.warning('bulk_assign: failed to assign %s: %s', ticket.ticket_number, e)

    msg = f'{len(assigned)} ticket(s) assigned successfully.'
    if skipped:
        msg += f' {len(skipped)} skipped (no active members found): {', '.join(skipped)}'
    return Response({'assigned': assigned, 'message': msg})


# ── AI Feedback ───────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request):
    """POST /api/v1/ai/feedback/"""
    from tickets.models import Ticket

    ticket_id = request.data.get('ticket_id')
    if not ticket_id:
        return Response({'error': 'ticket_id required'}, status=400)

    try:
        ticket = Ticket.objects.get(pk=ticket_id)
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, status=404)

    TrainingFeedback.objects.create(
        ticket=ticket,
        submitted_by=request.user,
        feature=str(request.data.get('feature', ''))[:50],
        feedback_type=str(request.data.get('feedback_type', 'helpful'))[:30],
        ai_suggestion=str(request.data.get('ai_suggestion', ''))[:500],
        user_choice=str(request.data.get('user_choice', ''))[:500],
        notes=str(request.data.get('notes', ''))[:1000],
    )
    return Response({'status': 'Feedback recorded. Thank you!'})
