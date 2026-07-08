"""
tickets/services.py — ALL ticket business logic lives here.
Views are thin — they only validate input and call these methods.
"""
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction

from .models import Ticket
from audit.services import AuditService
from notifications.services import NotificationService

User = get_user_model()


class TicketService:

    @staticmethod
    @transaction.atomic
    def assign_ticket(ticket: Ticket, assignee_id: int, assigned_by: User) -> Ticket:
        """Assign ticket to a user. Sets status to 'assigned'."""
        assignee = User.objects.get(id=assignee_id)
        old_assignee = ticket.assignee

        ticket.assignee = assignee
        if ticket.status == Ticket.Status.OPEN:
            ticket.status = Ticket.Status.ASSIGNED
        ticket.save(update_fields=['assignee', 'status', 'updated_at'])

        AuditService.log(
            ticket=ticket,
            action='assign',
            performed_by=assigned_by,
            old_value=old_assignee.full_name if old_assignee else None,
            new_value=assignee.full_name,
            extra_data={
                'assignee_id': assignee.id,
                'assignee_name': assignee.full_name,
                'prev_assignee_id': old_assignee.id if old_assignee else None,
                'prev_assignee_name': old_assignee.full_name if old_assignee else None,
            },
        )
        NotificationService.notify_assignment(ticket, assignee)

        return ticket

    @staticmethod
    @transaction.atomic
    def change_status(ticket: Ticket, new_status: str, performed_by: User, resolution: str = '') -> Ticket:
        """Change ticket status with full audit trail."""
        old_status = ticket.status

        if old_status == new_status:
            return ticket

        ticket.status = new_status

        if new_status == Ticket.Status.RESOLVED:
            ticket.resolved_at = timezone.now()
        elif new_status == Ticket.Status.CLOSED:
            ticket.closed_at = timezone.now()

        ticket.save(update_fields=['status', 'resolved_at', 'closed_at', 'updated_at'])

        AuditService.log(
            ticket=ticket,
            action='status_change',
            performed_by=performed_by,
            old_value=old_status,
            new_value=new_status,
            extra_data={'resolution': resolution} if resolution else None,
        )
        NotificationService.notify_status_change(ticket, performed_by, old_status, new_status)

        return ticket

    @staticmethod
    @transaction.atomic
    def create_ticket(data: dict, created_by: User) -> Ticket:
        """Create ticket, then auto-assign to dept head if one exists."""
        from tickets.serializers import TicketCreateSerializer
        serializer = TicketCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save(created_by=created_by)

        AuditService.log(
            ticket=ticket,
            action='created',
            performed_by=created_by,
            new_value=ticket.ticket_number,
        )

        # Auto-assign to dept head
        dept_head = User.objects.filter(
            department=ticket.department,
            role='DEPT_HEAD',
            is_active=True,
        ).first()
        if dept_head:
            ticket.assignee = dept_head
            ticket.status = Ticket.Status.ASSIGNED
            ticket.save(update_fields=['assignee', 'status', 'updated_at'])
            AuditService.log(
                ticket=ticket,
                action='assign',
                performed_by=created_by,
                old_value=None,
                new_value=dept_head.full_name,
                extra_data={
                    'assignee_id': dept_head.id,
                    'assignee_name': dept_head.full_name,
                    'prev_assignee_id': None,
                    'prev_assignee_name': None,
                },
            )
            NotificationService.notify_assignment(ticket, dept_head)

        return ticket

    @staticmethod
    @transaction.atomic
    def escalate_ticket(ticket: Ticket, performed_by: User) -> Ticket:
        old_status = ticket.status
        ticket.status = Ticket.Status.ESCALATED
        ticket.save(update_fields=['status', 'updated_at'])

        AuditService.log(
            ticket=ticket,
            action='escalate',
            performed_by=performed_by,
            old_value=old_status,
            new_value=Ticket.Status.ESCALATED,
        )
        return ticket
