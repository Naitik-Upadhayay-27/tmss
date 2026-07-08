"""
FatakPay TMS — Django Settings
Reads all secrets from environment via python-decouple.
"""

from pathlib import Path
from decouple import config, Csv

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=Csv()
)

# ── Feature flags ─────────────────────────────────────────────────────────────
# Set CELERY_ENABLED=True in env only when Redis is available
CELERY_ENABLED = config('CELERY_ENABLED', default=False, cast=bool)

# ── Applications ───────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_spectacular',

    # Project apps
    'accounts',
    'departments',
    'audit',
    # 'ai_engine',  # disabled — under build
    'notifications',
    'tickets',
    'comments',
    'reports',
]

# Celery result/beat apps only installed when Celery is enabled
if CELERY_ENABLED:
    INSTALLED_APPS += [
        'django_celery_beat',
        'django_celery_results',
    ]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',   # serve static files
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'accounts.middleware.RequestLoggingMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'notifications' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ── Database — PostgreSQL only ────────────────────────────────────────────────
# Schemas: identity, core, ai, audit, system
# Tables use db_table = 'schema"."table' pattern for schema routing.
DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.postgresql',
        'NAME':     config('DB_NAME',     default='fatakpay_tms'),
        'USER':     config('DB_USER',     default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST':     config('DB_HOST',     default='127.0.0.1'),
        'PORT':     config('DB_PORT',     default='5432'),
        'OPTIONS': {
            # Make all schemas visible without qualifying every query
            'options': '-c search_path=identity,core,ai,audit,system,public'
        },
        'CONN_MAX_AGE': 60,
    }
}

# ── Auth ───────────────────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'accounts.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'accounts.exceptions.custom_exception_handler',
    'DEFAULT_PAGINATION_CLASS': 'accounts.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 25,
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# ── CORS ───────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173',
    cast=Csv()
)
CORS_ALLOW_CREDENTIALS = True

# ── Celery (optional — only active when CELERY_ENABLED=True) ──────────────────
REDIS_URL = config('REDIS_URL', default='')

if CELERY_ENABLED:
    if not REDIS_URL:
        raise ValueError("REDIS_URL must be set when CELERY_ENABLED=True")
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = 'django-db'
    CELERY_ACCEPT_CONTENT = ['json']
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_TIMEZONE = 'UTC'
    CELERY_TASK_ROUTES = {
        'ai_engine.tasks.*': {'queue': 'ai_tasks'},
    }
else:
    # When Celery is disabled, tasks called via .delay() / .apply_async()
    # will execute synchronously in the same process (CELERY_TASK_ALWAYS_EAGER).
    # This means background work still happens — just not in a worker.
    CELERY_TASK_ALWAYS_EAGER = True
    CELERY_TASK_EAGER_PROPAGATES = True

# ── Static & Media files ───────────────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ── OpenAPI ─────────────────────────────────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'FatakPay TMS API',
    'DESCRIPTION': 'Ticket Management System REST API',
    'VERSION': '1.0.0',
}

# ── AI Engine ──────────────────────────────────────────────────────────────────
AI_SERVICE_ENABLED            = config('AI_SERVICE_ENABLED', default=False, cast=bool)
AI_BACKEND                    = config('AI_BACKEND', default='groq')
AI_MODEL_ENDPOINT             = config('AI_MODEL_ENDPOINT', default='http://localhost:11434')
AI_CIRCUIT_FAILURE_THRESHOLD  = config('AI_CIRCUIT_FAILURE_THRESHOLD', default=5, cast=int)
AI_CIRCUIT_RESET_TIMEOUT      = config('AI_CIRCUIT_RESET_TIMEOUT', default=120, cast=int)

# Groq
GROQ_API_KEY                  = config('GROQ_API_KEY', default='')
GROQ_CHAT_MODEL               = config('GROQ_CHAT_MODEL', default='llama-3.1-8b-instant')
GROQ_BASE_URL                 = 'https://api.groq.com/openai/v1'
AI_REQUEST_TIMEOUT            = config('AI_REQUEST_TIMEOUT', default=15, cast=int)
AI_MAX_TOKENS_SUMMARY         = 300
AI_MAX_TOKENS_CHAT            = 2000
AI_MAX_TOKENS_CLASSIFY        = 150

# Rate limiting — requests per user per day (abuse prevention)
AI_RATE_LIMIT_PER_USER_DAY    = config('AI_RATE_LIMIT_PER_USER_DAY', default=200, cast=int)
AI_RATE_LIMIT_PER_IP_MINUTE   = config('AI_RATE_LIMIT_PER_IP_MINUTE', default=20, cast=int)

# ── Password Validation ────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── i18n ───────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
