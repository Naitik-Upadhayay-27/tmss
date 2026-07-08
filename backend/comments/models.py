from django.db import models
from django.conf import settings


class Comment(models.Model):
    ticket      = models.ForeignKey(
        'tickets.Ticket', on_delete=models.CASCADE, related_name='comments'
    )
    author      = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='comments'
    )
    body        = models.TextField()
    is_internal = models.BooleanField(default=False)  # internal note vs customer-visible
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core.comments'
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.author_id} on ticket {self.ticket_id}'
