import os
from django.core.wsgi import get_wsgi_application

# Use production settings on Render (DJANGO_SETTINGS_MODULE is set via env var)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
application = get_wsgi_application()
