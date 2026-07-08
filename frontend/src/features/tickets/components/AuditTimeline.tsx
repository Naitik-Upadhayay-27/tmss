import { useMemo } from 'react';
import {
  UserPlus, RefreshCw, CheckCircle, XCircle, RotateCcw,
  AlertTriangle, MessageSquare, Plus, Paperclip,
} from 'lucide-react';
import { Avatar } from '@/design-system';
import { formatDateTime, formatRelative } from '@/utils';
import type { AuditLog } from '@/types';

// Phase 1: generate mock audit entries from ticket data
interface AuditEntry {
  id: number;
  action: string;
  label: string;
  performed_by: { full_name: string };
  old_value?: string;
  new_value?: string;
  created_at: string;
}

const ACTION_CONFIG: Record<string, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: (e: AuditEntry) => string;
}> = {
  created:       { icon: Plus,          iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   label: () => 'Ticket created' },
  assign:        { icon: UserPlus,      iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', label: (e) => `Assigned to ${e.new_value ?? 'team member'}` },
  status_change: { icon: RefreshCw,     iconBg: 'bg-amber-100',  iconColor: 'text-amber-600',  label: (e) => `Status changed${e.old_value ? ` from ${e.old_value}` : ''} to ${e.new_value ?? 'unknown'}` },
  resolve:       { icon: CheckCircle,   iconBg: 'bg-green-100',  iconColor: 'text-green-600',  label: () => 'Ticket resolved' },
  close:         { icon: XCircle,       iconBg: 'bg-surface-tertiary', iconColor: 'text-text-muted', label: () => 'Ticket closed' },
  escalate:      { icon: AlertTriangle, iconBg: 'bg-red-100',    iconColor: 'text-red-600',    label: () => 'Ticket escalated' },
  reopen:        { icon: RotateCcw,     iconBg: 'bg-purple-100', iconColor: 'text-purple-600', label: () => 'Ticket reopened' },
  comment:       { icon: MessageSquare, iconBg: 'bg-surface-tertiary', iconColor: 'text-text-secondary', label: () => 'Comment added' },
  attachment:    { icon: Paperclip,     iconBg: 'bg-surface-tertiary', iconColor: 'text-text-secondary', label: () => 'Attachment added' },
};

interface AuditTimelineProps {
  ticketId: number;
  createdAt: string;
  createdBy: { full_name: string };
}

export function AuditTimeline({ ticketId: _ticketId, createdAt, createdBy }: AuditTimelineProps) {
  // Phase 1: local mock audit log
  const entries: AuditEntry[] = useMemo(() => [
    {
      id: 1,
      action: 'created',
      label: 'Ticket created',
      performed_by: createdBy,
      created_at: createdAt,
    },
  ], [createdAt, createdBy]);

  if (entries.length === 0) return null;

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-6">
        {entries.map((entry, idx) => {
          const config = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG['status_change'];
          const Icon = config.icon;
          const isLast = idx === entries.length - 1;

          return (
            <li key={entry.id} role="listitem">
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-surface-border"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white flex-shrink-0 ${config.iconBg}`}>
                    <Icon className={`h-4 w-4 ${config.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-sm font-medium text-text-primary">{config.label(entry)}</p>
                      <span className="text-xs text-text-muted" title={formatDateTime(entry.created_at)}>
                        {formatRelative(entry.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Avatar name={entry.performed_by.full_name} size="xs" />
                      <span className="text-xs text-text-muted">{entry.performed_by.full_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
