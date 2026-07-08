"""
audit/models.py — AuditLog (IMMUTABLE — no UPDATE/DELETE)
Every ticket state change must write here.
"""
from django.db import models
from django.conf import settings


class AuditLog(models.Model):

    class Action(models.TextChoices):
        CREATED       = 'created',       'Created'
        ASSIGN        = 'assign',        'Assigned'
        STATUS_CHANGE = 'status_change', 'Status Changed'
        RESOLVE       = 'resolve',       'Resolved'
        CLOSE         = 'close',         'Closed'
        ESCALATE      = 'escalate',      'Escalated'
        REOPEN        = 'reopen',        'Reopened'
        COMMENT       = 'comment',       'Comment Added'
        ATTACHMENT    = 'attachment',    'Attachment Added'
        PRIORITY_CHANGE = 'priority_change', 'Priority Changed'
        UPDATE        = 'update',        'Updated'

    ticket       = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.PROTECT,
        related_name='audit_logs',
    )
    action       = models.CharField(max_length=30, choices=Action.choices)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='audit_logs',
    )
    old_value    = models.TextField(blank=True, null=True)
    new_value    = models.TextField(blank=True, null=True)
    extra_data   = models.JSONField(blank=True, null=True)  # flexible additional context
    created_at   = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'audit.audit_logs'
        ordering = ['-created_at']
        # No UPDATE/DELETE permissions should be granted to the app DB user

    def __str__(self):
        return f'[{self.action}] ticket={self.ticket_id} by={self.performed_by_id}'

    def save(self, *args, **kwargs):
        # Prevent updates — audit is immutable
        if self.pk:
            raise PermissionError('AuditLog records are immutable.')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise PermissionError('AuditLog records cannot be deleted.')
