from django.urls import path
from . import views

urlpatterns = [
    path('tickets/',  views.ticket_stats,      name='report-tickets'),
    path('sla/',      views.sla_report,         name='report-sla'),
    path('agents/',   views.agent_performance,  name='report-agents'),
]
