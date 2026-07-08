"""
FatakPay TMS — Development Settings
Uses PostgreSQL. Schemas: identity, core, ai, audit, system.
"""
from .base import *  # noqa: F401, F403
from decouple import config

DEBUG = True
ALLOWED_HOSTS = ['*']

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
            'options': '-c search_path=identity,core,ai,audit,system,public',
        },
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
