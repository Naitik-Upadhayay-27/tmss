"""
audit/services.py — AuditService
All audit writes go through here, never directly.
"""
from .models import AuditLog


class AuditService:

    @staticmethod
    def log(ticket, action: str, performed_by, old_value=None, new_value=None, extra_data=None):
        """Create an immutable audit entry. Call after every state change."""
        AuditLog.objects.create(
            ticket=ticket,
            action=action,
            performed_by=performed_by,
            old_value=str(old_value) if old_value is not None else None,
            new_value=str(new_value) if new_value is not None else None,
            extra_data=extra_data,
        )
