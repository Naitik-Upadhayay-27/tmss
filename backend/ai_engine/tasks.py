"""
ai_engine/tasks.py — Celery tasks for async AI processing.
All tasks run in 'ai_tasks' queue.
When CELERY_ENABLED=False they run synchronously (eager mode) — no Redis needed.
"""
import logging
from celery import shared_task

logger = logging.getLogger('ai_engine')


@shared_task(queue='ai_tasks', bind=True, max_retries=2, default_retry_delay=30)
def analyse_ticket_async(self, ticket_id: int):
    """
    Fired by tickets.signals when a new ticket is created.
    Runs classification + stores result in AIAnalysisCache.
    Never blocks ticket creation — runs in background.
    """
    try:
        from tickets.models import Ticket
        from .models import AIAnalysisCache
        from . import services as ai_services
        from .prompts import PROMPT_VERSION

        ticket = Ticket.objects.select_related('department').get(pk=ticket_id)

        result = ai_services.classify_ticket(
            subject=ticket.subject,
            description=ticket.description,
            ticket_type=ticket.ticket_type,
            department=ticket.department.name,
        )

        if result.get('ai_available'):
            AIAnalysisCache.objects.update_or_create(
                ticket=ticket,
                defaults={
                    'suggested_priority':  result.get('suggested_priority', ''),
                    'priority_reason':     result.get('priority_reason', ''),
                    'suggested_category':  result.get('suggested_category', ''),
                    'category_reason':     result.get('category_reason', ''),
                    'suggested_tags':      result.get('suggested_tags', []),
                    'sentiment':           result.get('sentiment', ''),
                    'confidence':          result.get('confidence'),
                    'prompt_version':      PROMPT_VERSION,
                    'used_fallback':       False,
                }
            )
            logger.info('AI analysis cached for ticket %s', ticket.ticket_number)
        else:
            AIAnalysisCache.objects.update_or_create(
                ticket=ticket,
                defaults={'used_fallback': True, 'prompt_version': PROMPT_VERSION}
            )

    except Exception as exc:
        logger.error('analyse_ticket_async error for ticket %s: %s', ticket_id, exc)
        raise self.retry(exc=exc)


@shared_task(queue='ai_tasks', bind=True, max_retries=1)
def generate_summary_async(self, ticket_id: int):
    """Generate and cache ticket summary on demand."""
    try:
        from tickets.models import Ticket
        from . import services as ai_services

        ticket = Ticket.objects.select_related(
            'department', 'assignee', 'created_by'
        ).get(pk=ticket_id)
        ai_services.summarise_ticket(ticket)
        logger.info('Summary generated for ticket %s', ticket_id)

    except Exception as exc:
        logger.error('generate_summary_async error: %s', exc)
        raise self.retry(exc=exc)
