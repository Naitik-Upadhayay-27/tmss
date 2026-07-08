"""
tickets/serializers.py — Full nested serialization matching frontend type contracts.
"""
from django.db import transaction
from rest_framework import serializers
from .models import Ticket, InsuranceField, InternalField, Attachment
from accounts.serializers import UserSerializer
from departments.serializers import DepartmentSerializer


class InsuranceFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model  = InsuranceField
        fields = ['policy_number', 'claim_number', 'insurer_name', 'insurer_contact']


class InternalFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model  = InternalField
        fields = ['affected_system', 'business_impact']


class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    url         = serializers.ReadOnlyField()

    class Meta:
        model  = Attachment
        fields = ['id', 'filename', 'url', 'size', 'uploaded_at', 'uploaded_by']
        read_only_fields = fields


class TicketSerializer(serializers.ModelSerializer):
    """Read serializer — full nested objects for frontend consumption."""
    department       = DepartmentSerializer(read_only=True)
    created_by       = UserSerializer(read_only=True)
    assignee         = UserSerializer(read_only=True)
    insurance_fields = InsuranceFieldSerializer(read_only=True)
    internal_fields  = InternalFieldSerializer(read_only=True)
    comment_count    = serializers.SerializerMethodField()
    attachment_count = serializers.SerializerMethodField()

    class Meta:
        model  = Ticket
        fields = [
            'id', 'ticket_number', 'ticket_type', 'subject', 'description',
            'status', 'priority', 'department', 'created_by', 'assignee',
            'tags', 'problem_category', 'sub_problem',
            'sla_deadline', 'sla_breached', 'sla_breach_at',
            'created_at', 'updated_at', 'resolved_at', 'closed_at',
            'insurance_fields', 'internal_fields',
            'comment_count', 'attachment_count',
        ]
        read_only_fields = [
            'id', 'ticket_number', 'sla_breached', 'sla_breach_at',
            'created_at', 'updated_at',
        ]

    def get_comment_count(self, obj):
        # Use annotated value if present (avoids extra query)
        if hasattr(obj, '_comment_count'):
            return obj._comment_count
        return obj.comments.count()

    def get_attachment_count(self, obj):
        if hasattr(obj, '_attachment_count'):
            return obj._attachment_count
        return obj.attachments.count()


class TicketCreateSerializer(serializers.ModelSerializer):
    """Write serializer for ticket creation."""
    insurance_fields = InsuranceFieldSerializer(required=False)
    internal_fields  = InternalFieldSerializer(required=False)
    department_id    = serializers.IntegerField(required=False)
    assignee_id      = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model  = Ticket
        fields = [
            'ticket_type', 'subject', 'description', 'priority',
            'department_id', 'assignee_id', 'tags',
            'problem_category', 'sub_problem',
            'insurance_fields', 'internal_fields',
        ]

    def validate(self, data):
        # Default department_id to user's department if not provided
        if 'department_id' not in data or not data['department_id']:
            # Get user from context safely
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                user = request.user
                if user.department:
                    data['department_id'] = user.department.id
                else:
                    # If user has no department, use the first available department
                    from departments.models import Department
                    first_dept = Department.objects.first()
                    if first_dept:
                        data['department_id'] = first_dept.id
                    else:
                        raise serializers.ValidationError("No departments available")
        return data

    @transaction.atomic
    def create(self, validated_data):
        insurance_data = validated_data.pop('insurance_fields', None)
        internal_data  = validated_data.pop('internal_fields', None)

        ticket = Ticket.objects.create(**validated_data)

        if ticket.ticket_type == 'insurance' and insurance_data:
            InsuranceField.objects.create(ticket=ticket, **insurance_data)
        if ticket.ticket_type == 'internal' and internal_data:
            InternalField.objects.create(ticket=ticket, **internal_data)

        return ticket


class TicketUpdateSerializer(serializers.ModelSerializer):
    """Write serializer for ticket partial updates."""
    insurance_fields = InsuranceFieldSerializer(required=False)
    internal_fields  = InternalFieldSerializer(required=False)
    department_id    = serializers.IntegerField(required=False)
    assignee_id      = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model  = Ticket
        fields = [
            'subject', 'description', 'priority', 'status',
            'department_id', 'assignee_id', 'tags',
            'problem_category', 'sub_problem',
            'insurance_fields', 'internal_fields',
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        insurance_data = validated_data.pop('insurance_fields', None)
        internal_data  = validated_data.pop('internal_fields', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if insurance_data:
            InsuranceField.objects.update_or_create(
                ticket=instance, defaults=insurance_data
            )
        if internal_data:
            InternalField.objects.update_or_create(
                ticket=instance, defaults=internal_data
            )

        return instance


class AssignTicketSerializer(serializers.Serializer):
    assignee_id = serializers.IntegerField()


class ChangeStatusSerializer(serializers.Serializer):
    status     = serializers.ChoiceField(choices=Ticket.Status.choices)
    resolution = serializers.CharField(required=False, allow_blank=True)
