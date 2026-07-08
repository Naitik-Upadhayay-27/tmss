"""
tickets/filters.py — TicketFilter with all filterable fields.
"""
import django_filters
from .models import Ticket


class TicketFilter(django_filters.FilterSet):
    search           = django_filters.CharFilter(method='filter_search')
    status           = django_filters.ChoiceFilter(choices=Ticket.Status.choices)
    priority         = django_filters.ChoiceFilter(choices=Ticket.Priority.choices)
    ticket_type      = django_filters.ChoiceFilter(choices=Ticket.TicketType.choices)
    department       = django_filters.NumberFilter(field_name='department__id')
    assignee         = django_filters.NumberFilter(field_name='assignee__id')
    created_by       = django_filters.NumberFilter(field_name='created_by__id')
    sla_breached     = django_filters.BooleanFilter(field_name='sla_breached')
    problem_category = django_filters.CharFilter(field_name='problem_category', lookup_expr='iexact')

    class Meta:
        model  = Ticket
        fields = [
            'status', 'priority', 'ticket_type',
            'department', 'assignee', 'created_by', 'sla_breached', 'problem_category',
        ]

    def filter_search(self, queryset, name, value):
        from django.db.models import Q
        return queryset.filter(
            Q(subject__icontains=value) |
            Q(ticket_number__icontains=value) |
            Q(description__icontains=value)
        )
