import { format, formatDistanceToNow, isPast, differenceInMinutes, differenceInHours } from 'date-fns';
import type { TicketStatus, TicketPriority, Role } from '@/types';

// ─── Date Formatters ──────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatSLACountdown(deadline: string): {
  label: string;
  breached: boolean;
  urgent: boolean;
} {
  const d = new Date(deadline);
  const breached = isPast(d);
  const diffMins = Math.abs(differenceInMinutes(d, new Date()));
  const diffHours = Math.abs(differenceInHours(d, new Date()));

  if (breached) {
    if (diffMins < 60) return { label: `Breached ${diffMins}m ago`, breached: true, urgent: true };
    return { label: `Breached ${diffHours}h ago`, breached: true, urgent: true };
  }

  const urgent = diffMins <= 60;
  if (diffMins < 60) return { label: `${diffMins}m remaining`, breached: false, urgent };
  if (diffHours < 24) return { label: `${diffHours}h remaining`, breached: false, urgent };
  return { label: `${Math.floor(diffHours / 24)}d ${diffHours % 24}h remaining`, breached: false, urgent: false };
}

// ─── Status Labels ────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  escalated: 'Escalated',
  on_hold: 'On Hold',
  review: 'In Review',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  DEPT_HEAD: 'Department Head',
  CALLER: 'Caller / Agent',
  MEMBER: 'Team Member',
};

// ─── Color Hash for Avatars ───────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-red-100 text-red-700',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── File Size ────────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
