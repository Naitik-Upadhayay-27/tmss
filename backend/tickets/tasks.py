"""
tickets/tasks.py — Celery beat tasks for SLA checking.
check_sla_status runs every 5 minutes via Celery Beat.
"""
from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(queue='default')
def check_sla_status():
    """
    Mark tickets as sla_breached=True when sla_deadline has passed.
    Runs every 5 minutes (configured in Celery Beat).
    """
    from django.utils import timezone
    from .models import Ticket
    from notifications.services import NotificationService

    now = timezone.now()
    breached = Ticket.objects.filter(
        sla_deadline__lt=now,
        sla_breached=False,
        status__in=['open', 'assigned', 'in_progress', 'escalated', 'on_hold', 'review'],
    ).select_related('department', 'department__head', 'assignee')

    count = 0
    for ticket in breached:
        ticket.sla_breached  = True
        ticket.sla_breach_at = now
        ticket.save(update_fields=['sla_breached', 'sla_breach_at', 'updated_at'])
        NotificationService.notify_sla_breach(ticket)
        count += 1

    if count:
        logger.info('SLA check: marked %d tickets as breached', count)

    return count


@shared_task(queue='default')
def auto_close_after_review():
    """
    Auto-close tickets that have been in 'review' status for more than 48h
    without any action.
    """
    from django.utils import timezone
    from datetime import timedelta
    from .models import Ticket

    cutoff = timezone.now() - timedelta(hours=48)
    tickets = Ticket.objects.filter(
        status='review',
        updated_at__lt=cutoff,
    )
    count = tickets.update(status='closed')
    if count:
        logger.info('Auto-close: closed %d review tickets', count)
    return count
