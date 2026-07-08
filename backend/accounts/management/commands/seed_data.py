"""
python manage.py seed_data [--clear]

Step 1: Departments
"""
from django.core.management.base import BaseCommand


DEPARTMENTS = [
    {"code": "IT",         "name": "IT",                 "sla_critical_hours": 2,  "sla_high_hours": 8},
    {"code": "PRODUCT",    "name": "Product",             "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "MARKETING",  "name": "Marketing",           "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "SALES",      "name": "Sales",               "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "CALLING",    "name": "Calling",             "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "ACTIVATION", "name": "Activation",          "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "IT_ADMIN",   "name": "IT Admin",            "sla_critical_hours": 2,  "sla_high_hours": 8},
    {"code": "PROD_SUP",   "name": "Production Support",  "sla_critical_hours": 1,  "sla_high_hours": 4},
    {"code": "LEGAL",      "name": "Legal & Compliance",  "sla_critical_hours": 8,  "sla_high_hours": 48},
    {"code": "DATA",       "name": "Data",                "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "OPERATIONS", "name": "Operations",          "sla_critical_hours": 4,  "sla_high_hours": 24},
    {"code": "FINANCE",    "name": "Finance",             "sla_critical_hours": 4,  "sla_high_hours": 24},
]


class Command(BaseCommand):
    help = 'Seed UAT data — run with --clear to wipe first'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true')

    def handle(self, *args, **options):
        from departments.models import Department

        if options['clear']:
            self.stdout.write('Clearing existing data...')
            from django.db import connection
            with connection.cursor() as cursor:
                # PostgreSQL: TRUNCATE with CASCADE handles FK constraints automatically
                cursor.execute('''
                    TRUNCATE TABLE
                        ai.training_feedback,
                        ai.analysis_cache,
                        ai.request_log,
                        audit.audit_logs,
                        core.attachments,
                        core.insurance_fields,
                        core.internal_fields,
                        core.comments,
                        audit.notifications,
                        core.tickets
                    CASCADE
                ''')
                cursor.execute('DELETE FROM identity.users WHERE is_superuser = FALSE')
                cursor.execute('TRUNCATE TABLE core.departments CASCADE')
            self.stdout.write('  ✓ Cleared\n')

        # ── Step 1: Departments ──────────────────────────────────────────────
        self.stdout.write('Step 1: Creating departments...')
        for d in DEPARTMENTS:
            dept, created = Department.objects.get_or_create(
                code=d['code'],
                defaults={
                    'name': d['name'],
                    'sla_critical_hours': d['sla_critical_hours'],
                    'sla_high_hours': d['sla_high_hours'],
                    'is_active': True,
                },
            )
            status = 'created' if created else 'exists'
            self.stdout.write(f'  ✓ {dept.name} ({status})')

        self.stdout.write(self.style.SUCCESS('\nStep 1 done — 12 departments ready.'))

        # ── Step 2: Super Admin ──────────────────────────────────────────────
        from django.contrib.auth import get_user_model
        User = get_user_model()

        self.stdout.write('Step 2: Creating super admin...')
        admin, created = User.objects.get_or_create(
            email='admin@fatakpay.com',
            defaults={
                'first_name': 'Vikram',
                'last_name': 'Mehta',
                'role': 'SUPER_ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            },
        )
        admin.set_password('Admin@1234')
        admin.save(update_fields=['password'])
        status = 'created' if created else 'exists'
        self.stdout.write(f'  ✓ {admin.full_name} — admin@fatakpay.com ({status})')

        self.stdout.write(self.style.SUCCESS('\nStep 2 done — super admin ready.'))

        # ── Step 3: Department Heads ─────────────────────────────────────────
        HEADS = {
            'IT':         ('Arjun',    'Sharma',    'arjun.sharma'),
            'PRODUCT':    ('Priya',    'Nair',      'priya.nair'),
            'MARKETING':  ('Rohit',    'Verma',     'rohit.verma'),
            'SALES':      ('Sneha',    'Kapoor',    'sneha.kapoor'),
            'CALLING':    ('Manish',   'Gupta',     'manish.gupta'),
            'ACTIVATION': ('Divya',    'Pillai',    'divya.pillai'),
            'IT_ADMIN':   ('Suresh',   'Iyer',      'suresh.iyer'),
            'PROD_SUP':   ('Karan',    'Malhotra',  'karan.malhotra'),
            'LEGAL':      ('Ananya',   'Bose',      'ananya.bose'),
            'DATA':       ('Rahul',    'Joshi',     'rahul.joshi'),
            'OPERATIONS': ('Pooja',    'Singh',     'pooja.singh'),
            'FINANCE':    ('Amit',     'Agarwal',   'amit.agarwal'),
        }

        self.stdout.write('Step 3: Creating department heads...')
        from departments.models import Department
        User = get_user_model()

        for code, (first, last, handle) in HEADS.items():
            dept = Department.objects.get(code=code)
            email = f'{handle}@fatakpay.com'
            head, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first,
                    'last_name':  last,
                    'role':       'DEPT_HEAD',
                    'department': dept,
                    'is_active':  True,
                },
            )
            head.set_password('Head@1234')
            head.save(update_fields=['password'])
            if not dept.head:
                dept.head = head
                dept.save(update_fields=['head'])
            status = 'created' if created else 'exists'
            self.stdout.write(f'  ✓ {head.full_name} → {dept.name} ({status})')

        self.stdout.write(self.style.SUCCESS('\nStep 3 done — 12 HODs ready.'))

        # ── Step 4: Members + Callers ───────────────────────────────────────
        # Each dept: 3 members + 1 caller
        DEPT_PEOPLE = {
            'IT': {
                'members': [
                    ('Nikhil',   'Pandey',    'nikhil.pandey'),
                    ('Sakshi',   'Tiwari',    'sakshi.tiwari'),
                    ('Deepak',   'Rao',       'deepak.rao'),
                ],
                'callers': [('Ritu', 'Saxena', 'ritu.saxena')],
            },
            'PRODUCT': {
                'members': [
                    ('Aditya',   'Kumar',     'aditya.kumar'),
                    ('Meera',    'Menon',     'meera.menon'),
                    ('Saurabh',  'Dubey',     'saurabh.dubey'),
                ],
                'callers': [('Kavya', 'Reddy', 'kavya.reddy')],
            },
            'MARKETING': {
                'members': [
                    ('Tanvi',    'Shah',      'tanvi.shah'),
                    ('Varun',    'Mishra',    'varun.mishra'),
                    ('Ishaan',   'Chopra',    'ishaan.chopra'),
                ],
                'callers': [('Neha', 'Jain', 'neha.jain')],
            },
            'SALES': {
                'members': [
                    ('Akash',    'Yadav',     'akash.yadav'),
                    ('Shruti',   'Patel',     'shruti.patel'),
                    ('Vivek',    'Nanda',     'vivek.nanda'),
                ],
                'callers': [('Simran', 'Kaur', 'simran.kaur')],
            },
            'CALLING': {
                'members': [
                    ('Mohit',    'Bansal',    'mohit.bansal'),
                    ('Ankita',   'Desai',     'ankita.desai'),
                    ('Rajesh',   'Khanna',    'rajesh.khanna'),
                ],
                'callers': [('Preeti', 'Soni', 'preeti.soni')],
            },
            'ACTIVATION': {
                'members': [
                    ('Gaurav',   'Bajaj',     'gaurav.bajaj'),
                    ('Swati',    'Kulkarni',  'swati.kulkarni'),
                    ('Harish',   'Nair',      'harish.nair'),
                ],
                'callers': [('Pooja', 'Rawat', 'pooja.rawat')],
            },
            'IT_ADMIN': {
                'members': [
                    ('Vishal',   'Thakur',    'vishal.thakur'),
                    ('Pallavi',  'Ghosh',     'pallavi.ghosh'),
                    ('Sandeep',  'Rathi',     'sandeep.rathi'),
                ],
                'callers': [('Amit', 'Srivastava', 'amit.srivastava')],
            },
            'PROD_SUP': {
                'members': [
                    ('Tushar',   'Pawar',     'tushar.pawar'),
                    ('Nidhi',    'Chandra',   'nidhi.chandra'),
                    ('Abhishek', 'Tripathi',  'abhishek.tripathi'),
                ],
                'callers': [('Ravi', 'Shukla', 'ravi.shukla')],
            },
            'LEGAL': {
                'members': [
                    ('Siddharth','Mukherjee', 'siddharth.mukherjee'),
                    ('Ritika',   'Chatterjee','ritika.chatterjee'),
                    ('Pranav',   'Deshpande', 'pranav.deshpande'),
                ],
                'callers': [('Sunita', 'Rao', 'sunita.rao')],
            },
            'DATA': {
                'members': [
                    ('Kartik',   'Arora',     'kartik.arora'),
                    ('Bhavna',   'Sethi',     'bhavna.sethi'),
                    ('Yash',     'Mathur',    'yash.mathur'),
                ],
                'callers': [('Deepa', 'Pillai', 'deepa.pillai')],
            },
            'OPERATIONS': {
                'members': [
                    ('Sumit',    'Bhatia',    'sumit.bhatia'),
                    ('Rekha',    'Varma',     'rekha.varma'),
                    ('Nitin',    'Saxena',    'nitin.saxena'),
                ],
                'callers': [('Alok', 'Tiwari', 'alok.tiwari')],
            },
            'FINANCE': {
                'members': [
                    ('Hemant',   'Joshi',     'hemant.joshi'),
                    ('Shweta',   'Gupta',     'shweta.gupta'),
                    ('Pankaj',   'Sinha',     'pankaj.sinha'),
                ],
                'callers': [('Geeta', 'Sharma', 'geeta.sharma')],
            },
        }

        self.stdout.write('Step 4: Creating members and callers...')
        from departments.models import Department
        User = get_user_model()

        for code, people in DEPT_PEOPLE.items():
            dept = Department.objects.get(code=code)

            for first, last, handle in people['members']:
                email = f'{handle}@fatakpay.com'
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'first_name': first, 'last_name': last,
                        'role': 'MEMBER', 'department': dept, 'is_active': True,
                    },
                )
                user.set_password('Member@1234')
                user.save(update_fields=['password'])
                status = 'created' if created else 'exists'
                self.stdout.write(f'  ✓ [MEMBER] {user.full_name} → {dept.name} ({status})')

            for first, last, handle in people['callers']:
                email = f'{handle}@fatakpay.com'
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'first_name': first, 'last_name': last,
                        'role': 'CALLER', 'department': dept, 'is_active': True,
                    },
                )
                user.set_password('Caller@1234')
                user.save(update_fields=['password'])
                status = 'created' if created else 'exists'
                self.stdout.write(f'  ✓ [CALLER] {user.full_name} → {dept.name} ({status})')

        self.stdout.write(self.style.SUCCESS('\nStep 4 done — 48 users ready (36 members + 12 callers).'))

        # ── Step 5: Tickets ──────────────────────────────────────────────────
        from tickets.models import Ticket, InsuranceField, InternalField
        from django.utils import timezone
        from datetime import timedelta
        User = get_user_model()
        from departments.models import Department

        self.stdout.write('Step 5: Creating tickets...')
        now = timezone.now()

        def make_ticket(dept_code, subject, description, status, priority,
                        ticket_type, problem_category, sub_problem,
                        created_by_email, assignee_email,
                        sla_breached=False, resolved=False, closed=False):
            dept = Department.objects.get(code=dept_code)
            created_by = User.objects.get(email=created_by_email)
            assignee = User.objects.get(email=assignee_email) if assignee_email else None

            if priority == 'critical':
                hours = dept.sla_critical_hours
            elif priority == 'high':
                hours = dept.sla_high_hours
            elif priority == 'medium':
                hours = dept.sla_high_hours * 2
            else:
                hours = dept.sla_high_hours * 3

            sla_deadline = (now - timedelta(hours=2)) if sla_breached else (now + timedelta(hours=hours))
            sla_breach_at = (now - timedelta(hours=1)) if sla_breached else None
            resolved_at = (now - timedelta(hours=3)) if resolved else None
            closed_at = (now - timedelta(hours=1)) if closed else None

            t = Ticket.objects.create(
                ticket_type=ticket_type,
                subject=subject,
                description=description,
                status=status,
                priority=priority,
                department=dept,
                created_by=created_by,
                assignee=assignee,
                problem_category=problem_category,
                sub_problem=sub_problem,
                tags=[dept_code.lower(), problem_category.lower().replace(' ', '_')[:20]],
                sla_deadline=sla_deadline,
                sla_breached=sla_breached,
                sla_breach_at=sla_breach_at,
                resolved_at=resolved_at,
                closed_at=closed_at,
            )
            InternalField.objects.create(ticket=t, affected_system=dept.name, business_impact=priority.capitalize())
            return t

        # ── IT ──────────────────────────────────────────────────────────────────────────────
        make_ticket('IT', 'VPN not connecting for WFH users',
            'Multiple employees unable to connect to VPN since morning. Affecting 15+ users in sales and ops.',
            'open', 'critical', 'internal', 'VPN Issue', 'Cannot connect from home network',
            'admin@fatakpay.com', None)

        make_ticket('IT', 'Outlook emails not syncing on mobile',
            'Emails not syncing on iOS devices for 3 users. Last sync was 6 hours ago.',
            'assigned', 'high', 'internal', 'Email Issue', 'iOS mail app not syncing',
            'ritu.saxena@fatakpay.com', 'nikhil.pandey@fatakpay.com')

        make_ticket('IT', 'New joiner laptop setup pending',
            'Laptop for Priya Nair joining on Monday not configured. Needs OS, tools and access setup.',
            'in_progress', 'medium', 'internal', 'Software Installation', 'Dev tools and VPN client',
            'arjun.sharma@fatakpay.com', 'sakshi.tiwari@fatakpay.com')

        make_ticket('IT', 'Production server CPU at 98%',
            'App server CPU spiking to 98% since last deployment. Users facing slow load times.',
            'escalated', 'critical', 'internal', 'System Performance Issue', 'Post-deployment CPU spike',
            'admin@fatakpay.com', 'deepak.rao@fatakpay.com',
            sla_breached=True)

        make_ticket('IT', 'Access request for CRM portal',
            'New team member Akash Yadav needs read access to CRM portal for sales reporting.',
            'resolved', 'low', 'internal', 'Access Request', 'CRM read-only access',
            'sneha.kapoor@fatakpay.com', 'nikhil.pandey@fatakpay.com',
            resolved=True)

        make_ticket('IT', 'Security incident — suspicious login attempt',
            'Multiple failed login attempts detected on admin panel from unknown IP 103.21.x.x.',
            'in_progress', 'critical', 'internal', 'Security Incident', 'Brute force on admin panel',
            'admin@fatakpay.com', 'deepak.rao@fatakpay.com',
            sla_breached=True)

        self.stdout.write('  ✓ IT tickets done')

        # ── PRODUCT ─────────────────────────────────────────────────────────────────────
        make_ticket('PRODUCT', 'Add bulk upload feature for loan applications',
            'Operations team needs bulk CSV upload for loan applications. Currently doing one by one.',
            'open', 'high', 'internal', 'New Feature Request', 'Bulk CSV upload for ops',
            'pooja.singh@fatakpay.com', None)

        make_ticket('PRODUCT', 'Dashboard filter not saving user preferences',
            'Users report that dashboard filters reset on every login. Expected to persist per user.',
            'in_progress', 'medium', 'internal', 'Bug Validation', 'Filter state not persisting',
            'kavya.reddy@fatakpay.com', 'aditya.kumar@fatakpay.com')

        make_ticket('PRODUCT', 'Loan repayment screen UX improvement',
            'Repayment screen is confusing for customers. Need clearer breakdown of principal vs interest.',
            'assigned', 'medium', 'internal', 'UI/UX Improvement', 'Repayment breakdown clarity',
            'priya.nair@fatakpay.com', 'meera.menon@fatakpay.com')

        make_ticket('PRODUCT', 'Business rule change — late fee calculation',
            'Finance team requesting change in late fee logic. Currently flat rate, needs to be percentage-based.',
            'on_hold', 'high', 'internal', 'Business Rule Update', 'Late fee % based calculation',
            'amit.agarwal@fatakpay.com', 'saurabh.dubey@fatakpay.com')

        make_ticket('PRODUCT', 'API requirement for partner integration',
            'New lending partner needs REST API for loan status check. Spec document attached.',
            'open', 'critical', 'internal', 'API Requirement', 'Partner loan status API',
            'admin@fatakpay.com', None,
            sla_breached=True)

        make_ticket('PRODUCT', 'Notification config change for SMS alerts',
            'SMS alerts for loan approval going to wrong template. Need config update in notification service.',
            'closed', 'low', 'internal', 'Configuration Change', 'SMS template mapping fix',
            'priya.nair@fatakpay.com', 'aditya.kumar@fatakpay.com',
            resolved=True, closed=True)

        self.stdout.write('  ✓ Product tickets done')

        # ── MARKETING ──────────────────────────────────────────────────────────────────
        make_ticket('MARKETING', 'Diwali campaign creative approval pending',
            'Diwali campaign creatives ready for review. Need approval from HOD before sending to print.',
            'open', 'high', 'internal', 'Campaign Approval', 'Print creative sign-off',
            'neha.jain@fatakpay.com', None)

        make_ticket('MARKETING', 'WhatsApp campaign for loan offer not triggered',
            'Scheduled WhatsApp campaign for 50k users did not trigger at 10am. Needs immediate fix.',
            'escalated', 'critical', 'internal', 'WhatsApp Campaign', 'Scheduled campaign not fired',
            'rohit.verma@fatakpay.com', 'tanvi.shah@fatakpay.com',
            sla_breached=True)

        make_ticket('MARKETING', 'SEO audit report for Q3',
            'Need full SEO audit for fatakpay.com covering on-page, backlinks and Core Web Vitals.',
            'in_progress', 'medium', 'internal', 'SEO Request', 'Q3 full site audit',
            'rohit.verma@fatakpay.com', 'varun.mishra@fatakpay.com')

        make_ticket('MARKETING', 'Landing page for personal loan product',
            'New personal loan product launching next week. Need dedicated landing page with lead form.',
            'assigned', 'high', 'internal', 'Landing Page Request', 'Personal loan lead capture page',
            'admin@fatakpay.com', 'ishaan.chopra@fatakpay.com')

        make_ticket('MARKETING', 'Brand logo misused in partner collateral',
            'Partner bank using old FatakPay logo in their branch posters. Need to send updated brand kit.',
            'resolved', 'medium', 'internal', 'Brand Assets', 'Logo version correction',
            'rohit.verma@fatakpay.com', 'tanvi.shah@fatakpay.com',
            resolved=True)

        make_ticket('MARKETING', 'Email campaign for festive season',
            'Festive season email campaign targeting 1L users. HTML template and subject line needed.',
            'open', 'low', 'internal', 'Email Campaign', 'Festive HTML email template',
            'neha.jain@fatakpay.com', None)

        self.stdout.write('  ✓ Marketing tickets done')

        self.stdout.write(self.style.SUCCESS('\nBatch 1 done — IT, Product, Marketing tickets created.'))

        # ── SALES ───────────────────────────────────────────────────────────────────────────
        make_ticket('SALES', 'Lead not assigned after form submission',
            'Customer filled loan inquiry form on website 2 days ago. No lead assigned yet in CRM.',
            'open', 'high', 'internal', 'Lead Assignment', 'Web form lead not mapped to CRM',
            'simran.kaur@fatakpay.com', None)

        make_ticket('SALES', 'CRM crashing on bulk lead import',
            'Sales CRM throws 500 error when importing more than 200 leads via CSV. Blocking daily ops.',
            'escalated', 'critical', 'internal', 'Sales CRM Issue', 'Bulk import 500 error',
            'sneha.kapoor@fatakpay.com', 'akash.yadav@fatakpay.com',
            sla_breached=True)

        make_ticket('SALES', 'Incentive calculation wrong for March',
            'March incentive payout shows incorrect figures for 8 sales reps. Needs recomputation.',
            'in_progress', 'high', 'internal', 'Incentive Query', 'March payout discrepancy',
            'sneha.kapoor@fatakpay.com', 'shruti.patel@fatakpay.com')

        make_ticket('SALES', 'Sales pitch deck update needed',
            'Current pitch deck has old product rates. Need updated version with Q4 pricing.',
            'assigned', 'medium', 'internal', 'Sales Material Request', 'Q4 pricing deck update',
            'simran.kaur@fatakpay.com', 'vivek.nanda@fatakpay.com')

        make_ticket('SALES', 'Customer escalation — loan rejected without reason',
            'Customer Ramesh Gupta (App ID: FP-29341) loan rejected. No rejection reason communicated.',
            'resolved', 'high', 'internal', 'Customer Escalation', 'Rejection reason not shared',
            'simran.kaur@fatakpay.com', 'akash.yadav@fatakpay.com',
            resolved=True)

        make_ticket('SALES', 'Sales report for Q3 not generated',
            'Automated Q3 sales report not received by HOD. Scheduled job may have failed.',
            'closed', 'low', 'internal', 'Sales Report', 'Q3 scheduled report missing',
            'sneha.kapoor@fatakpay.com', 'shruti.patel@fatakpay.com',
            resolved=True, closed=True)

        self.stdout.write('  ✓ Sales tickets done')

        # ── CALLING ─────────────────────────────────────────────────────────────────────
        make_ticket('CALLING', 'Dialer system down since 9am',
            'Auto-dialer not connecting calls since 9am. Entire calling team of 30 agents idle.',
            'escalated', 'critical', 'internal', 'Dialer Issue', 'Auto-dialer service down',
            'manish.gupta@fatakpay.com', 'mohit.bansal@fatakpay.com',
            sla_breached=True)

        make_ticket('CALLING', 'Call recordings missing for last 3 days',
            'Call recordings not available in CRM for calls made Oct 1-3. Compliance audit at risk.',
            'in_progress', 'high', 'internal', 'Call Recording Issue', 'Recordings missing in CRM',
            'manish.gupta@fatakpay.com', 'ankita.desai@fatakpay.com')

        make_ticket('CALLING', 'Disposition codes not saving after call',
            'Agents report that call disposition is not saving. Have to re-enter after every call.',
            'assigned', 'medium', 'internal', 'Disposition Issue', 'Disposition not persisting post-call',
            'preeti.soni@fatakpay.com', 'rajesh.khanna@fatakpay.com')

        make_ticket('CALLING', 'New campaign data allocation request',
            'Need 5000 fresh leads allocated for new personal loan campaign starting Monday.',
            'open', 'medium', 'internal', 'Campaign Allocation', 'Personal loan campaign leads',
            'preeti.soni@fatakpay.com', None)

        make_ticket('CALLING', 'Headset not working for 5 agents',
            'USB headsets for 5 agents in bay 3 stopped working. Calls going on speaker.',
            'resolved', 'low', 'internal', 'Headset Issue', 'USB headset hardware fault',
            'preeti.soni@fatakpay.com', 'mohit.bansal@fatakpay.com',
            resolved=True)

        make_ticket('CALLING', 'Call quality degraded on Jio network',
            'Agents on Jio SIM reporting echo and drops. Airtel lines working fine.',
            'on_hold', 'medium', 'internal', 'Call Quality Issue', 'Jio network echo and drops',
            'manish.gupta@fatakpay.com', 'ankita.desai@fatakpay.com')

        self.stdout.write('  ✓ Calling tickets done')

        # ── ACTIVATION ─────────────────────────────────────────────────────────────────
        make_ticket('ACTIVATION', 'KYC stuck in pending for 48 hours',
            'Customer Sunita Devi (App: FP-44821) KYC pending for 48 hrs. Aadhaar verification failing.',
            'escalated', 'critical', 'internal', 'KYC Pending', 'Aadhaar API verification failure',
            'pooja.rawat@fatakpay.com', 'gaurav.bajaj@fatakpay.com',
            sla_breached=True)

        make_ticket('ACTIVATION', 'Document verification queue backlog',
            'Over 200 applications pending document verification. Team capacity insufficient.',
            'in_progress', 'high', 'internal', 'Document Verification', 'Queue backlog clearance',
            'divya.pillai@fatakpay.com', 'swati.kulkarni@fatakpay.com')

        make_ticket('ACTIVATION', 'Account activation failing for NRI customers',
            'NRI customers with foreign address unable to complete activation. Address validation rejecting.',
            'assigned', 'high', 'internal', 'Activation Failed', 'Foreign address validation error',
            'pooja.rawat@fatakpay.com', 'harish.nair@fatakpay.com')

        make_ticket('ACTIVATION', 'Re-KYC request for existing customer',
            'Customer Mohan Lal (ID: FP-11203) requesting re-KYC due to address change.',
            'open', 'medium', 'internal', 'Re-KYC', 'Address change re-verification',
            'pooja.rawat@fatakpay.com', None)

        make_ticket('ACTIVATION', 'Activation approval pending from legal',
            'High-value customer activation (loan > 5L) pending legal sign-off for 3 days.',
            'on_hold', 'high', 'internal', 'Activation Approval', 'Legal sign-off for high-value loan',
            'divya.pillai@fatakpay.com', 'gaurav.bajaj@fatakpay.com')

        make_ticket('ACTIVATION', 'Customer verification completed successfully',
            'Batch of 50 customers verified and activated. Closing ticket.',
            'closed', 'low', 'internal', 'Customer Verification', 'Batch activation completed',
            'divya.pillai@fatakpay.com', 'swati.kulkarni@fatakpay.com',
            resolved=True, closed=True)

        self.stdout.write('  ✓ Activation tickets done')

        self.stdout.write(self.style.SUCCESS('\nBatch 2 done — Sales, Calling, Activation tickets created.'))

        # ── IT ADMIN ───────────────────────────────────────────────────────────────────
        make_ticket('IT_ADMIN', 'Laptop request for new joiner — Karan Malhotra',
            'New HOD joining Prod Support on Monday needs laptop, docking station and peripherals.',
            'open', 'high', 'internal', 'Laptop/Desktop Request', 'HOD onboarding hardware',
            'amit.srivastava@fatakpay.com', None)

        make_ticket('IT_ADMIN', 'Software license renewal — Adobe Creative Cloud',
            '5 Adobe CC licenses expiring this Friday. Marketing team will be blocked without renewal.',
            'escalated', 'critical', 'internal', 'Software License Request', 'Adobe CC renewal urgent',
            'suresh.iyer@fatakpay.com', 'vishal.thakur@fatakpay.com',
            sla_breached=True)

        make_ticket('IT_ADMIN', 'Email ID creation for 3 new joiners',
            'HR confirmed 3 new joiners starting Monday. Need corporate email IDs created by Friday.',
            'in_progress', 'high', 'internal', 'Email Creation', 'New joiner email setup',
            'amit.srivastava@fatakpay.com', 'pallavi.ghosh@fatakpay.com')

        make_ticket('IT_ADMIN', 'Employee offboarding — access revocation',
            'Rahul Desai resigned effective today. All system access, email and VPN must be revoked.',
            'assigned', 'critical', 'internal', 'Employee Offboarding', 'Full access revocation',
            'suresh.iyer@fatakpay.com', 'sandeep.rathi@fatakpay.com')

        make_ticket('IT_ADMIN', 'Printer not working in finance bay',
            'HP LaserJet in finance bay showing offline. 8 employees unable to print documents.',
            'resolved', 'medium', 'internal', 'Office Equipment Issue', 'HP LaserJet offline',
            'amit.srivastava@fatakpay.com', 'vishal.thakur@fatakpay.com',
            resolved=True)

        make_ticket('IT_ADMIN', 'ID card request for 5 employees',
            'ID cards for 5 employees who joined last month still pending. Security flagging them daily.',
            'closed', 'low', 'internal', 'ID Card Request', 'Pending ID card issuance',
            'amit.srivastava@fatakpay.com', 'pallavi.ghosh@fatakpay.com',
            resolved=True, closed=True)

        self.stdout.write('  ✓ IT Admin tickets done')

        # ── PRODUCTION SUPPORT ──────────────────────────────────────────────────────────
        make_ticket('PROD_SUP', 'Payment gateway returning 502 errors',
            'Razorpay integration returning 502 intermittently since 2am. ~12% transactions failing.',
            'escalated', 'critical', 'internal', 'Payment Failure', 'Razorpay 502 intermittent',
            'karan.malhotra@fatakpay.com', 'tushar.pawar@fatakpay.com',
            sla_breached=True)

        make_ticket('PROD_SUP', 'Loan disbursement API timing out',
            'Disbursement API p99 latency at 12s. SLA is 3s. Affecting 200+ disbursements per hour.',
            'in_progress', 'critical', 'internal', 'API Failure', 'Disbursement API high latency',
            'karan.malhotra@fatakpay.com', 'nidhi.chandra@fatakpay.com',
            sla_breached=True)

        make_ticket('PROD_SUP', 'Database connection pool exhausted',
            'MySQL connection pool hitting max limit during peak hours 11am-1pm daily.',
            'in_progress', 'high', 'internal', 'Database Issue', 'MySQL pool exhaustion peak hours',
            'karan.malhotra@fatakpay.com', 'abhishek.tripathi@fatakpay.com')

        make_ticket('PROD_SUP', 'Hotfix needed for EMI calculation bug',
            'EMI calculation showing wrong amount for loans with processing fee > 2%. Affects ~500 users.',
            'assigned', 'critical', 'internal', 'Hotfix Request', 'EMI calc wrong with high processing fee',
            'ravi.shukla@fatakpay.com', 'tushar.pawar@fatakpay.com')

        make_ticket('PROD_SUP', 'Monitoring alert — disk usage at 89%',
            'App server disk at 89%. Log rotation not running. Needs cleanup before hitting 95%.',
            'open', 'medium', 'internal', 'Monitoring Alert', 'Disk usage 89% log rotation failure',
            'ravi.shukla@fatakpay.com', None)

        make_ticket('PROD_SUP', 'Post-deployment RCA for Oct 2 outage',
            '45-minute outage on Oct 2 after v2.4.1 deployment. RCA document needed for management.',
            'resolved', 'high', 'internal', 'Root Cause Analysis', 'v2.4.1 deployment outage RCA',
            'karan.malhotra@fatakpay.com', 'nidhi.chandra@fatakpay.com',
            resolved=True)

        self.stdout.write('  ✓ Production Support tickets done')

        # ── LEGAL ───────────────────────────────────────────────────────────────────────────
        make_ticket('LEGAL', 'RBI circular compliance — new KYC norms',
            'RBI issued new KYC norms circular on Oct 1. Need gap analysis and implementation plan by Oct 15.',
            'in_progress', 'critical', 'internal', 'RBI Compliance', 'New KYC norms gap analysis',
            'ananya.bose@fatakpay.com', 'siddharth.mukherjee@fatakpay.com',
            sla_breached=True)

        make_ticket('LEGAL', 'Vendor agreement review — cloud storage provider',
            'New AWS MSA needs legal review before signing. 3 clauses flagged by finance for negotiation.',
            'assigned', 'high', 'internal', 'Vendor Agreement', 'AWS MSA clause negotiation',
            'ananya.bose@fatakpay.com', 'ritika.chatterjee@fatakpay.com')

        make_ticket('LEGAL', 'Customer complaint — unauthorized deduction',
            'Customer Vijay Kumar filed complaint about Rs 2400 deducted without consent. Legal notice received.',
            'escalated', 'critical', 'internal', 'Customer Complaint', 'Unauthorized deduction legal notice',
            'sunita.rao@fatakpay.com', 'pranav.deshpande@fatakpay.com',
            sla_breached=True)

        make_ticket('LEGAL', 'Internal audit support — Q2 documentation',
            'Internal audit team needs Q2 loan agreement samples and compliance certificates.',
            'open', 'medium', 'internal', 'Audit Support', 'Q2 audit document preparation',
            'sunita.rao@fatakpay.com', None)

        make_ticket('LEGAL', 'Privacy policy update for app v3.0',
            'App v3.0 collects new data points. Privacy policy needs update before Play Store submission.',
            'in_progress', 'high', 'internal', 'Policy Review', 'Privacy policy v3.0 update',
            'ananya.bose@fatakpay.com', 'siddharth.mukherjee@fatakpay.com')

        make_ticket('LEGAL', 'Compliance approval for new loan product',
            'Personal loan product for self-employed segment needs compliance sign-off before launch.',
            'resolved', 'high', 'internal', 'Compliance Approval', 'Self-employed loan product sign-off',
            'ananya.bose@fatakpay.com', 'ritika.chatterjee@fatakpay.com',
            resolved=True)

        self.stdout.write('  ✓ Legal tickets done')

        self.stdout.write(self.style.SUCCESS('\nBatch 3 done — IT Admin, Production Support, Legal tickets created.'))

        # ── DATA ─────────────────────────────────────────────────────────────────────────────
        make_ticket('DATA', 'MIS report not generated for September',
            'Monthly MIS report for September not received by management. Scheduled job failed silently.',
            'escalated', 'critical', 'internal', 'MIS Request', 'September MIS job failure',
            'rahul.joshi@fatakpay.com', 'kartik.arora@fatakpay.com',
            sla_breached=True)

        make_ticket('DATA', 'Dashboard showing wrong disbursement numbers',
            'Operations dashboard showing Rs 2.3Cr disbursed but finance records show Rs 2.8Cr. Data mismatch.',
            'in_progress', 'high', 'internal', 'Data Mismatch', 'Disbursement figure discrepancy',
            'rahul.joshi@fatakpay.com', 'bhavna.sethi@fatakpay.com')

        make_ticket('DATA', 'SQL query for overdue loan report',
            'Collections team needs list of all loans overdue > 30 days with customer contact details.',
            'assigned', 'medium', 'internal', 'SQL Query Request', 'Overdue 30+ days loan list',
            'deepa.pillai@fatakpay.com', 'yash.mathur@fatakpay.com')

        make_ticket('DATA', 'Analytics dashboard for sales funnel',
            'Sales HOD needs conversion funnel dashboard — lead to login to disbursal drop-off rates.',
            'open', 'high', 'internal', 'Dashboard Request', 'Sales funnel conversion dashboard',
            'deepa.pillai@fatakpay.com', None)

        make_ticket('DATA', 'Data correction — wrong PAN linked to customer',
            'Customer FP-38821 has wrong PAN number in system. Needs correction before credit bureau pull.',
            'in_progress', 'critical', 'internal', 'Data Correction', 'PAN number correction pre-bureau',
            'deepa.pillai@fatakpay.com', 'kartik.arora@fatakpay.com',
            sla_breached=True)

        make_ticket('DATA', 'Weekly analytics report delivered',
            'Week 40 analytics report sent to all HODs. Closing ticket.',
            'closed', 'low', 'internal', 'Analytics Request', 'Week 40 analytics delivery',
            'rahul.joshi@fatakpay.com', 'bhavna.sethi@fatakpay.com',
            resolved=True, closed=True)

        self.stdout.write('  ✓ Data tickets done')

        # ── OPERATIONS ──────────────────────────────────────────────────────────────────
        make_ticket('OPERATIONS', 'NACH mandate rejection for 120 customers',
            'NACH mandates for 120 customers rejected by bank with error code E005. EMI collection at risk.',
            'escalated', 'critical', 'internal', 'NACH Issue', 'Bank E005 mandate rejection',
            'pooja.singh@fatakpay.com', 'sumit.bhatia@fatakpay.com',
            sla_breached=True)

        make_ticket('OPERATIONS', 'Loan disbursement stuck for 3 customers',
            'Disbursement for FP-49201, FP-49205, FP-49210 stuck in processing for 6 hours.',
            'in_progress', 'high', 'internal', 'Loan Disbursement', 'Disbursement stuck in processing',
            'alok.tiwari@fatakpay.com', 'rekha.varma@fatakpay.com')

        make_ticket('OPERATIONS', 'Refund request — double EMI deducted',
            'Customer Pradeep Sharma (FP-22341) EMI deducted twice on Oct 3. Refund of Rs 4800 needed.',
            'assigned', 'high', 'internal', 'Refund Request', 'Double EMI deduction refund',
            'alok.tiwari@fatakpay.com', 'nitin.saxena@fatakpay.com')

        make_ticket('OPERATIONS', 'Customer query — loan closure process',
            'Customer asking for foreclosure charges and process for loan FP-18820. Needs detailed response.',
            'open', 'medium', 'internal', 'Customer Query', 'Foreclosure charges clarification',
            'alok.tiwari@fatakpay.com', None)

        make_ticket('OPERATIONS', 'Collection agency coordination for NPA accounts',
            'List of 45 NPA accounts to be shared with collection agency. Legal clearance received.',
            'in_progress', 'medium', 'internal', 'Collection Issue', 'NPA list to collection agency',
            'pooja.singh@fatakpay.com', 'sumit.bhatia@fatakpay.com')

        make_ticket('OPERATIONS', 'Process clarification — part payment handling',
            'Ops team unclear on SOP for part payments. Need updated process document from product.',
            'resolved', 'low', 'internal', 'Process Clarification', 'Part payment SOP update',
            'alok.tiwari@fatakpay.com', 'rekha.varma@fatakpay.com',
            resolved=True)

        self.stdout.write('  ✓ Operations tickets done')

        # ── FINANCE ─────────────────────────────────────────────────────────────────────
        make_ticket('FINANCE', 'Vendor payment stuck — AWS invoice Oct',
            'AWS invoice for October Rs 3.2L not processed. Payment due date was Oct 5. Late fee risk.',
            'escalated', 'critical', 'internal', 'Vendor Payment', 'AWS October invoice overdue',
            'amit.agarwal@fatakpay.com', 'hemant.joshi@fatakpay.com',
            sla_breached=True)

        make_ticket('FINANCE', 'GST filing data preparation for Q2',
            'Q2 GST return filing due Oct 20. Need consolidated invoice data from all departments.',
            'in_progress', 'high', 'internal', 'GST Query', 'Q2 GST return data consolidation',
            'amit.agarwal@fatakpay.com', 'shweta.gupta@fatakpay.com')

        make_ticket('FINANCE', 'Employee reimbursement pending for September',
            '14 employees have pending travel and expense reimbursements for September. Total Rs 87,400.',
            'assigned', 'medium', 'internal', 'Employee Reimbursement', 'September expense reimbursements',
            'geeta.sharma@fatakpay.com', 'pankaj.sinha@fatakpay.com')

        make_ticket('FINANCE', 'TDS certificate request for vendor',
            'Vendor Infosys BPO requesting Form 16A TDS certificate for Q2. Needed for their ITR filing.',
            'open', 'medium', 'internal', 'TDS Query', 'Form 16A for Infosys BPO',
            'geeta.sharma@fatakpay.com', None)

        make_ticket('FINANCE', 'Budget approval for Q4 marketing spend',
            'Marketing team requesting Rs 15L budget for Q4 campaigns. CFO approval needed.',
            'on_hold', 'high', 'internal', 'Budget Approval', 'Q4 marketing Rs 15L approval',
            'amit.agarwal@fatakpay.com', 'hemant.joshi@fatakpay.com')

        make_ticket('FINANCE', 'Bank reconciliation completed for September',
            'September bank reconciliation done. All entries matched. Closing ticket.',
            'closed', 'low', 'internal', 'Bank Reconciliation', 'September reconciliation complete',
            'amit.agarwal@fatakpay.com', 'shweta.gupta@fatakpay.com',
            resolved=True, closed=True)

        self.stdout.write('  ✓ Finance tickets done')

        self.stdout.write(self.style.SUCCESS('\nBatch 4 done — Data, Operations, Finance tickets created.'))
        self.stdout.write(self.style.SUCCESS('\n✓ All seed data complete! 72 tickets across 12 departments.'))
        self.stdout.write('\nLogin credentials:')
        self.stdout.write('  admin@fatakpay.com          / Admin@1234   (Super Admin)')
        self.stdout.write('  arjun.sharma@fatakpay.com   / Head@1234    (IT HOD)')
        self.stdout.write('  nikhil.pandey@fatakpay.com  / Member@1234  (IT Member)')
        self.stdout.write('  ritu.saxena@fatakpay.com    / Caller@1234  (IT Caller)')
