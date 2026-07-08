"""
tickets/models.py — Core ticket models
Ticket, InsuranceField, InternalField, Attachment
"""
from django.db import models
from django.conf import settings
from django.utils import timezone


class Ticket(models.Model):

    class Status(models.TextChoices):
        OPEN        = 'open',        'Open'
        ASSIGNED    = 'assigned',    'Assigned'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED    = 'resolved',    'Resolved'
        CLOSED      = 'closed',      'Closed'
        ESCALATED   = 'escalated',   'Escalated'
        ON_HOLD     = 'on_hold',     'On Hold'
        REVIEW      = 'review',      'Review'

    class Priority(models.TextChoices):
        CRITICAL = 'critical', 'Critical'
        HIGH     = 'high',     'High'
        MEDIUM   = 'medium',   'Medium'
        LOW      = 'low',      'Low'

    class TicketType(models.TextChoices):
        INSURANCE = 'insurance', 'Insurance'
        INTERNAL  = 'internal',  'Internal'

    # Core fields
    ticket_number    = models.CharField(max_length=20, unique=True, db_index=True)
    ticket_type      = models.CharField(max_length=20, choices=TicketType.choices, default=TicketType.INTERNAL)
    subject          = models.CharField(max_length=500)
    description      = models.TextField()
    status           = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)
    priority         = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM, db_index=True)
    tags             = models.JSONField(default=list, blank=True)
    problem_category = models.CharField(max_length=200, blank=True)
    sub_problem      = models.CharField(max_length=200, blank=True)

    # Relations
    department  = models.ForeignKey(
        'departments.Department',
        on_delete=models.PROTECT,
        related_name='tickets',
    )
    created_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='created_tickets',
    )
    assignee    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_tickets',
    )

    # SLA
    sla_deadline  = models.DateTimeField(null=True, blank=True)
    sla_breached  = models.BooleanField(default=False, db_index=True)
    sla_breach_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at  = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at  = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at   = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'tms_tickets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['department', 'status']),
            models.Index(fields=['assignee', 'status']),
            models.Index(fields=['created_by']),
        ]

    def __str__(self):
        return f'{self.ticket_number}: {self.subject[:50]}'

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = self._generate_ticket_number()
        if not self.sla_deadline:
            self._set_sla_deadline()
        super().save(*args, **kwargs)

    def _generate_ticket_number(self) -> str:
        last = Ticket.objects.order_by('-id').first()
        next_id = (last.id + 1) if last else 1
        return f'TKT-{str(next_id).zfill(4)}'

    def _set_sla_deadline(self):
        """Calculate SLA deadline based on priority and department SLA config."""
        try:
            dept = self.department
            if self.priority in ('critical',):
                hours = dept.sla_critical_hours
            elif self.priority in ('high',):
                hours = dept.sla_high_hours
            elif self.priority == 'medium':
                hours = dept.sla_high_hours * 2
            else:  # low
                hours = dept.sla_high_hours * 3
            from datetime import timedelta
            self.sla_deadline = timezone.now() + timedelta(hours=hours)
        except Exception:
            pass


class InsuranceField(models.Model):
    """Extra fields for insurance-type tickets."""
    ticket          = models.OneToOneField(
        Ticket, on_delete=models.CASCADE, related_name='insurance_fields'
    )
    policy_number   = models.CharField(max_length=100, blank=True)
    claim_number    = models.CharField(max_length=100, blank=True)
    insurer_name    = models.CharField(max_length=200, blank=True)
    insurer_contact = models.CharField(max_length=200, blank=True)

    class Meta:
        db_table = 'tms_insurance_fields'


class InternalField(models.Model):
    """Extra fields for internal-type tickets."""
    ticket          = models.OneToOneField(
        Ticket, on_delete=models.CASCADE, related_name='internal_fields'
    )
    affected_system = models.CharField(max_length=200, blank=True)
    business_impact = models.CharField(max_length=500, blank=True)

    class Meta:
        db_table = 'tms_internal_fields'


class Attachment(models.Model):
    ticket      = models.ForeignKey(
        Ticket, on_delete=models.CASCADE, related_name='attachments'
    )
    filename    = models.CharField(max_length=255)
    file        = models.FileField(upload_to='attachments/%Y/%m/')
    size        = models.PositiveIntegerField(default=0)  # bytes
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='uploaded_attachments',
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tms_attachments'
        ordering = ['-uploaded_at']

    @property
    def url(self):
        return self.file.url if self.file else ''
