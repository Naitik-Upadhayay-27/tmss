"""
notifications/services.py — NotificationService
All notification creation goes through here.
"""
from .models import Notification


class NotificationService:

    @staticmethod
    def notify(recipient, title: str, message: str, ticket=None):
        """Create an in-app notification."""
        Notification.objects.create(
            recipient=recipient,
            title=title,
            message=message,
            ticket=ticket,
            ticket_number=ticket.ticket_number if ticket else '',
        )

    @staticmethod
    def notify_assignment(ticket, assignee):
        NotificationService.notify(
            recipient=assignee,
            title=f'Ticket assigned: {ticket.ticket_number}',
            message=f'You have been assigned ticket "{ticket.subject}".',
            ticket=ticket,
        )

    @staticmethod
    def notify_status_change(ticket, performed_by, old_status, new_status):
        if ticket.created_by_id != performed_by.id:
            NotificationService.notify(
                recipient=ticket.created_by,
                title=f'Ticket {ticket.ticket_number} status updated',
                message=f'Status changed from {old_status} to {new_status}.',
                ticket=ticket,
            )

    @staticmethod
    def notify_sla_breach(ticket):
        """Notify dept head + assignee on SLA breach."""
        if ticket.assignee:
            NotificationService.notify(
                recipient=ticket.assignee,
                title=f'SLA breached: {ticket.ticket_number}',
                message=f'Ticket "{ticket.subject}" has breached its SLA deadline.',
                ticket=ticket,
            )
        try:
            head = ticket.department.head
            if head:
                NotificationService.notify(
                    recipient=head,
                    title=f'SLA breach in your department: {ticket.ticket_number}',
                    message=f'Ticket "{ticket.subject}" has breached its SLA.',
                    ticket=ticket,
                )
        except Exception:
            pass
