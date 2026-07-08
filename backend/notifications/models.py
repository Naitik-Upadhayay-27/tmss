"""
notifications/models.py
"""
from django.db import models
from django.conf import settings


class Notification(models.Model):
    recipient     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title         = models.CharField(max_length=200)
    message       = models.TextField()
    ticket        = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='notifications',
    )
    ticket_number = models.CharField(max_length=20, blank=True)  # denormalized
    is_read       = models.BooleanField(default=False, db_index=True)
    starred       = models.BooleanField(default=False)
    created_at    = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'audit.notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.recipient_id}] {self.title}'


class EmailLog(models.Model):
    """Tracks all outgoing emails for debugging."""
    recipient_email = models.EmailField()
    subject         = models.CharField(max_length=200)
    template        = models.CharField(max_length=100)
    ticket          = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.SET_NULL,
        null=True, blank=True,
    )
    sent_at         = models.DateTimeField(auto_now_add=True)
    success         = models.BooleanField(default=True)
    error_message   = models.TextField(blank=True)

    class Meta:
        db_table = 'audit.email_logs'
        ordering = ['-sent_at']
