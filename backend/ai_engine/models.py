"""
ai_engine/models.py — Phase 2 implementation.
"""
from django.db import models
from django.conf import settings


class AIAnalysisCache(models.Model):
    """Caches AI analysis results per ticket to avoid repeated Groq calls."""
    ticket              = models.OneToOneField(
        'tickets.Ticket', on_delete=models.CASCADE, related_name='ai_cache'
    )
    # Classification
    suggested_priority  = models.CharField(max_length=20, blank=True)
    priority_reason     = models.CharField(max_length=300, blank=True)
    suggested_category  = models.CharField(max_length=100, blank=True)
    category_reason     = models.CharField(max_length=300, blank=True)
    suggested_tags      = models.JSONField(default=list)
    sentiment           = models.CharField(max_length=20, blank=True)
    confidence          = models.FloatField(null=True, blank=True)
    # Summary
    summary             = models.TextField(blank=True)
    # Meta
    prompt_version      = models.CharField(max_length=20, default='v1.0')
    used_fallback       = models.BooleanField(default=False)
    raw_response        = models.JSONField(null=True, blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai.analysis_cache'

    def __str__(self):
        return f'AI Cache: {self.ticket_id}'


class TrainingFeedback(models.Model):
    """User corrections to AI suggestions — used for future fine-tuning."""

    class FeedbackType(models.TextChoices):
        PRIORITY_WRONG  = 'priority_wrong',  'Priority Wrong'
        CATEGORY_WRONG  = 'category_wrong',  'Category Wrong'
        SUMMARY_WRONG   = 'summary_wrong',   'Summary Wrong'
        RESOLUTION_POOR = 'resolution_poor', 'Resolution Poor'
        HELPFUL         = 'helpful',         'Helpful'

    ticket        = models.ForeignKey(
        'tickets.Ticket', on_delete=models.CASCADE, related_name='ai_feedbacks'
    )
    submitted_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT
    )
    feature       = models.CharField(max_length=50)
    feedback_type = models.CharField(max_length=30, choices=FeedbackType.choices, default=FeedbackType.HELPFUL)
    ai_suggestion = models.CharField(max_length=500)
    user_choice   = models.CharField(max_length=500, blank=True)
    notes         = models.TextField(blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai.training_feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f'Feedback [{self.feedback_type}] on {self.ticket_id}'


class AIRequestLog(models.Model):
    """Audit log for all AI API calls — for abuse detection and cost tracking."""
    user          = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='ai_requests'
    )
    ip_address    = models.GenericIPAddressField(null=True, blank=True)
    feature       = models.CharField(max_length=50)   # classify, summary, chat, etc.
    model_used    = models.CharField(max_length=100, blank=True)
    tokens_used   = models.IntegerField(default=0)
    latency_ms    = models.IntegerField(default=0)
    success       = models.BooleanField(default=True)
    error_type    = models.CharField(max_length=100, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table  = 'ai.request_log'
        ordering  = ['-created_at']
        indexes   = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['feature', 'created_at']),
        ]
