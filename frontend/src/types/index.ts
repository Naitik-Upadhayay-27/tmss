// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = 'SUPER_ADMIN' | 'DEPT_HEAD' | 'CALLER' | 'MEMBER';

export type TicketType = 'insurance' | 'internal';

export type TicketStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'escalated'
  | 'on_hold'
  | 'review';

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type DeptCode =
  | 'INS_OPS'
  | 'LOAN_OPS'
  | 'TECH_BE'
  | 'TECH_FE'
  | 'OPS'
  | 'COMP';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  department?: Department;
  is_active: boolean;
  date_joined: string;
  permissions?: string[];
}

// ─── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: number;
  code: string;
  name: string;
  head?: User;
  sla_critical_hours: number;
  sla_high_hours: number;
  is_active?: boolean; // optional — defaults to true; mock data may omit it
}

// ─── Ticket ───────────────────────────────────────────────────────────────────

export interface InsuranceFields {
  policy_number: string;
  claim_number: string;
  insurer_name: string;
  insurer_contact: string;
}

// ─── Internal ─────────────────────────────────────────────────────────────────

export interface InternalFields {
  affected_system: string;
  business_impact: string;
}

export interface Attachment {
  id: number;
  filename: string;
  url: string;
  size: number;
  uploaded_at: string;
  uploaded_by: User;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  ticket_type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  department: Department;
  created_by: User;
  assignee?: User;
  tags: string[];
  problem_category?: string;
  sub_problem?: string;
  // SLA
  sla_deadline: string;
  sla_breached: boolean;
  sla_breach_at?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  // Type-specific
  insurance_fields?: InsuranceFields;
  internal_fields?: InternalFields;
  // Counts
  comment_count: number;
  attachment_count: number;
}

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  ticket: number;
  author: User;
  body: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'created'
  | 'assign'
  | 'status_change'
  | 'resolve'
  | 'close'
  | 'escalate'
  | 'reopen'
  | 'comment'
  | 'attachment';

export interface AuditLog {
  id: number;
  ticket: number;
  action: AuditAction;
  performed_by: User;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: number;
  recipient: number;
  title: string;
  message: string;
  ticket?: number;
  ticket_number?: string;
  is_read: boolean;
  starred?: boolean;
  created_at: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface TicketFilters {
  search?: string;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  ticket_type?: TicketType | '';
  department?: number | '';
  assignee?: number | '';
  created_by?: number | '';
  sla_breached?: boolean | '';
  problem_category?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AIAnalysis {
  ai_available: boolean;
  suggested_category?: string;
  suggested_priority?: TicketPriority;
  suggested_assignee?: User;
  summary?: string;
  confidence?: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

// ─── Ticket Timeline ──────────────────────────────────────────────────────────

export type TimelineEventType =
  | 'created'
  | 'assigned'
  | 'unassigned'
  | 'reassigned'
  | 'status_change'
  | 'priority_change'
  | 'comment'
  | 'internal_note'
  | 'attachment'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened'
  | 'due_date_changed'
  | 'label_added'
  | 'label_removed'
  | 'linked'
  | 'merged';

export interface TimelineEvent {
  id: number;
  type: TimelineEventType;
  timestamp: string;
  actor: User;
  // assignment fields
  assignee?: User;
  prev_assignee?: User;
  assign_reason?: string;
  // change fields
  old_value?: string;
  new_value?: string;
  // content
  body?: string;
  filename?: string;
  file_size?: number;
}

export interface AssigneeSlot {
  assignee: User;
  assigned_by: User;
  reason: string;
  start: string;          // ISO
  end: string | null;     // null = current
  duration_ms: number;
  stats: {
    comments: number;
    status_changes: number;
    updates: number;
    files: number;
  };
}

export interface PermissionNode {
  id: string;
  name: string;
  description: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  permissions: PermissionNode[];
}
