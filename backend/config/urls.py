"""
FatakPay TMS — Root URL Configuration
All app URLs are included here under /api/v1/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/health/', lambda request: JsonResponse({'status': 'ok', 'message': 'FatakPay TMS API is running'})),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/users/', include('accounts.user_urls')),
    path('api/v1/departments/', include('departments.urls')),
    path('api/v1/tickets/', include('tickets.urls')),
    path('api/v1/comments/', include('comments.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
    path('api/v1/reports/', include('reports.urls')),
    path('api/v1/ai/', include('ai_engine.urls')),

    # OpenAPI docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
