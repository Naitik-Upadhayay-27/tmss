"""
comments/urls.py
Standalone comment endpoints: PATCH/DELETE /api/v1/comments/:id/
Nested endpoints (GET/POST under tickets) are registered in tickets/urls.py via nested router.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet

router = DefaultRouter()
router.register('', CommentViewSet, basename='comments')

urlpatterns = [path('', include(router.urls))]
