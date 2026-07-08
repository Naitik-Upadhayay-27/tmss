"""
accounts/management/commands/setup_enterprise_db.py

Enterprise PostgreSQL setup command.
Creates all schemas and seeds data in the correct order.
Safe to run multiple times.

Usage:
  python manage.py setup_enterprise_db
  python manage.py setup_enterprise_db --skip-seed  # schemas only
"""

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection


class Command(BaseCommand):
    help = 'Set up enterprise PostgreSQL database with schemas and seed data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-seed',
            action='store_true',
            help='Create schemas but skip seeding data',
        )

    def handle(self, *args, **options):
        self.stdout.write('Setting up FatakPay TMS Enterprise Database...')

        # Step 1: Create all required schemas
        self.stdout.write('\\n1. Creating PostgreSQL schemas...')
        with connection.cursor() as cursor:
            schemas = ['identity', 'core', 'ai', 'audit', 'system']
            for schema in schemas:
                cursor.execute(f'CREATE SCHEMA IF NOT EXISTS {schema}')
                self.stdout.write(f'  OK {schema}')

        # Step 2: Run migrations (creates all tables in their respective schemas)
        self.stdout.write('\\n2. Running migrations...')
        call_command('migrate', verbosity=0, interactive=False)
        self.stdout.write('\\nOK All tables created')

        # Step 3: Seed data (optional)
        if not options['skip_seed']:
            self.stdout.write('\\n3. Seeding enterprise data...')
            call_command('seed_data', verbosity=1)
            self.stdout.write('\\nOK Seed complete')
        else:
            self.stdout.write('\\n3. Skipping seed data (--skip-seed flag set)')

        # Step 4: Verify setup
        self.stdout.write('\\n4. Verifying schema layout...')
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT schemaname, COUNT(*) as tables
                FROM pg_tables 
                WHERE schemaname IN ('identity', 'core', 'ai', 'audit', 'system')
                GROUP BY schemaname
                ORDER BY schemaname
            """)
            for schema, count in cursor.fetchall():
                self.stdout.write(f'  OK {schema}: {count} tables')

        self.stdout.write(
            self.style.SUCCESS(
                '\\nOK Enterprise database setup complete.\\n'
                'Schemas: identity (users), core (tickets), ai (ml), audit (logs), system (django)'
            )
        )