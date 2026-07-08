"""
tickets/views.py — Thin views. All logic in services.py.
"""
from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from .models import Ticket, Attachment
from .filters import TicketFilter
from .services import TicketService
from .serializers import (
    TicketSerializer, TicketCreateSerializer, TicketUpdateSerializer,
    AssignTicketSerializer, ChangeStatusSerializer, AttachmentSerializer,
)
from audit.serializers import AuditLogSerializer
from audit.models import AuditLog
from accounts.permissions import IsSuperAdmin, IsSuperAdminOrDeptHead, CanViewTicket


class TicketViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/tickets/              — list (filtered)
    POST   /api/v1/tickets/              — create
    GET    /api/v1/tickets/:id/          — detail
    PATCH  /api/v1/tickets/:id/          — update
    POST   /api/v1/tickets/:id/assign/   — assign
    POST   /api/v1/tickets/:id/status/   — change status
    GET    /api/v1/tickets/:id/audit/    — audit trail
    GET    /api/v1/tickets/:id/timeline/ — timeline events
    """
    filter_backends   = [DjangoFilterBackend, OrderingFilter]
    filterset_class   = TicketFilter
    ordering_fields   = ['created_at', 'updated_at', 'priority', 'status', 'sla_deadline']
    ordering          = ['-created_at']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.select_related(
            'department', 'created_by', 'created_by__department',
            'assignee', 'assignee__department',
        ).prefetch_related(
            'insurance_fields', 'internal_fields'
        ).annotate(
            _comment_count=Count('comments', distinct=True),
            _attachment_count=Count('attachments', distinct=True),
        )

        # Role-based scoping
        if user.role == 'SUPER_ADMIN':
            return qs
        elif user.role == 'DEPT_HEAD':
            return qs.filter(department=user.department)
        elif user.role == 'CALLER':
            return qs.filter(created_by=user)
        elif user.role == 'MEMBER':
            return qs.filter(assignee=user)
        return qs.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        if self.action in ('partial_update', 'update'):
            return TicketUpdateSerializer
        return TicketSerializer

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsSuperAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Use service layer
        data = self.request.data.copy()
        TicketService.create_ticket(data, created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        """Override to go through service layer."""
        print(f"Ticket creation request data: {request.data}")
        print(f"User: {request.user} (Role: {request.user.role})")
        
        # Fix the data format - extract department_id from department object
        data = request.data.copy()
        if 'department' in data and isinstance(data['department'], dict):
            data['department_id'] = data['department']['id']
            data.pop('department')
        
        # Remove fields that shouldn't be in creation data
        data.pop('created_by', None)
        data.pop('sla_deadline', None)
        data.pop('status', None)
        
        from .serializers import TicketCreateSerializer
        serializer = TicketCreateSerializer(data=data, context={'request': request})
        
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        ticket = serializer.save(created_by=request.user)
        from audit.services import AuditService
        AuditService.log(ticket=ticket, action='created', performed_by=request.user, new_value=ticket.ticket_number)
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)

    # ── Custom actions ──────────────────────────────────────────────────────

    @action(detail=True, methods=['get'], url_path='assignable-users')
    def assignable_users(self, request, pk=None):
        """
        Returns the list of users this requester can assign the ticket to.

        Super Admin  → all Dept Heads (grouped by department)
        Dept Head    → other Dept Heads + their own department's Members
        """
        from django.contrib.auth import get_user_model
        User = get_user_model()

        self.get_object()  # permission check
        user = request.user

        if user.role == 'SUPER_ADMIN':
            heads = (
                User.objects
                .select_related('department')
                .filter(role='DEPT_HEAD', is_active=True)
                .order_by('department__name', 'first_name')
            )
            groups = {}
            for h in heads:
                dept_name = h.department.name if h.department else 'No Department'
                groups.setdefault(dept_name, []).append({
                    'id': h.id, 'full_name': h.full_name, 'email': h.email,
                    'role': h.role, 'department': dept_name,
                })
            return Response({
                'groups': [{'label': dept, 'users': users} for dept, users in groups.items()]
            })

        elif user.role == 'DEPT_HEAD':
            other_heads = (
                User.objects
                .select_related('department')
                .filter(role='DEPT_HEAD', is_active=True)
                .exclude(id=user.id)
                .order_by('department__name', 'first_name')
            )
            own_members = (
                User.objects
                .select_related('department')
                .filter(role='MEMBER', is_active=True, department=user.department)
                .order_by('first_name')
            )

            groups = []
            if other_heads.exists():
                groups.append({
                    'label': 'Department Heads',
                    'users': [{'id': h.id, 'full_name': h.full_name, 'email': h.email, 'role': h.role, 'department': h.department.name if h.department else ''} for h in other_heads],
                })
            if own_members.exists():
                dept_label = user.department.name if user.department else 'My Department'
                groups.append({
                    'label': f'{dept_label} — Team Members',
                    'users': [{'id': m.id, 'full_name': m.full_name, 'email': m.email, 'role': m.role, 'department': m.department.name if m.department else ''} for m in own_members],
                })

            return Response({'groups': groups})

        return Response({'groups': []})

    @action(detail=True, methods=['post'], url_path='assign')
    def assign(self, request, pk=None):
        ticket = self.get_object()
        serializer = AssignTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = TicketService.assign_ticket(
            ticket=ticket,
            assignee_id=serializer.validated_data['assignee_id'],
            assigned_by=request.user,
        )
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'], url_path='status')
    def change_status(self, request, pk=None):
        ticket = self.get_object()

        # Escalated tickets — only Super Admin can change status
        if ticket.status == 'escalated' and request.user.role != 'SUPER_ADMIN':
            return Response(
                {'error': 'This ticket has been escalated. Only a Super Admin can change its status.'},
                status=403,
            )

        serializer = ChangeStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = TicketService.change_status(
            ticket=ticket,
            new_status=serializer.validated_data['status'],
            performed_by=request.user,
            resolution=serializer.validated_data.get('resolution', ''),
        )
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'], url_path='escalate')
    def escalate(self, request, pk=None):
        ticket = self.get_object()

        # Prevent re-escalation of an already escalated ticket
        if ticket.status == 'escalated':
            return Response(
                {'error': 'Ticket is already escalated.'},
                status=400,
            )

        ticket = TicketService.escalate_ticket(ticket, performed_by=request.user)
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['get'], url_path='audit')
    def audit(self, request, pk=None):
        ticket = self.get_object()
        logs = AuditLog.objects.filter(ticket=ticket).select_related('performed_by')
        return Response(AuditLogSerializer(logs, many=True).data)

    @action(detail=True, methods=['get'], url_path='timeline')
    def timeline(self, request, pk=None):
        """
        Returns merged timeline of audit logs + comments as TimelineEvent objects.
        Matches the frontend TimelineEvent type contract.
        """
        ticket = self.get_object()
        events = []

        # Audit log events
        for log in AuditLog.objects.filter(ticket=ticket).select_related('performed_by', 'performed_by__department'):
            event = {
                'id': log.id,
                'type': _audit_action_to_timeline_type(log.action),
                'timestamp': log.created_at.isoformat(),
                'actor': _user_to_dict(log.performed_by),
                'old_value': log.old_value,
                'new_value': log.new_value,
            }
            # Enrich assign events with full assignee objects from extra_data
            if log.action == 'assign' and log.extra_data:
                ed = log.extra_data
                if ed.get('assignee_id'):
                    try:
                        from django.contrib.auth import get_user_model
                        User = get_user_model()
                        assignee_user = User.objects.get(id=ed['assignee_id'])
                        event['assignee'] = _user_to_dict(assignee_user)
                    except Exception:
                        event['assignee'] = {'full_name': ed.get('assignee_name', log.new_value), 'id': ed.get('assignee_id')}
                if ed.get('prev_assignee_id'):
                    try:
                        prev_user = User.objects.get(id=ed['prev_assignee_id'])
                        event['prev_assignee'] = _user_to_dict(prev_user)
                    except Exception:
                        event['prev_assignee'] = {'full_name': ed.get('prev_assignee_name', log.old_value), 'id': ed.get('prev_assignee_id')}
            events.append(event)

        # Comment events
        for comment in ticket.comments.select_related('author', 'author__department').order_by('created_at'):
            events.append({
                'id': comment.id + 100000,  # offset to avoid ID collision
                'type': 'internal_note' if comment.is_internal else 'comment',
                'timestamp': comment.created_at.isoformat(),
                'actor': _user_to_dict(comment.author),
                'body': comment.body,
            })

        # Sort by timestamp
        events.sort(key=lambda e: e['timestamp'])
        return Response(events)

    @action(detail=True, methods=['get', 'post'], url_path='attachments')
    def attachments(self, request, pk=None):
        ticket = self.get_object()
        if request.method == 'GET':
            attachments = ticket.attachments.select_related('uploaded_by')
            return Response(AttachmentSerializer(attachments, many=True).data)

        # POST — upload attachment
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        attachment = Attachment.objects.create(
            ticket=ticket,
            filename=file.name,
            file=file,
            size=file.size,
            uploaded_by=request.user,
        )
        from audit.services import AuditService
        AuditService.log(
            ticket=ticket,
            action='attachment',
            performed_by=request.user,
            new_value=file.name,
        )
        return Response(AttachmentSerializer(attachment).data, status=status.HTTP_201_CREATED)


def _audit_action_to_timeline_type(action: str) -> str:
    mapping = {
        'created':        'created',
        'assign':         'assigned',
        'status_change':  'status_change',
        'resolve':        'resolved',
        'close':          'closed',
        'escalate':       'escalated',
        'reopen':         'reopened',
        'comment':        'comment',
        'attachment':     'attachment',
        'priority_change': 'priority_change',
        'update':         'status_change',
    }
    return mapping.get(action, action)


def _user_to_dict(user) -> dict:
    return {
        'id':          user.id,
        'email':       user.email,
        'first_name':  user.first_name,
        'last_name':   user.last_name,
        'full_name':   user.full_name,
        'role':        user.role,
        'is_active':   user.is_active,
        'date_joined': user.date_joined.isoformat(),
    }
