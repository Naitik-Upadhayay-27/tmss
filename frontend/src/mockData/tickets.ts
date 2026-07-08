import type { Ticket } from '@/types';
import { mockUsers } from './users';
import { mockDepartments } from './departments';

export const mockTickets: Ticket[] = [
  {
    "id": 1,
    "ticket_number": "TKT-0001",
    "ticket_type": "internal",
    "subject": "Sample Ticket 1 for Loan Operations",
    "description": "This is a sample description for ticket 1. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 19,
      "email": "member2.loan_ops@fatakpay.com",
      "first_name": "Member2",
      "last_name": "LOAN_OPS",
      "full_name": "Member2 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T05:20:35.080Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 2,
    "ticket_number": "TKT-0002",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 2 for Technology — Backend",
    "description": "This is a sample description for ticket 2. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 30,
      "email": "member3.tech_be@fatakpay.com",
      "first_name": "Member3",
      "last_name": "TECH_BE",
      "full_name": "Member3 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T07:49:29.250Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-2999",
      "claim_number": "CLM-2888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 3,
    "ticket_number": "TKT-0003",
    "ticket_type": "internal",
    "subject": "Sample Ticket 3 for Technology — Frontend",
    "description": "This is a sample description for ticket 3. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T03:35:52.019Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 4,
    "ticket_number": "TKT-0004",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 4 for Operations",
    "description": "This is a sample description for ticket 4. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 52,
      "email": "member5.ops@fatakpay.com",
      "first_name": "Member5",
      "last_name": "OPS",
      "full_name": "Member5 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T12:38:09.923Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-4999",
      "claim_number": "CLM-4888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 5,
    "ticket_number": "TKT-0005",
    "ticket_type": "internal",
    "subject": "Sample Ticket 5 for Compliance",
    "description": "This is a sample description for ticket 5. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 63,
      "email": "member6.comp@fatakpay.com",
      "first_name": "Member6",
      "last_name": "COMP",
      "full_name": "Member6 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T20:15:15.289Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 6,
    "ticket_number": "TKT-0006",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 6 for Insurance Operations",
    "description": "This is a sample description for ticket 6. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-16T16:23:33.014Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-6999",
      "claim_number": "CLM-6888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 7,
    "ticket_number": "TKT-0007",
    "ticket_type": "internal",
    "subject": "Sample Ticket 7 for Loan Operations",
    "description": "This is a sample description for ticket 7. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 25,
      "email": "member8.loan_ops@fatakpay.com",
      "first_name": "Member8",
      "last_name": "LOAN_OPS",
      "full_name": "Member8 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T12:52:15.886Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 8,
    "ticket_number": "TKT-0008",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 8 for Technology — Backend",
    "description": "This is a sample description for ticket 8. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 36,
      "email": "member9.tech_be@fatakpay.com",
      "first_name": "Member9",
      "last_name": "TECH_BE",
      "full_name": "Member9 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T18:35:40.968Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-8999",
      "claim_number": "CLM-8888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 9,
    "ticket_number": "TKT-0009",
    "ticket_type": "internal",
    "subject": "Sample Ticket 9 for Technology — Frontend",
    "description": "This is a sample description for ticket 9. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-23T15:48:05.919Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 10,
    "ticket_number": "TKT-0010",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 10 for Operations",
    "description": "This is a sample description for ticket 10. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 48,
      "email": "member1.ops@fatakpay.com",
      "first_name": "Member1",
      "last_name": "OPS",
      "full_name": "Member1 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-25T07:50:38.167Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-10999",
      "claim_number": "CLM-10888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 11,
    "ticket_number": "TKT-0011",
    "ticket_type": "internal",
    "subject": "Sample Ticket 11 for Compliance",
    "description": "This is a sample description for ticket 11. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 59,
      "email": "member2.comp@fatakpay.com",
      "first_name": "Member2",
      "last_name": "COMP",
      "full_name": "Member2 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T12:23:01.021Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 12,
    "ticket_number": "TKT-0012",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 12 for Insurance Operations",
    "description": "This is a sample description for ticket 12. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T11:22:19.034Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-12999",
      "claim_number": "CLM-12888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 13,
    "ticket_number": "TKT-0013",
    "ticket_type": "internal",
    "subject": "Sample Ticket 13 for Loan Operations",
    "description": "This is a sample description for ticket 13. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 21,
      "email": "member4.loan_ops@fatakpay.com",
      "first_name": "Member4",
      "last_name": "LOAN_OPS",
      "full_name": "Member4 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T09:39:15.267Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 14,
    "ticket_number": "TKT-0014",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 14 for Technology — Backend",
    "description": "This is a sample description for ticket 14. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 32,
      "email": "member5.tech_be@fatakpay.com",
      "first_name": "Member5",
      "last_name": "TECH_BE",
      "full_name": "Member5 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T10:34:26.666Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-14999",
      "claim_number": "CLM-14888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 15,
    "ticket_number": "TKT-0015",
    "ticket_type": "internal",
    "subject": "Sample Ticket 15 for Technology — Frontend",
    "description": "This is a sample description for ticket 15. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T11:14:31.271Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 16,
    "ticket_number": "TKT-0016",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 16 for Operations",
    "description": "This is a sample description for ticket 16. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 54,
      "email": "member7.ops@fatakpay.com",
      "first_name": "Member7",
      "last_name": "OPS",
      "full_name": "Member7 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-16T20:40:38.942Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-16999",
      "claim_number": "CLM-16888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 17,
    "ticket_number": "TKT-0017",
    "ticket_type": "internal",
    "subject": "Sample Ticket 17 for Compliance",
    "description": "This is a sample description for ticket 17. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 65,
      "email": "member8.comp@fatakpay.com",
      "first_name": "Member8",
      "last_name": "COMP",
      "full_name": "Member8 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T03:49:44.218Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 18,
    "ticket_number": "TKT-0018",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 18 for Insurance Operations",
    "description": "This is a sample description for ticket 18. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T02:19:26.311Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-18999",
      "claim_number": "CLM-18888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 19,
    "ticket_number": "TKT-0019",
    "ticket_type": "internal",
    "subject": "Sample Ticket 19 for Loan Operations",
    "description": "This is a sample description for ticket 19. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 27,
      "email": "member10.loan_ops@fatakpay.com",
      "first_name": "Member10",
      "last_name": "LOAN_OPS",
      "full_name": "Member10 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-24T20:50:30.719Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 20,
    "ticket_number": "TKT-0020",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 20 for Technology — Backend",
    "description": "This is a sample description for ticket 20. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 28,
      "email": "member1.tech_be@fatakpay.com",
      "first_name": "Member1",
      "last_name": "TECH_BE",
      "full_name": "Member1 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-20T18:28:32.568Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-20999",
      "claim_number": "CLM-20888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 21,
    "ticket_number": "TKT-0021",
    "ticket_type": "internal",
    "subject": "Sample Ticket 21 for Technology — Frontend",
    "description": "This is a sample description for ticket 21. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T09:40:38.466Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 22,
    "ticket_number": "TKT-0022",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 22 for Operations",
    "description": "This is a sample description for ticket 22. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 50,
      "email": "member3.ops@fatakpay.com",
      "first_name": "Member3",
      "last_name": "OPS",
      "full_name": "Member3 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T06:18:49.322Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-22999",
      "claim_number": "CLM-22888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 23,
    "ticket_number": "TKT-0023",
    "ticket_type": "internal",
    "subject": "Sample Ticket 23 for Compliance",
    "description": "This is a sample description for ticket 23. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 61,
      "email": "member4.comp@fatakpay.com",
      "first_name": "Member4",
      "last_name": "COMP",
      "full_name": "Member4 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T06:04:41.639Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 24,
    "ticket_number": "TKT-0024",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 24 for Insurance Operations",
    "description": "This is a sample description for ticket 24. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T12:00:59.074Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-24999",
      "claim_number": "CLM-24888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 25,
    "ticket_number": "TKT-0025",
    "ticket_type": "internal",
    "subject": "Sample Ticket 25 for Loan Operations",
    "description": "This is a sample description for ticket 25. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 23,
      "email": "member6.loan_ops@fatakpay.com",
      "first_name": "Member6",
      "last_name": "LOAN_OPS",
      "full_name": "Member6 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T11:58:15.773Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 26,
    "ticket_number": "TKT-0026",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 26 for Technology — Backend",
    "description": "This is a sample description for ticket 26. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 34,
      "email": "member7.tech_be@fatakpay.com",
      "first_name": "Member7",
      "last_name": "TECH_BE",
      "full_name": "Member7 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T18:46:08.459Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-26999",
      "claim_number": "CLM-26888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 27,
    "ticket_number": "TKT-0027",
    "ticket_type": "internal",
    "subject": "Sample Ticket 27 for Technology — Frontend",
    "description": "This is a sample description for ticket 27. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T04:51:11.848Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 28,
    "ticket_number": "TKT-0028",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 28 for Operations",
    "description": "This is a sample description for ticket 28. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 56,
      "email": "member9.ops@fatakpay.com",
      "first_name": "Member9",
      "last_name": "OPS",
      "full_name": "Member9 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T20:15:34.665Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-28999",
      "claim_number": "CLM-28888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 29,
    "ticket_number": "TKT-0029",
    "ticket_type": "internal",
    "subject": "Sample Ticket 29 for Compliance",
    "description": "This is a sample description for ticket 29. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 67,
      "email": "member10.comp@fatakpay.com",
      "first_name": "Member10",
      "last_name": "COMP",
      "full_name": "Member10 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T21:18:56.287Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 30,
    "ticket_number": "TKT-0030",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 30 for Insurance Operations",
    "description": "This is a sample description for ticket 30. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-17T15:10:45.410Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-30999",
      "claim_number": "CLM-30888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 31,
    "ticket_number": "TKT-0031",
    "ticket_type": "internal",
    "subject": "Sample Ticket 31 for Loan Operations",
    "description": "This is a sample description for ticket 31. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 19,
      "email": "member2.loan_ops@fatakpay.com",
      "first_name": "Member2",
      "last_name": "LOAN_OPS",
      "full_name": "Member2 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T18:16:57.959Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 32,
    "ticket_number": "TKT-0032",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 32 for Technology — Backend",
    "description": "This is a sample description for ticket 32. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 30,
      "email": "member3.tech_be@fatakpay.com",
      "first_name": "Member3",
      "last_name": "TECH_BE",
      "full_name": "Member3 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-23T07:24:33.454Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-32999",
      "claim_number": "CLM-32888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 33,
    "ticket_number": "TKT-0033",
    "ticket_type": "internal",
    "subject": "Sample Ticket 33 for Technology — Frontend",
    "description": "This is a sample description for ticket 33. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T17:58:32.892Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 34,
    "ticket_number": "TKT-0034",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 34 for Operations",
    "description": "This is a sample description for ticket 34. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 52,
      "email": "member5.ops@fatakpay.com",
      "first_name": "Member5",
      "last_name": "OPS",
      "full_name": "Member5 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T15:50:08.706Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-34999",
      "claim_number": "CLM-34888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 35,
    "ticket_number": "TKT-0035",
    "ticket_type": "internal",
    "subject": "Sample Ticket 35 for Compliance",
    "description": "This is a sample description for ticket 35. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 63,
      "email": "member6.comp@fatakpay.com",
      "first_name": "Member6",
      "last_name": "COMP",
      "full_name": "Member6 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T00:58:56.564Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 36,
    "ticket_number": "TKT-0036",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 36 for Insurance Operations",
    "description": "This is a sample description for ticket 36. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T09:20:22.987Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-36999",
      "claim_number": "CLM-36888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 37,
    "ticket_number": "TKT-0037",
    "ticket_type": "internal",
    "subject": "Sample Ticket 37 for Loan Operations",
    "description": "This is a sample description for ticket 37. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 25,
      "email": "member8.loan_ops@fatakpay.com",
      "first_name": "Member8",
      "last_name": "LOAN_OPS",
      "full_name": "Member8 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-16T10:04:56.115Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 38,
    "ticket_number": "TKT-0038",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 38 for Technology — Backend",
    "description": "This is a sample description for ticket 38. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 36,
      "email": "member9.tech_be@fatakpay.com",
      "first_name": "Member9",
      "last_name": "TECH_BE",
      "full_name": "Member9 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T07:04:58.707Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-38999",
      "claim_number": "CLM-38888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 39,
    "ticket_number": "TKT-0039",
    "ticket_type": "internal",
    "subject": "Sample Ticket 39 for Technology — Frontend",
    "description": "This is a sample description for ticket 39. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-23T23:55:53.438Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 40,
    "ticket_number": "TKT-0040",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 40 for Operations",
    "description": "This is a sample description for ticket 40. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 48,
      "email": "member1.ops@fatakpay.com",
      "first_name": "Member1",
      "last_name": "OPS",
      "full_name": "Member1 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-23T16:22:38.223Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-40999",
      "claim_number": "CLM-40888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 41,
    "ticket_number": "TKT-0041",
    "ticket_type": "internal",
    "subject": "Sample Ticket 41 for Compliance",
    "description": "This is a sample description for ticket 41. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 59,
      "email": "member2.comp@fatakpay.com",
      "first_name": "Member2",
      "last_name": "COMP",
      "full_name": "Member2 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T01:45:09.662Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 42,
    "ticket_number": "TKT-0042",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 42 for Insurance Operations",
    "description": "This is a sample description for ticket 42. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T22:29:45.093Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-42999",
      "claim_number": "CLM-42888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 43,
    "ticket_number": "TKT-0043",
    "ticket_type": "internal",
    "subject": "Sample Ticket 43 for Loan Operations",
    "description": "This is a sample description for ticket 43. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 21,
      "email": "member4.loan_ops@fatakpay.com",
      "first_name": "Member4",
      "last_name": "LOAN_OPS",
      "full_name": "Member4 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T17:04:25.000Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 44,
    "ticket_number": "TKT-0044",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 44 for Technology — Backend",
    "description": "This is a sample description for ticket 44. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 32,
      "email": "member5.tech_be@fatakpay.com",
      "first_name": "Member5",
      "last_name": "TECH_BE",
      "full_name": "Member5 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T17:16:21.205Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-44999",
      "claim_number": "CLM-44888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 45,
    "ticket_number": "TKT-0045",
    "ticket_type": "internal",
    "subject": "Sample Ticket 45 for Technology — Frontend",
    "description": "This is a sample description for ticket 45. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T22:33:20.037Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 46,
    "ticket_number": "TKT-0046",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 46 for Operations",
    "description": "This is a sample description for ticket 46. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 54,
      "email": "member7.ops@fatakpay.com",
      "first_name": "Member7",
      "last_name": "OPS",
      "full_name": "Member7 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T07:55:09.050Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-46999",
      "claim_number": "CLM-46888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 47,
    "ticket_number": "TKT-0047",
    "ticket_type": "internal",
    "subject": "Sample Ticket 47 for Compliance",
    "description": "This is a sample description for ticket 47. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 65,
      "email": "member8.comp@fatakpay.com",
      "first_name": "Member8",
      "last_name": "COMP",
      "full_name": "Member8 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T01:50:31.837Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 48,
    "ticket_number": "TKT-0048",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 48 for Insurance Operations",
    "description": "This is a sample description for ticket 48. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T15:20:23.017Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-48999",
      "claim_number": "CLM-48888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 49,
    "ticket_number": "TKT-0049",
    "ticket_type": "internal",
    "subject": "Sample Ticket 49 for Loan Operations",
    "description": "This is a sample description for ticket 49. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 27,
      "email": "member10.loan_ops@fatakpay.com",
      "first_name": "Member10",
      "last_name": "LOAN_OPS",
      "full_name": "Member10 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T09:14:00.232Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 50,
    "ticket_number": "TKT-0050",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 50 for Technology — Backend",
    "description": "This is a sample description for ticket 50. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 28,
      "email": "member1.tech_be@fatakpay.com",
      "first_name": "Member1",
      "last_name": "TECH_BE",
      "full_name": "Member1 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-18T13:07:37.930Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-50999",
      "claim_number": "CLM-50888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 51,
    "ticket_number": "TKT-0051",
    "ticket_type": "internal",
    "subject": "Sample Ticket 51 for Technology — Frontend",
    "description": "This is a sample description for ticket 51. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T23:19:50.426Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 52,
    "ticket_number": "TKT-0052",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 52 for Operations",
    "description": "This is a sample description for ticket 52. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 50,
      "email": "member3.ops@fatakpay.com",
      "first_name": "Member3",
      "last_name": "OPS",
      "full_name": "Member3 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-16T20:27:15.167Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-52999",
      "claim_number": "CLM-52888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 53,
    "ticket_number": "TKT-0053",
    "ticket_type": "internal",
    "subject": "Sample Ticket 53 for Compliance",
    "description": "This is a sample description for ticket 53. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 61,
      "email": "member4.comp@fatakpay.com",
      "first_name": "Member4",
      "last_name": "COMP",
      "full_name": "Member4 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T15:59:06.138Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 54,
    "ticket_number": "TKT-0054",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 54 for Insurance Operations",
    "description": "This is a sample description for ticket 54. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T13:07:34.020Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-54999",
      "claim_number": "CLM-54888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 55,
    "ticket_number": "TKT-0055",
    "ticket_type": "internal",
    "subject": "Sample Ticket 55 for Loan Operations",
    "description": "This is a sample description for ticket 55. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 23,
      "email": "member6.loan_ops@fatakpay.com",
      "first_name": "Member6",
      "last_name": "LOAN_OPS",
      "full_name": "Member6 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T22:29:59.654Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 56,
    "ticket_number": "TKT-0056",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 56 for Technology — Backend",
    "description": "This is a sample description for ticket 56. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 34,
      "email": "member7.tech_be@fatakpay.com",
      "first_name": "Member7",
      "last_name": "TECH_BE",
      "full_name": "Member7 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T16:27:02.736Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-56999",
      "claim_number": "CLM-56888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 57,
    "ticket_number": "TKT-0057",
    "ticket_type": "internal",
    "subject": "Sample Ticket 57 for Technology — Frontend",
    "description": "This is a sample description for ticket 57. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-23T08:23:54.646Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 58,
    "ticket_number": "TKT-0058",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 58 for Operations",
    "description": "This is a sample description for ticket 58. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 56,
      "email": "member9.ops@fatakpay.com",
      "first_name": "Member9",
      "last_name": "OPS",
      "full_name": "Member9 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T01:44:04.674Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-58999",
      "claim_number": "CLM-58888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 59,
    "ticket_number": "TKT-0059",
    "ticket_type": "internal",
    "subject": "Sample Ticket 59 for Compliance",
    "description": "This is a sample description for ticket 59. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 67,
      "email": "member10.comp@fatakpay.com",
      "first_name": "Member10",
      "last_name": "COMP",
      "full_name": "Member10 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T16:57:30.946Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 60,
    "ticket_number": "TKT-0060",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 60 for Insurance Operations",
    "description": "This is a sample description for ticket 60. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-16T15:47:54.329Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-60999",
      "claim_number": "CLM-60888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 61,
    "ticket_number": "TKT-0061",
    "ticket_type": "internal",
    "subject": "Sample Ticket 61 for Loan Operations",
    "description": "This is a sample description for ticket 61. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 19,
      "email": "member2.loan_ops@fatakpay.com",
      "first_name": "Member2",
      "last_name": "LOAN_OPS",
      "full_name": "Member2 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T17:54:29.544Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 62,
    "ticket_number": "TKT-0062",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 62 for Technology — Backend",
    "description": "This is a sample description for ticket 62. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 30,
      "email": "member3.tech_be@fatakpay.com",
      "first_name": "Member3",
      "last_name": "TECH_BE",
      "full_name": "Member3 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-24T11:31:46.954Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-62999",
      "claim_number": "CLM-62888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 63,
    "ticket_number": "TKT-0063",
    "ticket_type": "internal",
    "subject": "Sample Ticket 63 for Technology — Frontend",
    "description": "This is a sample description for ticket 63. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T09:45:06.198Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 64,
    "ticket_number": "TKT-0064",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 64 for Operations",
    "description": "This is a sample description for ticket 64. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 52,
      "email": "member5.ops@fatakpay.com",
      "first_name": "Member5",
      "last_name": "OPS",
      "full_name": "Member5 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T23:06:25.194Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-64999",
      "claim_number": "CLM-64888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 65,
    "ticket_number": "TKT-0065",
    "ticket_type": "internal",
    "subject": "Sample Ticket 65 for Compliance",
    "description": "This is a sample description for ticket 65. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 63,
      "email": "member6.comp@fatakpay.com",
      "first_name": "Member6",
      "last_name": "COMP",
      "full_name": "Member6 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T20:27:12.352Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 66,
    "ticket_number": "TKT-0066",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 66 for Insurance Operations",
    "description": "This is a sample description for ticket 66. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T16:25:45.344Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-66999",
      "claim_number": "CLM-66888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 67,
    "ticket_number": "TKT-0067",
    "ticket_type": "internal",
    "subject": "Sample Ticket 67 for Loan Operations",
    "description": "This is a sample description for ticket 67. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 25,
      "email": "member8.loan_ops@fatakpay.com",
      "first_name": "Member8",
      "last_name": "LOAN_OPS",
      "full_name": "Member8 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-26T00:15:38.660Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 68,
    "ticket_number": "TKT-0068",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 68 for Technology — Backend",
    "description": "This is a sample description for ticket 68. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 36,
      "email": "member9.tech_be@fatakpay.com",
      "first_name": "Member9",
      "last_name": "TECH_BE",
      "full_name": "Member9 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T06:18:57.408Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-68999",
      "claim_number": "CLM-68888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 69,
    "ticket_number": "TKT-0069",
    "ticket_type": "internal",
    "subject": "Sample Ticket 69 for Technology — Frontend",
    "description": "This is a sample description for ticket 69. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-25T20:41:15.014Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 70,
    "ticket_number": "TKT-0070",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 70 for Operations",
    "description": "This is a sample description for ticket 70. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 48,
      "email": "member1.ops@fatakpay.com",
      "first_name": "Member1",
      "last_name": "OPS",
      "full_name": "Member1 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-16T19:04:57.243Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-70999",
      "claim_number": "CLM-70888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 71,
    "ticket_number": "TKT-0071",
    "ticket_type": "internal",
    "subject": "Sample Ticket 71 for Compliance",
    "description": "This is a sample description for ticket 71. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 59,
      "email": "member2.comp@fatakpay.com",
      "first_name": "Member2",
      "last_name": "COMP",
      "full_name": "Member2 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-23T03:51:46.184Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 72,
    "ticket_number": "TKT-0072",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 72 for Insurance Operations",
    "description": "This is a sample description for ticket 72. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T15:36:53.740Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-72999",
      "claim_number": "CLM-72888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 73,
    "ticket_number": "TKT-0073",
    "ticket_type": "internal",
    "subject": "Sample Ticket 73 for Loan Operations",
    "description": "This is a sample description for ticket 73. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 21,
      "email": "member4.loan_ops@fatakpay.com",
      "first_name": "Member4",
      "last_name": "LOAN_OPS",
      "full_name": "Member4 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T22:16:53.532Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 74,
    "ticket_number": "TKT-0074",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 74 for Technology — Backend",
    "description": "This is a sample description for ticket 74. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 32,
      "email": "member5.tech_be@fatakpay.com",
      "first_name": "Member5",
      "last_name": "TECH_BE",
      "full_name": "Member5 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T13:11:44.157Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-74999",
      "claim_number": "CLM-74888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 75,
    "ticket_number": "TKT-0075",
    "ticket_type": "internal",
    "subject": "Sample Ticket 75 for Technology — Frontend",
    "description": "This is a sample description for ticket 75. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-24T09:12:13.933Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 76,
    "ticket_number": "TKT-0076",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 76 for Operations",
    "description": "This is a sample description for ticket 76. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 54,
      "email": "member7.ops@fatakpay.com",
      "first_name": "Member7",
      "last_name": "OPS",
      "full_name": "Member7 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T04:43:11.576Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-76999",
      "claim_number": "CLM-76888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 77,
    "ticket_number": "TKT-0077",
    "ticket_type": "internal",
    "subject": "Sample Ticket 77 for Compliance",
    "description": "This is a sample description for ticket 77. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 65,
      "email": "member8.comp@fatakpay.com",
      "first_name": "Member8",
      "last_name": "COMP",
      "full_name": "Member8 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T18:04:26.157Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 78,
    "ticket_number": "TKT-0078",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 78 for Insurance Operations",
    "description": "This is a sample description for ticket 78. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T05:10:41.725Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-78999",
      "claim_number": "CLM-78888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 79,
    "ticket_number": "TKT-0079",
    "ticket_type": "internal",
    "subject": "Sample Ticket 79 for Loan Operations",
    "description": "This is a sample description for ticket 79. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 27,
      "email": "member10.loan_ops@fatakpay.com",
      "first_name": "Member10",
      "last_name": "LOAN_OPS",
      "full_name": "Member10 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T12:07:50.019Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 80,
    "ticket_number": "TKT-0080",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 80 for Technology — Backend",
    "description": "This is a sample description for ticket 80. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 28,
      "email": "member1.tech_be@fatakpay.com",
      "first_name": "Member1",
      "last_name": "TECH_BE",
      "full_name": "Member1 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-20T11:19:26.385Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-80999",
      "claim_number": "CLM-80888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 81,
    "ticket_number": "TKT-0081",
    "ticket_type": "internal",
    "subject": "Sample Ticket 81 for Technology — Frontend",
    "description": "This is a sample description for ticket 81. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T04:21:56.444Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 82,
    "ticket_number": "TKT-0082",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 82 for Operations",
    "description": "This is a sample description for ticket 82. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 50,
      "email": "member3.ops@fatakpay.com",
      "first_name": "Member3",
      "last_name": "OPS",
      "full_name": "Member3 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T06:22:01.582Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-82999",
      "claim_number": "CLM-82888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 83,
    "ticket_number": "TKT-0083",
    "ticket_type": "internal",
    "subject": "Sample Ticket 83 for Compliance",
    "description": "This is a sample description for ticket 83. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 61,
      "email": "member4.comp@fatakpay.com",
      "first_name": "Member4",
      "last_name": "COMP",
      "full_name": "Member4 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T18:51:34.373Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 84,
    "ticket_number": "TKT-0084",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 84 for Insurance Operations",
    "description": "This is a sample description for ticket 84. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-26T04:43:14.649Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-84999",
      "claim_number": "CLM-84888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 85,
    "ticket_number": "TKT-0085",
    "ticket_type": "internal",
    "subject": "Sample Ticket 85 for Loan Operations",
    "description": "This is a sample description for ticket 85. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 23,
      "email": "member6.loan_ops@fatakpay.com",
      "first_name": "Member6",
      "last_name": "LOAN_OPS",
      "full_name": "Member6 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-23T22:04:44.676Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 86,
    "ticket_number": "TKT-0086",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 86 for Technology — Backend",
    "description": "This is a sample description for ticket 86. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 34,
      "email": "member7.tech_be@fatakpay.com",
      "first_name": "Member7",
      "last_name": "TECH_BE",
      "full_name": "Member7 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-24T11:49:35.537Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-86999",
      "claim_number": "CLM-86888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 87,
    "ticket_number": "TKT-0087",
    "ticket_type": "internal",
    "subject": "Sample Ticket 87 for Technology — Frontend",
    "description": "This is a sample description for ticket 87. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T10:00:31.430Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 88,
    "ticket_number": "TKT-0088",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 88 for Operations",
    "description": "This is a sample description for ticket 88. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 56,
      "email": "member9.ops@fatakpay.com",
      "first_name": "Member9",
      "last_name": "OPS",
      "full_name": "Member9 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T20:11:42.314Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-88999",
      "claim_number": "CLM-88888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 89,
    "ticket_number": "TKT-0089",
    "ticket_type": "internal",
    "subject": "Sample Ticket 89 for Compliance",
    "description": "This is a sample description for ticket 89. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 67,
      "email": "member10.comp@fatakpay.com",
      "first_name": "Member10",
      "last_name": "COMP",
      "full_name": "Member10 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T04:30:48.268Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 90,
    "ticket_number": "TKT-0090",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 90 for Insurance Operations",
    "description": "This is a sample description for ticket 90. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-18T17:53:30.096Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-90999",
      "claim_number": "CLM-90888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 91,
    "ticket_number": "TKT-0091",
    "ticket_type": "internal",
    "subject": "Sample Ticket 91 for Loan Operations",
    "description": "This is a sample description for ticket 91. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 19,
      "email": "member2.loan_ops@fatakpay.com",
      "first_name": "Member2",
      "last_name": "LOAN_OPS",
      "full_name": "Member2 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T09:41:35.443Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 92,
    "ticket_number": "TKT-0092",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 92 for Technology — Backend",
    "description": "This is a sample description for ticket 92. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 30,
      "email": "member3.tech_be@fatakpay.com",
      "first_name": "Member3",
      "last_name": "TECH_BE",
      "full_name": "Member3 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-17T13:40:14.727Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-92999",
      "claim_number": "CLM-92888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 93,
    "ticket_number": "TKT-0093",
    "ticket_type": "internal",
    "subject": "Sample Ticket 93 for Technology — Frontend",
    "description": "This is a sample description for ticket 93. Needs attention.",
    "status": "escalated",
    "priority": "high",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T05:25:34.681Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 94,
    "ticket_number": "TKT-0094",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 94 for Operations",
    "description": "This is a sample description for ticket 94. Needs attention.",
    "status": "on_hold",
    "priority": "medium",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 52,
      "email": "member5.ops@fatakpay.com",
      "first_name": "Member5",
      "last_name": "OPS",
      "full_name": "Member5 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-20T00:56:56.189Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-94999",
      "claim_number": "CLM-94888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 95,
    "ticket_number": "TKT-0095",
    "ticket_type": "internal",
    "subject": "Sample Ticket 95 for Compliance",
    "description": "This is a sample description for ticket 95. Needs attention.",
    "status": "review",
    "priority": "low",
    "department": {
      "id": 6,
      "code": "COMP",
      "name": "Compliance",
      "sla_critical_hours": 8,
      "sla_high_hours": 48
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 63,
      "email": "member6.comp@fatakpay.com",
      "first_name": "Member6",
      "last_name": "COMP",
      "full_name": "Member6 COMP",
      "role": "MEMBER",
      "department": {
        "id": 6,
        "code": "COMP",
        "name": "Compliance",
        "sla_critical_hours": 8,
        "sla_high_hours": 48
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "comp"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T22:55:50.711Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Compliance",
      "business_impact": "Low"
    }
  },
  {
    "id": 96,
    "ticket_number": "TKT-0096",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 96 for Insurance Operations",
    "description": "This is a sample description for ticket 96. Needs attention.",
    "status": "open",
    "priority": "critical",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ins_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-19T04:58:07.770Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 1,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-96999",
      "claim_number": "CLM-96888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 97,
    "ticket_number": "TKT-0097",
    "ticket_type": "internal",
    "subject": "Sample Ticket 97 for Loan Operations",
    "description": "This is a sample description for ticket 97. Needs attention.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 25,
      "email": "member8.loan_ops@fatakpay.com",
      "first_name": "Member8",
      "last_name": "LOAN_OPS",
      "full_name": "Member8 LOAN_OPS",
      "role": "MEMBER",
      "department": {
        "id": 2,
        "code": "LOAN_OPS",
        "name": "Loan Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "loan_ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-21T21:30:19.056Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 2,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Loan Operations",
      "business_impact": "Low"
    }
  },
  {
    "id": 98,
    "ticket_number": "TKT-0098",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 98 for Technology — Backend",
    "description": "This is a sample description for ticket 98. Needs attention.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 3,
      "code": "TECH_BE",
      "name": "Technology — Backend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 36,
      "email": "member9.tech_be@fatakpay.com",
      "first_name": "Member9",
      "last_name": "TECH_BE",
      "full_name": "Member9 TECH_BE",
      "role": "MEMBER",
      "department": {
        "id": 3,
        "code": "TECH_BE",
        "name": "Technology — Backend",
        "sla_critical_hours": 2,
        "sla_high_hours": 8
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_be"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-22T15:22:07.694Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 3,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-98999",
      "claim_number": "CLM-98888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 99,
    "ticket_number": "TKT-0099",
    "ticket_type": "internal",
    "subject": "Sample Ticket 99 for Technology — Frontend",
    "description": "This is a sample description for ticket 99. Needs attention.",
    "status": "resolved",
    "priority": "low",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "tech_fe"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": false,
    "created_at": "2026-06-18T10:31:12.692Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 4,
    "attachment_count": 1,
    "internal_fields": {
      "affected_system": "Technology — Frontend",
      "business_impact": "Low"
    }
  },
  {
    "id": 100,
    "ticket_number": "TKT-0100",
    "ticket_type": "insurance",
    "subject": "Sample Ticket 100 for Operations",
    "description": "This is a sample description for ticket 100. Needs attention.",
    "status": "closed",
    "priority": "critical",
    "department": {
      "id": 5,
      "code": "OPS",
      "name": "Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 1,
      "email": "admin@fatakpay.com",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "role": "SUPER_ADMIN",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 48,
      "email": "member1.ops@fatakpay.com",
      "first_name": "Member1",
      "last_name": "OPS",
      "full_name": "Member1 OPS",
      "role": "MEMBER",
      "department": {
        "id": 5,
        "code": "OPS",
        "name": "Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "sample",
      "ops"
    ],
    "sla_deadline": "2026-06-27T06:03:33.179Z",
    "sla_breached": true,
    "created_at": "2026-06-20T12:08:23.894Z",
    "updated_at": "2026-06-26T06:03:33.179Z",
    "comment_count": 0,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-100999",
      "claim_number": "CLM-100888",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "contact@fatakpay.com"
    }
  },
  {
    "id": 101,
    "ticket_number": "TKT-0101",
    "ticket_type": "insurance",
    "subject": "Insurance claim processing delay - Policy POL-12345",
    "description": "Customer is experiencing delays with insurance claim processing for policy POL-12345. The claim was submitted 2 weeks ago but no progress has been made. Customer is asking for status update and resolution timeline.",
    "status": "open",
    "priority": "high",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 68,
      "email": "agent1@fatakpay.com",
      "first_name": "Agent1",
      "last_name": "Caller",
      "full_name": "Agent1 Caller",
      "role": "CALLER",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 8,
      "email": "member1.ins_ops@fatakpay.com",
      "first_name": "Member1",
      "last_name": "INS_OPS",
      "full_name": "Member1 INS_OPS",
      "role": "MEMBER",
      "department": {
        "id": 1,
        "code": "INS_OPS",
        "name": "Insurance Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "insurance",
      "claim",
      "delay"
    ],
    "sla_deadline": "2026-12-27T12:00:00.000Z",
    "sla_breached": false,
    "created_at": "2026-12-26T08:15:30.000Z",
    "updated_at": "2026-12-26T08:15:30.000Z",
    "comment_count": 0,
    "attachment_count": 1,
    "insurance_fields": {
      "policy_number": "POL-12345",
      "claim_number": "CLM-67890",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "claims@fatakpay.com"
    }
  },
  {
    "id": 102,
    "ticket_number": "TKT-0102",
    "ticket_type": "insurance",
    "subject": "Policy renewal issue - Customer unable to pay premium",
    "description": "Customer is facing payment gateway issues while trying to renew their insurance policy. Payment keeps failing with error code 500. Customer tried multiple payment methods but none are working.",
    "status": "in_progress",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 68,
      "email": "agent1@fatakpay.com",
      "first_name": "Agent1",
      "last_name": "Caller",
      "full_name": "Agent1 Caller",
      "role": "CALLER",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 9,
      "email": "member2.ins_ops@fatakpay.com",
      "first_name": "Member2",
      "last_name": "INS_OPS",
      "full_name": "Member2 INS_OPS",
      "role": "MEMBER",
      "department": {
        "id": 1,
        "code": "INS_OPS",
        "name": "Insurance Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "insurance",
      "payment",
      "renewal"
    ],
    "sla_deadline": "2026-12-27T06:00:00.000Z",
    "sla_breached": false,
    "created_at": "2026-12-25T18:30:00.000Z",
    "updated_at": "2026-12-26T09:45:00.000Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-54321",
      "claim_number": "",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "support@fatakpay.com"
    }
  },
  {
    "id": 103,
    "ticket_number": "TKT-0103",
    "ticket_type": "insurance",
    "subject": "Claim rejection appeal - Need review for denied claim",
    "description": "Customer's claim was rejected but they believe it should be covered under their policy. They have provided additional documentation and are requesting a review of the rejection decision. Policy covers the claimed incident.",
    "status": "assigned",
    "priority": "high",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 68,
      "email": "agent1@fatakpay.com",
      "first_name": "Agent1",
      "last_name": "Caller",
      "full_name": "Agent1 Caller",
      "role": "CALLER",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 10,
      "email": "member3.ins_ops@fatakpay.com",
      "first_name": "Member3",
      "last_name": "INS_OPS",
      "full_name": "Member3 INS_OPS",
      "role": "MEMBER",
      "department": {
        "id": 1,
        "code": "INS_OPS",
        "name": "Insurance Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "insurance",
      "claim",
      "rejection",
      "appeal"
    ],
    "sla_deadline": "2026-12-26T20:00:00.000Z",
    "sla_breached": true,
    "created_at": "2026-12-24T16:00:00.000Z",
    "updated_at": "2026-12-25T10:15:00.000Z",
    "comment_count": 3,
    "attachment_count": 2,
    "insurance_fields": {
      "policy_number": "POL-98765",
      "claim_number": "CLM-11223",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "appeals@fatakpay.com"
    }
  },
  {
    "id": 104,
    "ticket_number": "TKT-0104",
    "ticket_type": "insurance",
    "subject": "Customer complaint about premium increase",
    "description": "Customer is upset about unexpected premium increase on policy renewal. They want explanation for the 30% increase and are considering cancelling the policy. Need to provide justification and possibly offer retention options.",
    "status": "resolved",
    "priority": "medium",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 68,
      "email": "agent1@fatakpay.com",
      "first_name": "Agent1",
      "last_name": "Caller",
      "full_name": "Agent1 Caller",
      "role": "CALLER",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 11,
      "email": "member4.ins_ops@fatakpay.com",
      "first_name": "Member4",
      "last_name": "INS_OPS",
      "full_name": "Member4 INS_OPS",
      "role": "MEMBER",
      "department": {
        "id": 1,
        "code": "INS_OPS",
        "name": "Insurance Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "insurance",
      "premium",
      "complaint",
      "retention"
    ],
    "sla_deadline": "2026-12-25T14:00:00.000Z",
    "sla_breached": false,
    "created_at": "2026-12-23T10:00:00.000Z",
    "updated_at": "2026-12-24T15:30:00.000Z",
    "resolved_at": "2026-12-24T15:30:00.000Z",
    "comment_count": 4,
    "attachment_count": 1,
    "insurance_fields": {
      "policy_number": "POL-13579",
      "claim_number": "",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "retention@fatakpay.com"
    }
  },
  {
    "id": 105,
    "ticket_number": "TKT-0105",
    "ticket_type": "insurance",
    "subject": "Policy cancellation request - Customer moving abroad",
    "description": "Customer is relocating to Canada and needs to cancel their current policy. They want to know about the cancellation process, any penalties, and refund amount. Policy is 6 months into the annual term.",
    "status": "closed",
    "priority": "low",
    "department": {
      "id": 1,
      "code": "INS_OPS",
      "name": "Insurance Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "created_by": {
      "id": 68,
      "email": "agent1@fatakpay.com",
      "first_name": "Agent1",
      "last_name": "Caller",
      "full_name": "Agent1 Caller",
      "role": "CALLER",
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "assignee": {
      "id": 12,
      "email": "member5.ins_ops@fatakpay.com",
      "first_name": "Member5",
      "last_name": "INS_OPS",
      "full_name": "Member5 INS_OPS",
      "role": "MEMBER",
      "department": {
        "id": 1,
        "code": "INS_OPS",
        "name": "Insurance Operations",
        "sla_critical_hours": 4,
        "sla_high_hours": 24
      },
      "is_active": true,
      "date_joined": "2026-06-26T06:03:33.177Z"
    },
    "tags": [
      "insurance",
      "cancellation",
      "refund"
    ],
    "sla_deadline": "2026-12-22T18:00:00.000Z",
    "sla_breached": false,
    "created_at": "2026-12-21T14:20:00.000Z",
    "updated_at": "2026-12-22T16:45:00.000Z",
    "resolved_at": "2026-12-22T16:30:00.000Z",
    "closed_at": "2026-12-22T16:45:00.000Z",
    "comment_count": 2,
    "attachment_count": 0,
    "insurance_fields": {
      "policy_number": "POL-24680",
      "claim_number": "",
      "insurer_name": "FatakPay Insure",
      "insurer_contact": "cancellations@fatakpay.com"
    }
  }
];
