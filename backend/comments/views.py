"""
comments/views.py
GET/POST /api/v1/tickets/:ticket_id/comments/ — handled by TicketViewSet nested action
PATCH/DELETE /api/v1/comments/:id/            — handled here
"""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer
from tickets.models import Ticket
from audit.services import AuditService


class CommentViewSet(viewsets.ModelViewSet):
    """
    Nested under tickets: GET/POST /api/v1/tickets/:ticket_pk/comments/
    Also standalone: PATCH/DELETE /api/v1/comments/:id/
    """
    permission_classes = [IsAuthenticated]
    http_method_names  = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        ticket_pk = self.kwargs.get('ticket_pk')
        if ticket_pk:
            return Comment.objects.filter(ticket_id=ticket_pk).select_related('author', 'author__department')
        return Comment.objects.select_related('author', 'author__department').filter(
            author=self.request.user
        )

    def get_serializer_class(self):
        if self.action in ('create', 'partial_update', 'update'):
            return CommentCreateSerializer
        return CommentSerializer

    def create(self, request, *args, **kwargs):
        ticket_pk = self.kwargs.get('ticket_pk')
        if not ticket_pk:
            return Response({'error': 'ticket_pk required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ticket = Ticket.objects.get(pk=ticket_pk)
        except Ticket.DoesNotExist:
            return Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(ticket=ticket, author=request.user)

        AuditService.log(ticket=ticket, action='comment', performed_by=request.user, new_value=comment.body[:100])

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.author_id != request.user.id and request.user.role != 'SUPER_ADMIN':
            return Response({'error': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
