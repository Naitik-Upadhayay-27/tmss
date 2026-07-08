"""
accounts/views.py — Auth endpoints + User management ViewSet
"""
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    LoginSerializer,
)
from .permissions import IsSuperAdmin

User = get_user_model()


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class AuthViewSet(viewsets.ViewSet):
    """
    POST /api/v1/auth/login/         — obtain tokens
    POST /api/v1/auth/logout/        — blacklist refresh token
    POST /api/v1/auth/token/refresh/ — handled by simplejwt view
    GET  /api/v1/auth/me/            — current user
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='test')
    def test(self, request):
        """Simple test endpoint to verify connectivity"""
        return Response({'message': 'Backend connection successful', 'timestamp': '2026-06-30T13:45:00Z'})

    @action(detail=False, methods=['post'], url_path='test-login')
    def test_login(self, request):
        """Debug endpoint to see what data we're receiving"""
        print(f"=== DEBUG LOGIN TEST ===")
        print(f"Request method: {request.method}")
        print(f"Content-Type: {request.content_type}")
        print(f"Raw data: {request.body}")
        print(f"Parsed data: {request.data}")
        print(f"POST: {request.POST}")
        print(f"Headers: {dict(request.headers)}")
        
        return Response({
            'method': request.method,
            'content_type': request.content_type,
            'data': request.data,
            'body_size': len(request.body),
        })

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        print(f"Login attempt - Data: {request.data}")
        print(f"Content-Type: {request.content_type}")
        
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email    = serializer.validated_data['email'].lower()
        password = serializer.validated_data['password']
        
        print(f"Looking for user with email: {email}")

        try:
            user = User.objects.select_related('department').get(email=email)
            print(f"Found user: {user.email} - Active: {user.is_active}")
        except User.DoesNotExist:
            print(f"User not found with email: {email}")
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            print(f"Password check failed for user: {email}")
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            print(f"User inactive: {email}")
            return Response({'error': 'Account is deactivated.'}, status=status.HTTP_403_FORBIDDEN)

        print(f"Login successful for: {email}")
        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user':    UserSerializer(user).data,
        })

    @action(detail=False, methods=['post'], url_path='logout',
            permission_classes=[IsAuthenticated])
    def logout(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass  # already blacklisted / invalid — treat as success
        return Response({'detail': 'Logged out successfully.'})

    @action(detail=False, methods=['get'], url_path='me',
            permission_classes=[IsAuthenticated])
    def me(self, request):
        user = User.objects.select_related('department').get(pk=request.user.pk)
        return Response(UserSerializer(user).data)


class UserViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/users/        — list  (admin only for full list)
    POST   /api/v1/users/        — create (admin only)
    GET    /api/v1/users/:id/    — retrieve
    PATCH  /api/v1/users/:id/    — update (admin only)
    DELETE /api/v1/users/:id/    — deactivate (admin only)
    GET    /api/v1/users/members/ — flat list of MEMBER users
    """
    queryset = User.objects.select_related('department').all().order_by('first_name', 'last_name')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_active', 'department']
    search_fields    = ['first_name', 'last_name', 'email']
    ordering_fields  = ['first_name', 'last_name', 'date_joined', 'role']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        if self.action in ('partial_update', 'update'):
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ('create', 'partial_update', 'destroy'):
            return [IsSuperAdmin()]
        return [IsAuthenticated()]

    def destroy(self, request, *args, **kwargs):
        """Deactivate instead of hard-delete."""
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='members',
            permission_classes=[IsAuthenticated])
    def members(self, request):
        """GET /api/v1/users/members/ — flat array of MEMBER role users."""
        qs = User.objects.select_related('department').filter(
            role='MEMBER', is_active=True
        ).order_by('first_name', 'last_name')
        return Response(UserSerializer(qs, many=True).data)
