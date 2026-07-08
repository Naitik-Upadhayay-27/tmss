from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from departments.models import Department

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for FatakPay TMS'

    def handle(self, *args, **options):
        # Create departments first
        tech_dept, _ = Department.objects.get_or_create(
            code='TECH_BE',
            defaults={
                'name': 'Technology — Backend',
                'sla_critical_hours': 4,
                'sla_high_hours': 24,
            }
        )
        
        ops_dept, _ = Department.objects.get_or_create(
            code='INS_OPS',
            defaults={
                'name': 'Insurance Operations',
                'sla_critical_hours': 2,
                'sla_high_hours': 8,
            }
        )

        # Create test users
        users_data = [
            {
                'email': 'admin@fatakpay.com',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'SUPER_ADMIN',
                'department': tech_dept,
            },
            {
                'email': 'head@fatakpay.com',
                'password': 'head123',
                'first_name': 'Department',
                'last_name': 'Head',
                'role': 'DEPT_HEAD',
                'department': tech_dept,
            },
            {
                'email': 'agent@fatakpay.com',
                'password': 'agent123',
                'first_name': 'Customer',
                'last_name': 'Agent',
                'role': 'CALLER',
                'department': ops_dept,
            },
            {
                'email': 'member@fatakpay.com',
                'password': 'member123',
                'first_name': 'Team',
                'last_name': 'Member',
                'role': 'MEMBER',
                'department': tech_dept,
            },
        ]

        created_count = 0
        for user_data in users_data:
            if not User.objects.filter(email=user_data['email']).exists():
                user = User.objects.create_user(
                    email=user_data['email'],
                    password=user_data['password'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    role=user_data['role'],
                    department=user_data['department'],
                    is_active=True
                )
                created_count += 1
                self.stdout.write(f"Created user: {user.email}")

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} test users')
        )