import type { Department } from '@/types';
import { mockUsers } from './users';

export const mockDepartments: Department[] = [
  { id: 1, code: 'INS_OPS', name: 'Insurance Operations', sla_critical_hours: 4, sla_high_hours: 24, head: mockUsers.find(u => u.id === 2) },
  { id: 2, code: 'LOAN_OPS', name: 'Loan Operations', sla_critical_hours: 4, sla_high_hours: 24, head: mockUsers.find(u => u.id === 3) },
  { id: 3, code: 'TECH_BE', name: 'Technology — Backend', sla_critical_hours: 2, sla_high_hours: 8, head: mockUsers.find(u => u.id === 4) },
  { id: 4, code: 'TECH_FE', name: 'Technology — Frontend', sla_critical_hours: 2, sla_high_hours: 8, head: mockUsers.find(u => u.id === 5) },
  { id: 5, code: 'OPS', name: 'Operations', sla_critical_hours: 4, sla_high_hours: 24, head: mockUsers.find(u => u.id === 6) },
  { id: 6, code: 'COMP', name: 'Compliance', sla_critical_hours: 8, sla_high_hours: 48, head: mockUsers.find(u => u.id === 7) }
];
