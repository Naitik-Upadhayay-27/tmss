"""
departments/models.py — Department model
"""
from django.db import models


class Department(models.Model):

    class Code(models.TextChoices):
        IT         = 'IT',         'IT'
        PRODUCT    = 'PRODUCT',    'Product'
        MARKETING  = 'MARKETING',  'Marketing'
        SALES      = 'SALES',      'Sales'
        CALLING    = 'CALLING',    'Calling'
        ACTIVATION = 'ACTIVATION', 'Activation'
        IT_ADMIN   = 'IT_ADMIN',   'IT Admin'
        PROD_SUP   = 'PROD_SUP',   'Production Support'
        LEGAL      = 'LEGAL',      'Legal & Compliance'
        DATA       = 'DATA',       'Data'
        OPERATIONS = 'OPERATIONS', 'Operations'
        FINANCE    = 'FINANCE',    'Finance'

    code               = models.CharField(max_length=20, unique=True)
    name               = models.CharField(max_length=100)
    head               = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='headed_departments',
    )
    sla_critical_hours = models.PositiveSmallIntegerField(default=4)
    sla_high_hours     = models.PositiveSmallIntegerField(default=24)
    is_active          = models.BooleanField(default=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core.departments'
        ordering = ['name']

    def __str__(self):
        return self.name
