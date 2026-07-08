export type PermissionNode = {
  id: string;
  name: string;
  description: string;
};

export type PermissionCategory = {
  id: string;
  name: string;
  permissions: PermissionNode[];
};

export const mockPermissions: PermissionCategory[] = [
  {
    id: 'tms:ticket',
    name: 'Ticket Management',
    permissions: [
      { id: 'tms:ticket:read_all', name: 'Read All', description: 'View tickets across all departments globally' },
      { id: 'tms:ticket:read_dept', name: 'Read Department', description: 'View tickets within assigned departments' },
      { id: 'tms:ticket:create', name: 'Create', description: 'Create new tickets' },
      { id: 'tms:ticket:update', name: 'Update', description: 'Modify ticket details and status' },
      { id: 'tms:ticket:delete', name: 'Delete', description: 'Permanently delete tickets (soft/hard delete)' },
      { id: 'tms:ticket:assign', name: 'Assign', description: 'Re-assign tickets to other users or departments' },
      { id: 'tms:ticket:escalate', name: 'Escalate', description: 'Manually escalate tickets to higher priority/tier' },
    ]
  },
  {
    id: 'tms:sla',
    name: 'SLA & Escalation',
    permissions: [
      { id: 'tms:sla:manage_rules', name: 'Manage Rules', description: 'Create and modify SLA definitions and exceptions' },
      { id: 'tms:sla:override_breach', name: 'Override Breach', description: 'Acknowledge and override SLA breach flags' },
    ]
  },
  {
    id: 'iam:user',
    name: 'Identity & Access',
    permissions: [
      { id: 'iam:user:read', name: 'Read Users', description: 'View user directory and profiles' },
      { id: 'iam:user:create', name: 'Create User', description: 'Invite and provision new user accounts' },
      { id: 'iam:user:update', name: 'Update User', description: 'Modify user profiles and deactivate accounts' },
      { id: 'iam:user:manage_roles', name: 'Manage Roles', description: 'Assign roles and modify granular permissions' },
    ]
  },
  {
    id: 'sys:config',
    name: 'System Configuration',
    permissions: [
      { id: 'sys:config:view_audit', name: 'View Audit Logs', description: 'Access system-wide immutable audit trails' },
      { id: 'sys:config:manage_depts', name: 'Manage Departments', description: 'Create and configure department settings' },
    ]
  },
  {
    id: 'ai:engine',
    name: 'AI & Analytics',
    permissions: [
      { id: 'ai:engine:reports', name: 'Generate Reports', description: 'Access advanced analytics and AI-generated insights' },
      { id: 'ai:engine:settings', name: 'Manage Models', description: 'Configure underlying ML models and parameters' },
    ]
  }
];
