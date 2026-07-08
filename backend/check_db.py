#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Check schemas
    cursor.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')")
    schemas = [row[0] for row in cursor.fetchall()]
    print("Schemas:")
    for schema in schemas:
        print(f"  {schema}")
    
    print("\nTables by schema:")
    cursor.execute("""
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog') 
        ORDER BY schemaname, tablename
    """)
    tables = cursor.fetchall()
    
    current_schema = None
    for schema, table in tables:
        if schema != current_schema:
            print(f"\n{schema}:")
            current_schema = schema
        print(f"  {table}")
    
    # Check if tickets exist in any form
    cursor.execute("""
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE tablename LIKE '%ticket%' 
        ORDER BY schemaname, tablename
    """)
    ticket_tables = cursor.fetchall()
    print(f"\nTicket-related tables:")
    for schema, table in ticket_tables:
        print(f"  {schema}.{table}")