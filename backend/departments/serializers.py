from rest_framework import serializers
from .models import Department
from accounts.serializers import UserSerializer


class DepartmentSerializer(serializers.ModelSerializer):
    head = UserSerializer(read_only=True)
    head_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model  = Department
        fields = [
            'id', 'code', 'name', 'head', 'head_id',
            'sla_critical_hours', 'sla_high_hours', 'is_active',
        ]
        read_only_fields = ['id']
