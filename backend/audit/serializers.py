from rest_framework import serializers
from .models import AuditLog
from accounts.serializers import UserSerializer


class AuditLogSerializer(serializers.ModelSerializer):
    performed_by = UserSerializer(read_only=True)

    class Meta:
        model  = AuditLog
        fields = [
            'id', 'ticket', 'action', 'performed_by',
            'old_value', 'new_value', 'created_at',
        ]
        read_only_fields = fields
