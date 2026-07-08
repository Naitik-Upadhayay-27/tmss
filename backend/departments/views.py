from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Department
from .serializers import DepartmentSerializer
from accounts.permissions import IsSuperAdmin


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.select_related('head').all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        if self.action in ('create', 'partial_update', 'update', 'destroy'):
            return [IsSuperAdmin()]
        return [IsAuthenticated()]
