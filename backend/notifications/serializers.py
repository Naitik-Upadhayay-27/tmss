from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = [
            'id', 'recipient', 'title', 'message',
            'ticket', 'ticket_number', 'is_read', 'starred', 'created_at',
        ]
        read_only_fields = fields
