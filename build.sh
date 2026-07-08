#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # exit on error

cd backend

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Create database schemas if they don't exist
python manage.py shell -c "
from django.db import connection
schemas = ['identity', 'core', 'ai', 'audit', 'system']
cursor = connection.cursor()
for schema in schemas:
    try:
        cursor.execute(f'CREATE SCHEMA IF NOT EXISTS {schema}')
        print(f'Schema {schema} created or already exists')
    except Exception as e:
        print(f'Error creating schema {schema}: {e}')
"

# Run migrations
python manage.py migrate --noinput