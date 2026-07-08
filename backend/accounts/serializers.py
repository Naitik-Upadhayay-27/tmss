"""
accounts/serializers.py
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class DepartmentMinimalSerializer(serializers.Serializer):
    """Minimal department info nested inside User — avoids circular import."""
    id                 = serializers.IntegerField()
    code               = serializers.CharField()
    name               = serializers.CharField()
    sla_critical_hours = serializers.IntegerField()
    sla_high_hours     = serializers.IntegerField()


class UserSerializer(serializers.ModelSerializer):
    full_name  = serializers.ReadOnlyField()
    department = DepartmentMinimalSerializer(read_only=True)

    class Meta:
        model  = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'department', 'is_active', 'date_joined',
        ]
        read_only_fields = ['id', 'date_joined', 'full_name']


class UserCreateSerializer(serializers.ModelSerializer):
    password         = serializers.CharField(write_only=True, min_length=8)
    department_id    = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model  = User
        fields = [
            'email', 'first_name', 'last_name', 'role',
            'department_id', 'is_active', 'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    department_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'role', 'department_id', 'is_active']


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
