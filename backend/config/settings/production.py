"""
FatakPay TMS — Production Settings (Render + PostgreSQL)
"""
from .base import *  # noqa: F401, F403
import dj_database_url
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ['*']  # Temporarily allow all hosts for debugging

# ── Database — reads DATABASE_URL env var set by Render/Neon/Supabase ─────────
DATABASE_URL = config('DATABASE_URL', default='')
if DATABASE_URL:
    parsed_db = dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True,
    )
    # Add Neon-specific options
    parsed_db['OPTIONS'] = {
        'connect_timeout': 10,
        'sslmode': 'require',  # Neon requires SSL
    }
    DATABASES = {'default': parsed_db}
else:
    # PostgreSQL fallback when no DATABASE_URL is set
    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.postgresql',
            'NAME':     config('DB_NAME',     default='fatakpay_tms'),
            'USER':     config('DB_USER',     default='root'),
            'PASSWORD': config('DB_PASSWORD', default='root'),
            'HOST':     config('DB_HOST',     default='127.0.0.1'),
            'PORT':     config('DB_PORT',     default='5432'),
            'OPTIONS': {
                'connect_timeout': 10,
                'sslmode': 'require' if config('DB_SSL', default=True, cast=bool) else 'prefer',
            },
        }
    }

# ── Static files served by WhiteNoise ─────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # must be right after SecurityMiddleware
] + [m for m in MIDDLEWARE if m != 'django.middleware.security.SecurityMiddleware']  # noqa: F405

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ── Security headers ───────────────────────────────────────────────────────────
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# Temporarily disable strict security for debugging
# SECURE_HSTS_SECONDS = 31536000
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# ── CORS — allow your Vercel frontend ─────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True  # Temporarily allow all origins
CORS_ALLOW_CREDENTIALS = True

# Additional CORS settings for better compatibility
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Disable CSRF for API endpoints temporarily
CSRF_TRUSTED_ORIGINS = [
    'https://tmss-eight.vercel.app',
    'https://tmss-one.vercel.app',
]

# ── Email ─────────────────────────────────────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ── Logging ───────────────────────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
