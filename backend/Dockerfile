# ── Build stage ───────────────────────────────────────────────────────────────
FROM python:3.12-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# gcc + musl for C extensions, libpq-dev for psycopg2
RUN apk add --no-cache gcc musl-dev libpq-dev

COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

# ── Final stage ────────────────────────────────────────────────────────────────
FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# libpq: runtime dependency for psycopg2, curl for healthcheck
RUN apk add --no-cache libpq curl

COPY --from=builder /install /usr/local
COPY . .

# Non-root user
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app
USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/ || exit 1

# Create schemas, migrate, and start server
CMD ["sh", "-c", "python manage.py shell -c \"from django.db import connection; [connection.cursor().execute(f'CREATE SCHEMA IF NOT EXISTS {s}') for s in ['identity', 'core', 'ai', 'audit', 'system']]\" && \
    python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -"]
