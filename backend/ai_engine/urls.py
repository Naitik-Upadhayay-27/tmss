from django.urls import path
from . import views

urlpatterns = [
    path('health/',                                    views.health,               name='ai-health'),
    path('usage/',                                     views.usage,                name='ai-usage'),
    path('analyse/',                                   views.analyse_ticket,       name='ai-analyse'),
    path('chat/',                                      views.chat,                 name='ai-chat'),
    path('bulk-assign/',                               views.bulk_assign,          name='ai-bulk-assign'),
    path('feedback/',                                  views.submit_feedback,      name='ai-feedback'),
    path('tickets/<int:ticket_id>/summary/',           views.ticket_summary,       name='ai-summary'),
    path('tickets/<int:ticket_id>/resolution-suggestion/', views.resolution_suggestion, name='ai-resolution'),
]
