"""
FatakPay TMS — Base Settings
All environments inherit from this file.
"""
from pathlib import Path
from datetime import timedelta
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production-min-50-chars-xxxxxxxxxxxxxxxx')

DEBUG = True

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*', cast=lambda v: [s.strip() for s in v.split(',')])

# ─── Application Definition ────────────────────────────────────────────────────

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    'django_celery_beat',
    'django_celery_results',
]

LOCAL_APPS = [
    'accounts',
    'departments',
    'audit',
    'ai_engine',
    'notifications',
    'tickets',
    'comments',
    'reports',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
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
        'DIRS': [BASE_DIR / 'templates'],
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
ASGI_APPLICATION = 'config.asgi.application'

# ─── Database ──────────────────────────────────────────────────────────────────

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME':     config('DB_NAME',     default='fatakpay_tms'),
        'USER':     config('DB_USER',     default='root'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST':     config('DB_HOST',     default='127.0.0.1'),
        'PORT':     config('DB_PORT',     default='5432'),
        'OPTIONS': {
            'connect_timeout': 10,
            'options': '-c search_path=identity,core,ai,audit,system,public',
        },
    }
}

# ─── Custom User Model ─────────────────────────────────────────────────────────

AUTH_USER_MODEL = 'accounts.CustomUser'

# ─── Password Validation ───────────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─── Internationalisation ──────────────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ─── Static / Media ────────────────────────────────────────────────────────────

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── Django REST Framework ────────────────────────────────────────────────────

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
    'DEFAULT_PAGINATION_CLASS': 'accounts.pagination.StandardPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'accounts.exceptions.custom_exception_handler',
}

# ─── SimpleJWT ────────────────────────────────────────────────────────────────

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# ─── CORS ─────────────────────────────────────────────────────────────────────

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000', 
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # For development only

# ─── DRF Spectacular (OpenAPI) ────────────────────────────────────────────────

SPECTACULAR_SETTINGS = {
    'TITLE': 'FatakPay TMS API',
    'DESCRIPTION': 'Ticket Management System REST API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
}

# ─── Celery ───────────────────────────────────────────────────────────────────

CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'
CELERY_RESULT_BACKEND = 'django-db'
CELERY_CACHE_BACKEND = 'default'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

CELERY_TASK_ROUTES = {
    'ai_engine.tasks.*': {'queue': 'ai_tasks'},
}

CELERY_TASK_DEFAULT_QUEUE = 'default'

# ─── Caches ───────────────────────────────────────────────────────────────────

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'tms-cache',
    }
}

# Override with Redis when available (set REDIS_URL in .env)
_REDIS_URL = config('REDIS_URL', default='')
if _REDIS_URL:
    CACHES['default'] = {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': _REDIS_URL,
    }

# ─── Email ────────────────────────────────────────────────────────────────────

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ─── AI Engine ────────────────────────────────────────────────────────────────

AI_SERVICE_ENABLED             = config('AI_SERVICE_ENABLED', default=False, cast=bool)
AI_BACKEND                     = config('AI_BACKEND', default='groq')
AI_MODEL_ENDPOINT              = config('AI_MODEL_ENDPOINT', default='http://localhost:11434')
AI_RESPONSE_TIMEOUT            = 3  # seconds — hard deadline before returning ai_available: false
AI_REQUEST_TIMEOUT             = config('AI_REQUEST_TIMEOUT', default=15, cast=int)
AI_CIRCUIT_FAILURE_THRESHOLD   = config('AI_CIRCUIT_FAILURE_THRESHOLD', default=5, cast=int)
AI_CIRCUIT_RESET_TIMEOUT       = config('AI_CIRCUIT_RESET_TIMEOUT', default=120, cast=int)

# Groq API
GROQ_API_KEY                   = config('GROQ_API_KEY', default='')
GROQ_BASE_URL                  = config('GROQ_BASE_URL', default='https://api.groq.com/openai/v1')
GROQ_CHAT_MODEL                = config('GROQ_CHAT_MODEL', default='llama-3.1-8b-instant')

# Per-feature token budgets
AI_MAX_TOKENS_CLASSIFY         = 150
AI_MAX_TOKENS_SUMMARY          = 300
AI_MAX_TOKENS_CHAT             = 400

# Rate limiting (backed by Django cache / Redis when available)
AI_RATE_LIMIT_PER_USER_DAY     = config('AI_RATE_LIMIT_PER_USER_DAY', default=200, cast=int)
AI_RATE_LIMIT_PER_IP_MINUTE    = config('AI_RATE_LIMIT_PER_IP_MINUTE', default=20, cast=int)
