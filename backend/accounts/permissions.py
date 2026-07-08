"""
accounts/permissions.py — ALL RBAC permission classes live here.
Never implement inline permission logic in views.
"""
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """Full system access — Super Admin only."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'SUPER_ADMIN'
        )


class IsDepartmentHead(BasePermission):
    """Department-scoped access — Dept Head only."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'DEPT_HEAD'
        )


class IsCaller(BasePermission):
    """Create + track own tickets — Caller / Agent only."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'CALLER'
        )


class IsTeamMember(BasePermission):
    """Work assigned tickets — Team Member only."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'MEMBER'
        )


class IsSuperAdminOrDeptHead(BasePermission):
    """Super Admin or Department Head."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('SUPER_ADMIN', 'DEPT_HEAD')
        )


class IsTicketAssignee(BasePermission):
    """Object-level — only the assigned user can act on this ticket."""

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and
            request.user.is_authenticated and
            obj.assignee_id == request.user.id
        )


class IsTicketOwner(BasePermission):
    """Object-level — only the creator of this ticket."""

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and
            request.user.is_authenticated and
            obj.created_by_id == request.user.id
        )


class CanViewTicket(BasePermission):
    """
    Super Admin: all tickets.
    Dept Head:   tickets in their department.
    Caller:      tickets they created.
    Member:      tickets assigned to them.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == 'SUPER_ADMIN':
            return True
        if user.role == 'DEPT_HEAD':
            return obj.department_id == user.department_id
        if user.role == 'CALLER':
            return obj.created_by_id == user.id
        if user.role == 'MEMBER':
            return obj.assignee_id == user.id
        return False
