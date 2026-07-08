"""
reports/views.py — Aggregation endpoints for admin + dept head dashboards.
"""
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.permissions import IsSuperAdminOrDeptHead
from tickets.models import Ticket


@api_view(['GET'])
@permission_classes([IsSuperAdminOrDeptHead])
def ticket_stats(request):
    """GET /api/v1/reports/tickets/ — overall ticket stats."""
    user = request.user
    qs = Ticket.objects.all()
    if user.role == 'DEPT_HEAD':
        qs = qs.filter(department=user.department)

    now = timezone.now()
    last_30 = now - timedelta(days=30)

    stats = qs.aggregate(
        total=Count('id'),
        open=Count('id', filter=Q(status='open')),
        in_progress=Count('id', filter=Q(status='in_progress')),
        resolved=Count('id', filter=Q(status='resolved')),
        closed=Count('id', filter=Q(status='closed')),
        escalated=Count('id', filter=Q(status='escalated')),
        sla_breached=Count('id', filter=Q(sla_breached=True)),
        critical=Count('id', filter=Q(priority='critical')),
        high=Count('id', filter=Q(priority='high')),
        medium=Count('id', filter=Q(priority='medium')),
        low=Count('id', filter=Q(priority='low')),
        created_last_30d=Count('id', filter=Q(created_at__gte=last_30)),
    )

    # By department (admin only)
    by_dept = []
    if user.role == 'SUPER_ADMIN':
        by_dept = list(
            Ticket.objects.values('department__id', 'department__name', 'department__code')
            .annotate(total=Count('id'), breached=Count('id', filter=Q(sla_breached=True)))
            .order_by('-total')
        )

    return Response({'data': {**stats, 'by_department': by_dept}})


@api_view(['GET'])
@permission_classes([IsSuperAdminOrDeptHead])
def sla_report(request):
    """GET /api/v1/reports/sla/ — SLA breach metrics."""
    user = request.user
    qs = Ticket.objects.all()
    if user.role == 'DEPT_HEAD':
        qs = qs.filter(department=user.department)

    total   = qs.count()
    breached = qs.filter(sla_breached=True).count()
    breach_rate = round((breached / total * 100), 1) if total else 0

    by_priority = list(
        qs.values('priority')
        .annotate(
            total=Count('id'),
            breached=Count('id', filter=Q(sla_breached=True)),
        )
        .order_by('priority')
    )

    return Response({'data': {
        'total':        total,
        'breached':     breached,
        'breach_rate':  breach_rate,
        'by_priority':  by_priority,
    }})


@api_view(['GET'])
@permission_classes([IsSuperAdminOrDeptHead])
def agent_performance(request):
    """GET /api/v1/reports/agents/ — per-agent ticket stats."""
    user = request.user
    qs = Ticket.objects.all()
    if user.role == 'DEPT_HEAD':
        qs = qs.filter(department=user.department)

    agents = list(
        qs.filter(assignee__isnull=False)
        .values(
            'assignee__id',
            'assignee__first_name',
            'assignee__last_name',
            'assignee__email',
        )
        .annotate(
            assigned=Count('id'),
            resolved=Count('id', filter=Q(status='resolved')),
            closed=Count('id', filter=Q(status='closed')),
            breached=Count('id', filter=Q(sla_breached=True)),
        )
        .order_by('-assigned')
    )

    return Response({'data': agents})
