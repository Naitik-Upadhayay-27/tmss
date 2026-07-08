"""
accounts/models.py — CustomUser with Role enum
All other apps import User from here.
"""
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        DEPT_HEAD   = 'DEPT_HEAD',   'Department Head'
        CALLER      = 'CALLER',      'Caller / Agent'
        MEMBER      = 'MEMBER',      'Team Member'

    email       = models.EmailField(unique=True, db_index=True)
    first_name  = models.CharField(max_length=150)
    last_name   = models.CharField(max_length=150)
    role        = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    department  = models.ForeignKey(
        'departments.Department',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='members',
    )
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    class Meta:
        db_table = 'identity.users'
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return f'{self.full_name} <{self.email}>'

    @property
    def full_name(self) -> str:
        return f'{self.first_name} {self.last_name}'.strip()

    @property
    def is_super_admin(self) -> bool:
        return self.role == self.Role.SUPER_ADMIN

    @property
    def is_dept_head(self) -> bool:
        return self.role == self.Role.DEPT_HEAD

    @property
    def is_caller(self) -> bool:
        return self.role == self.Role.CALLER

    @property
    def is_member(self) -> bool:
        return self.role == self.Role.MEMBER
