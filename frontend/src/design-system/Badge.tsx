import type { TicketStatus, TicketPriority, Role } from '@/types';
import { STATUS_LABELS, PRIORITY_LABELS, ROLE_LABELS } from '@/utils';

const STATUS_STYLES: Record<TicketStatus, string> = {
  open:        'bg-indigo-50   text-indigo-700  border-indigo-200',
  assigned:    'bg-orange-50   text-orange-700  border-orange-200',
  in_progress: 'bg-blue-50     text-blue-700    border-blue-200',
  resolved:    'bg-green-50    text-green-700   border-green-200',
  closed:      'bg-surface-tertiary text-text-muted border-surface-border',
  escalated:   'bg-red-50      text-red-700     border-red-200',
  on_hold:     'bg-amber-50    text-amber-700   border-amber-200',
  review:      'bg-violet-50   text-violet-700  border-violet-200',
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  critical: 'bg-red-50    text-red-700    border-red-200',
  high:     'bg-orange-50 text-orange-700 border-orange-200',
  medium:   'bg-amber-50  text-amber-700  border-amber-200',
  low:      'bg-green-50  text-green-700  border-green-200',
};

const PRIORITY_DOTS: Record<TicketPriority, string> = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-amber-500',
  low:      'bg-green-500',
};

interface StatusBadgeProps { status: TicketStatus; size?: 'sm' | 'md'; }
export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${STATUS_STYLES[status]}`}
      data-testid="status-badge"
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface PriorityBadgeProps { priority: TicketPriority; size?: 'sm' | 'md'; }
export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${PRIORITY_STYLES[priority]}`}
      data-testid="priority-badge"
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOTS[priority]}`} aria-hidden="true" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

interface RoleBadgeProps { role: Role; }
export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-brand-purple-faint text-brand-purple border border-purple-200 rounded-full">
      {ROLE_LABELS[role]}
    </span>
  );
}
