import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    "id": 1,
    "email": "admin@fatakpay.com",
    "first_name": "Super",
    "last_name": "Admin",
    "full_name": "Super Admin",
    "role": "SUPER_ADMIN",
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 2,
    "email": "head.ins_ops@fatakpay.com",
    "first_name": "Head",
    "last_name": "INS_OPS",
    "full_name": "Head INS_OPS",
    "role": "DEPT_HEAD",
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
  {
    "id": 3,
    "email": "head.loan_ops@fatakpay.com",
    "first_name": "Head",
    "last_name": "LOAN_OPS",
    "full_name": "Head LOAN_OPS",
    "role": "DEPT_HEAD",
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
  {
    "id": 4,
    "email": "head.tech_be@fatakpay.com",
    "first_name": "Head",
    "last_name": "TECH_BE",
    "full_name": "Head TECH_BE",
    "role": "DEPT_HEAD",
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
  {
    "id": 5,
    "email": "head.tech_fe@fatakpay.com",
    "first_name": "Head",
    "last_name": "TECH_FE",
    "full_name": "Head TECH_FE",
    "role": "DEPT_HEAD",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 6,
    "email": "head.ops@fatakpay.com",
    "first_name": "Head",
    "last_name": "OPS",
    "full_name": "Head OPS",
    "role": "DEPT_HEAD",
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
  {
    "id": 7,
    "email": "head.comp@fatakpay.com",
    "first_name": "Head",
    "last_name": "COMP",
    "full_name": "Head COMP",
    "role": "DEPT_HEAD",
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
    "id": 13,
    "email": "member6.ins_ops@fatakpay.com",
    "first_name": "Member6",
    "last_name": "INS_OPS",
    "full_name": "Member6 INS_OPS",
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
  {
    "id": 14,
    "email": "member7.ins_ops@fatakpay.com",
    "first_name": "Member7",
    "last_name": "INS_OPS",
    "full_name": "Member7 INS_OPS",
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
  {
    "id": 15,
    "email": "member8.ins_ops@fatakpay.com",
    "first_name": "Member8",
    "last_name": "INS_OPS",
    "full_name": "Member8 INS_OPS",
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
  {
    "id": 16,
    "email": "member9.ins_ops@fatakpay.com",
    "first_name": "Member9",
    "last_name": "INS_OPS",
    "full_name": "Member9 INS_OPS",
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
  {
    "id": 17,
    "email": "member10.ins_ops@fatakpay.com",
    "first_name": "Member10",
    "last_name": "INS_OPS",
    "full_name": "Member10 INS_OPS",
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
  {
    "id": 18,
    "email": "member1.loan_ops@fatakpay.com",
    "first_name": "Member1",
    "last_name": "LOAN_OPS",
    "full_name": "Member1 LOAN_OPS",
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
  {
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
  {
    "id": 20,
    "email": "member3.loan_ops@fatakpay.com",
    "first_name": "Member3",
    "last_name": "LOAN_OPS",
    "full_name": "Member3 LOAN_OPS",
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
  {
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
  {
    "id": 22,
    "email": "member5.loan_ops@fatakpay.com",
    "first_name": "Member5",
    "last_name": "LOAN_OPS",
    "full_name": "Member5 LOAN_OPS",
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
  {
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
  {
    "id": 24,
    "email": "member7.loan_ops@fatakpay.com",
    "first_name": "Member7",
    "last_name": "LOAN_OPS",
    "full_name": "Member7 LOAN_OPS",
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
  {
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
  {
    "id": 26,
    "email": "member9.loan_ops@fatakpay.com",
    "first_name": "Member9",
    "last_name": "LOAN_OPS",
    "full_name": "Member9 LOAN_OPS",
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
  {
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
  {
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
  {
    "id": 29,
    "email": "member2.tech_be@fatakpay.com",
    "first_name": "Member2",
    "last_name": "TECH_BE",
    "full_name": "Member2 TECH_BE",
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
  {
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
  {
    "id": 31,
    "email": "member4.tech_be@fatakpay.com",
    "first_name": "Member4",
    "last_name": "TECH_BE",
    "full_name": "Member4 TECH_BE",
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
  {
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
  {
    "id": 33,
    "email": "member6.tech_be@fatakpay.com",
    "first_name": "Member6",
    "last_name": "TECH_BE",
    "full_name": "Member6 TECH_BE",
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
  {
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
  {
    "id": 35,
    "email": "member8.tech_be@fatakpay.com",
    "first_name": "Member8",
    "last_name": "TECH_BE",
    "full_name": "Member8 TECH_BE",
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
  {
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
  {
    "id": 37,
    "email": "member10.tech_be@fatakpay.com",
    "first_name": "Member10",
    "last_name": "TECH_BE",
    "full_name": "Member10 TECH_BE",
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
  {
    "id": 38,
    "email": "member1.tech_fe@fatakpay.com",
    "first_name": "Member1",
    "last_name": "TECH_FE",
    "full_name": "Member1 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 39,
    "email": "member2.tech_fe@fatakpay.com",
    "first_name": "Member2",
    "last_name": "TECH_FE",
    "full_name": "Member2 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 40,
    "email": "member3.tech_fe@fatakpay.com",
    "first_name": "Member3",
    "last_name": "TECH_FE",
    "full_name": "Member3 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 41,
    "email": "member4.tech_fe@fatakpay.com",
    "first_name": "Member4",
    "last_name": "TECH_FE",
    "full_name": "Member4 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 42,
    "email": "member5.tech_fe@fatakpay.com",
    "first_name": "Member5",
    "last_name": "TECH_FE",
    "full_name": "Member5 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 43,
    "email": "member6.tech_fe@fatakpay.com",
    "first_name": "Member6",
    "last_name": "TECH_FE",
    "full_name": "Member6 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 44,
    "email": "member7.tech_fe@fatakpay.com",
    "first_name": "Member7",
    "last_name": "TECH_FE",
    "full_name": "Member7 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 45,
    "email": "member8.tech_fe@fatakpay.com",
    "first_name": "Member8",
    "last_name": "TECH_FE",
    "full_name": "Member8 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 46,
    "email": "member9.tech_fe@fatakpay.com",
    "first_name": "Member9",
    "last_name": "TECH_FE",
    "full_name": "Member9 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
    "id": 47,
    "email": "member10.tech_fe@fatakpay.com",
    "first_name": "Member10",
    "last_name": "TECH_FE",
    "full_name": "Member10 TECH_FE",
    "role": "MEMBER",
    "department": {
      "id": 4,
      "code": "TECH_FE",
      "name": "Technology — Frontend",
      "sla_critical_hours": 2,
      "sla_high_hours": 8
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  },
  {
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
  {
    "id": 49,
    "email": "member2.ops@fatakpay.com",
    "first_name": "Member2",
    "last_name": "OPS",
    "full_name": "Member2 OPS",
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
  {
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
  {
    "id": 51,
    "email": "member4.ops@fatakpay.com",
    "first_name": "Member4",
    "last_name": "OPS",
    "full_name": "Member4 OPS",
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
  {
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
  {
    "id": 53,
    "email": "member6.ops@fatakpay.com",
    "first_name": "Member6",
    "last_name": "OPS",
    "full_name": "Member6 OPS",
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
  {
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
  {
    "id": 55,
    "email": "member8.ops@fatakpay.com",
    "first_name": "Member8",
    "last_name": "OPS",
    "full_name": "Member8 OPS",
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
  {
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
  {
    "id": 57,
    "email": "member10.ops@fatakpay.com",
    "first_name": "Member10",
    "last_name": "OPS",
    "full_name": "Member10 OPS",
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
  {
    "id": 58,
    "email": "member1.comp@fatakpay.com",
    "first_name": "Member1",
    "last_name": "COMP",
    "full_name": "Member1 COMP",
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
  {
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
  {
    "id": 60,
    "email": "member3.comp@fatakpay.com",
    "first_name": "Member3",
    "last_name": "COMP",
    "full_name": "Member3 COMP",
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
  {
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
  {
    "id": 62,
    "email": "member5.comp@fatakpay.com",
    "first_name": "Member5",
    "last_name": "COMP",
    "full_name": "Member5 COMP",
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
  {
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
  {
    "id": 64,
    "email": "member7.comp@fatakpay.com",
    "first_name": "Member7",
    "last_name": "COMP",
    "full_name": "Member7 COMP",
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
  {
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
  {
    "id": 66,
    "email": "member9.comp@fatakpay.com",
    "first_name": "Member9",
    "last_name": "COMP",
    "full_name": "Member9 COMP",
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
  {
    "id": 68,
    "email": "agent1@fatakpay.com",
    "first_name": "Agent1",
    "last_name": "Caller",
    "full_name": "Agent1 Caller",
    "role": "CALLER",
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
  {
    "id": 69,
    "email": "agent2@fatakpay.com",
    "first_name": "Agent2",
    "last_name": "Caller",
    "full_name": "Agent2 Caller",
    "role": "CALLER",
    "department": {
      "id": 2,
      "code": "LOAN_OPS",
      "name": "Loan Operations",
      "sla_critical_hours": 4,
      "sla_high_hours": 24
    },
    "is_active": true,
    "date_joined": "2026-06-26T06:03:33.177Z"
  }
];
