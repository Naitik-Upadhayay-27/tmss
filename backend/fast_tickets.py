#!/usr/bin/env python3
"""Fast ticket creation without signals"""
import os
import django
from django.db import transaction
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
django.setup()

from tickets.models import Ticket
from departments.models import Department
from accounts.models import CustomUser

def bulk_create_tickets():
    print("Creating tickets in bulk (no signals)...")
    
    # Get departments and users
    depts = {d.code: d for d in Department.objects.all()}
    users = list(CustomUser.objects.filter(role__in=['MEMBER', 'DEPT_HEAD']))
    
    tickets = []
    now = timezone.now()
    
    # Create tickets for each department
    for dept_code in ['IT', 'PRODUCT', 'MARKETING', 'SALES', 'CALLING', 'ACTIVATION', 'DATA', 'FINANCE']:
        dept = depts.get(dept_code)
        if not dept:
            continue
            
        dept_users = [u for u in users if u.department and u.department.id == dept.id]
        if not dept_users:
            print(f"No users for {dept_code}")
            continue
            
        print(f"Creating tickets for {dept_code} ({len(dept_users)} users)")
            
        # 5 tickets per department
        for i in range(5):
            ticket_num = f"TKT-{dept_code}-{i+1:03d}"
            tickets.append(Ticket(
                ticket_number=ticket_num,
                ticket_type='internal',
                subject=f'{dept_code} Issue #{i+1}',
                description=f'Sample issue for {dept.name} department',
                status='open',
                priority='medium',
                department=dept,
                created_by=dept_users[0],
                assignee=dept_users[0] if len(dept_users) > 1 else None,
                problem_category='Technical',
                sub_problem='General',
                created_at=now - timedelta(hours=i),
                sla_deadline=now + timedelta(hours=24),
            ))
    
    # Bulk create all tickets at once
    with transaction.atomic():
        Ticket.objects.bulk_create(tickets, batch_size=100)
    
    print(f"✓ Created {len(tickets)} tickets successfully!")

if __name__ == '__main__':
    bulk_create_tickets()