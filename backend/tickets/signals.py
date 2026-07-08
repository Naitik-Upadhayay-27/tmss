"""
tickets/signals.py — Ticket signal handlers.
Registered in tickets/apps.py ready().
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


def _rebuild_ai_context():
    """Rebuild the AI context file. Runs synchronously but is fast (file write)."""
    try:
        from ai_engine.context_builder import build_context_file
        build_context_file()
    except Exception:
        pass  # never block ticket operations


@receiver(post_save, sender='tickets.Ticket')
def ticket_post_save(sender, instance, created, **kwargs):
    """Rebuild AI context on any ticket create/update. Also fire async AI analysis on new tickets."""
    # Always rebuild context file — so AI has full up-to-date data
    _rebuild_ai_context()

    # Fire async AI classification only on new tickets
    if created:
        try:
            from django.conf import settings
            if getattr(settings, 'AI_SERVICE_ENABLED', False):
                from celery import current_app
                current_app.send_task(
                    'ai_engine.tasks.analyse_ticket_async',
                    args=[instance.id],
                    queue='ai_tasks',
                    ignore_result=True,
                    countdown=2,
                )
        except Exception:
            pass  # Celery unavailable — never block ticket creation


@receiver(post_save, sender='comments.Comment')
def comment_post_save(sender, instance, created, **kwargs):
    """Rebuild AI context when a comment is added — so AI sees latest conversation."""
    _rebuild_ai_context()


@receiver(post_delete, sender='tickets.Ticket')
def ticket_post_delete(sender, instance, **kwargs):
    """Rebuild context when a ticket is deleted."""
    _rebuild_ai_context()
