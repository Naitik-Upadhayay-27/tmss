import { useState, useMemo } from 'react';
import {
  UserPlus, RefreshCw, MessageSquare, Paperclip,
  AlertCircle, CheckCircle, XCircle, RotateCcw,
  GitBranch, Flag, Tag, Link2, Plus, UserMinus,
  ChevronDown, ChevronUp, Filter, Search,
} from 'lucide-react';
import { Avatar, Tooltip } from '@/design-system';
import { formatDateTime, formatRelative } from '@/utils';
import type { TimelineEvent, TimelineEventType, AssigneeSlot, Ticket } from '@/types';

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return 'This Week';
  if (diff < 14) return 'Last Week';
  return 'Older';
}

// ─── event config ─────────────────────────────────────────────────────────────

interface EventCfg {
  icon: React.ElementType;
  color: string;        // dot bg
  ring: string;         // ring color for dot
  label: string;
  textColor: string;
}

const EVENT_CFG: Record<TimelineEventType, EventCfg> = {
  created:          { icon: Plus,          color: 'bg-blue-500',    ring: 'ring-blue-100',   label: 'Ticket Created',        textColor: 'text-blue-700' },
  assigned:         { icon: UserPlus,      color: 'bg-indigo-500',  ring: 'ring-indigo-100', label: 'Assigned',              textColor: 'text-indigo-700' },
  unassigned:       { icon: UserMinus,     color: 'bg-slate-400',   ring: 'ring-slate-100',  label: 'Unassigned',            textColor: 'text-slate-600' },
  reassigned:       { icon: GitBranch,     color: 'bg-violet-500',  ring: 'ring-violet-100', label: 'Reassigned',            textColor: 'text-violet-700' },
  status_change:    { icon: RefreshCw,     color: 'bg-orange-500',  ring: 'ring-orange-100', label: 'Status Changed',        textColor: 'text-orange-700' },
  priority_change:  { icon: Flag,          color: 'bg-red-500',     ring: 'ring-red-100',    label: 'Priority Changed',      textColor: 'text-red-700' },
  comment:          { icon: MessageSquare, color: 'bg-green-500',   ring: 'ring-green-100',  label: 'Comment Added',         textColor: 'text-green-700' },
  internal_note:    { icon: MessageSquare, color: 'bg-amber-500',   ring: 'ring-amber-100',  label: 'Internal Note',         textColor: 'text-amber-700' },
  attachment:       { icon: Paperclip,     color: 'bg-purple-500',  ring: 'ring-purple-100', label: 'Attachment Uploaded',   textColor: 'text-purple-700' },
  escalated:        { icon: AlertCircle,   color: 'bg-rose-600',    ring: 'ring-rose-100',   label: 'Escalated',             textColor: 'text-rose-700' },
  resolved:         { icon: CheckCircle,   color: 'bg-emerald-500', ring: 'ring-emerald-100',label: 'Resolved',              textColor: 'text-emerald-700' },
  closed:           { icon: XCircle,       color: 'bg-slate-500',   ring: 'ring-slate-100',  label: 'Closed',                textColor: 'text-slate-600' },
  reopened:         { icon: RotateCcw,     color: 'bg-yellow-500',  ring: 'ring-yellow-100', label: 'Reopened',              textColor: 'text-yellow-700' },
  due_date_changed: { icon: RefreshCw,     color: 'bg-cyan-500',    ring: 'ring-cyan-100',   label: 'Due Date Changed',      textColor: 'text-cyan-700' },
  label_added:      { icon: Tag,           color: 'bg-teal-500',    ring: 'ring-teal-100',   label: 'Label Added',           textColor: 'text-teal-700' },
  label_removed:    { icon: Tag,           color: 'bg-slate-400',   ring: 'ring-slate-100',  label: 'Label Removed',         textColor: 'text-slate-600' },
  linked:           { icon: Link2,         color: 'bg-sky-500',     ring: 'ring-sky-100',    label: 'Linked Ticket',         textColor: 'text-sky-700' },
  merged:           { icon: GitBranch,     color: 'bg-pink-500',    ring: 'ring-pink-100',   label: 'Merged',                textColor: 'text-pink-700' },
};

// ─── sub-components ───────────────────────────────────────────────────────────

function EventMeta({ ev }: { ev: TimelineEvent }) {
  switch (ev.type) {
    case 'assigned':
    case 'reassigned':
      return (
        <div className="mt-1.5 space-y-0.5">
          {ev.prev_assignee && (
            <p className="text-[11px] text-text-muted">
              <span className="font-medium text-text-secondary">From:</span> {ev.prev_assignee.full_name}
            </p>
          )}
          {ev.assignee && (
            <p className="text-[11px] text-text-muted">
              <span className="font-medium text-text-secondary">To:</span>{' '}
              <span className="font-semibold text-text-primary">{ev.assignee.full_name}</span>
            </p>
          )}
          {ev.assign_reason && (
            <p className="text-[11px] italic text-text-muted">"{ev.assign_reason}"</p>
          )}
        </div>
      );
    case 'status_change':
    case 'priority_change':
      return (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-text-secondary bg-surface-tertiary px-1.5 py-0.5 rounded">
            {ev.old_value}
          </span>
          <span className="text-[10px] text-text-muted">→</span>
          <span className="text-[11px] font-semibold text-text-primary bg-brand-purple-faint text-brand-purple px-1.5 py-0.5 rounded border border-purple-200">
            {ev.new_value}
          </span>
        </div>
      );
    case 'comment':
    case 'internal_note':
      return ev.body ? (
        <p className="mt-1.5 text-[11px] text-text-secondary italic line-clamp-2">"{ev.body}"</p>
      ) : null;
    case 'attachment':
      return ev.filename ? (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Paperclip className="h-3 w-3 text-text-muted" aria-hidden="true" />
          <span className="text-[11px] text-text-primary font-medium">{ev.filename}</span>
          {ev.file_size && (
            <span className="text-[10px] text-text-muted">
              ({ev.file_size < 1024 * 1024
                ? `${(ev.file_size / 1024).toFixed(1)}KB`
                : `${(ev.file_size / 1024 / 1024).toFixed(1)}MB`})
            </span>
          )}
        </div>
      ) : null;
    default:
      return null;
  }
}

// ─── Assignee History Cards ────────────────────────────────────────────────────

function AssigneeHistoryCards({ slots }: { slots: AssigneeSlot[] }) {
  if (slots.length === 0) return null;
  const totalMs = slots.reduce((s, sl) => s + sl.duration_ms, 0);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Assignment History</p>

      {/* Duration bar graph */}
      <div className="space-y-1.5 px-1">
        {slots.map((sl, i) => {
          const pct = totalMs > 0 ? (sl.duration_ms / totalMs) * 100 : 0;
          return (
            <Tooltip
              key={i}
              content={`${sl.assignee.full_name} · ${fmtDuration(sl.duration_ms)} · Assigned by ${sl.assigned_by.full_name}`}
              position="top"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-muted w-16 truncate flex-shrink-0">{sl.assignee.first_name}</span>
                <div className="flex-1 h-3 bg-surface-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-purple rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-muted w-10 text-right flex-shrink-0">{fmtDuration(sl.duration_ms)}</span>
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Slot cards */}
      <div className="space-y-2">
        {slots.map((sl, i) => (
          <div key={i} className="bg-surface-secondary border border-surface-border rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              <div className="relative flex-shrink-0">
                <Avatar name={sl.assignee.full_name} size="sm" />
                <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-brand-purple text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary">{sl.assignee.full_name}</p>
                <p className="text-[10px] text-text-muted capitalize">{sl.assignee.role.replace(/_/g, ' ').toLowerCase()}</p>
              </div>
              <span className="text-[10px] font-bold text-brand-purple bg-brand-purple-faint px-2 py-0.5 rounded-full flex-shrink-0">
                {fmtDuration(sl.duration_ms)}
              </span>
            </div>

            {/* time range */}
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-text-muted">
              <span className="font-medium text-text-secondary">{formatDateTime(sl.start)}</span>
              <span>→</span>
              <span className={sl.end ? 'font-medium text-text-secondary' : 'font-bold text-green-600'}>
                {sl.end ? formatDateTime(sl.end) : 'Current'}
              </span>
            </div>

            {/* meta */}
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
              <span className="text-text-muted">Assigned by: <span className="font-semibold text-text-primary">{sl.assigned_by.full_name}</span></span>
              {sl.reason && <span className="text-text-muted italic col-span-2">"{sl.reason}"</span>}
            </div>

            {/* stats */}
            <div className="mt-2.5 pt-2 border-t border-surface-border grid grid-cols-4 gap-1 text-center">
              {[
                { label: 'Comments', val: sl.stats.comments },
                { label: 'Status', val: sl.stats.status_changes },
                { label: 'Updates', val: sl.stats.updates },
                { label: 'Files', val: sl.stats.files },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-sm font-bold text-text-primary">{val}</p>
                  <p className="text-[9px] text-text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AssigneeTimelineProps {
  ticket: Ticket;
  events: TimelineEvent[];
  slots: AssigneeSlot[];
}

const FILTER_TYPES: { label: string; value: TimelineEventType | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Assignment',  value: 'assigned' },
  { label: 'Status',      value: 'status_change' },
  { label: 'Comments',    value: 'comment' },
  { label: 'Attachments', value: 'attachment' },
  { label: 'Priority',    value: 'priority_change' },
];

export function AssigneeTimeline({ ticket, events, slots }: AssigneeTimelineProps) {
  const [filterType, setFilterType] = useState<TimelineEventType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);

  const filtered = useMemo(() => {
    let list = [...events].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (filterType !== 'all') {
      list = list.filter(e =>
        e.type === filterType ||
        (filterType === 'assigned' && (e.type === 'reassigned' || e.type === 'unassigned'))
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.actor.full_name.toLowerCase().includes(q) ||
        e.assignee?.full_name.toLowerCase().includes(q) ||
        e.body?.toLowerCase().includes(q) ||
        e.old_value?.toLowerCase().includes(q) ||
        e.new_value?.toLowerCase().includes(q) ||
        e.filename?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [events, filterType, search]);

  // Group by day label
  const groups = useMemo(() => {
    const ORDER = ['Today', 'Yesterday', 'This Week', 'Last Week', 'Older'];
    const map = new Map<string, TimelineEvent[]>();
    filtered.forEach(ev => {
      const g = dayLabel(ev.timestamp);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(ev);
    });
    return ORDER.filter(k => map.has(k)).map(k => ({ label: k, events: map.get(k)! }));
  }, [filtered]);

  return (
    <div className="space-y-4">

      {/* Assignee history toggle */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-purple"
          onClick={() => setShowHistory(h => !h)}
        >
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Assignment History</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/70 bg-white/20 px-2 py-0.5 rounded-full">{slots.length} assignee{slots.length !== 1 ? 's' : ''}</span>
            {showHistory
              ? <ChevronUp className="h-3.5 w-3.5 text-white/70" />
              : <ChevronDown className="h-3.5 w-3.5 text-white/70" />
            }
          </div>
        </button>
        {showHistory && (
          <div className="px-4 py-4">
            <AssigneeHistoryCards slots={slots} />
          </div>
        )}
      </div>

      {/* Timeline card */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-purple"
          onClick={() => setShowTimeline(t => !t)}
        >
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Timeline</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/70 bg-white/20 px-2 py-0.5 rounded-full">{filtered.length} events</span>
            {showTimeline
              ? <ChevronUp className="h-3.5 w-3.5 text-white/70" />
              : <ChevronDown className="h-3.5 w-3.5 text-white/70" />
            }
          </div>
        </button>

        {showTimeline && (
          <>

        {/* Filters */}
        <div className="px-4 py-2.5 border-b border-surface-border bg-surface-secondary space-y-2">
          {/* type pills */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TYPES.map(f => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  filterType === f.value
                    ? 'bg-brand-purple text-white border-brand-purple'
                    : 'bg-white text-text-secondary border-surface-border hover:border-brand-purple hover:text-brand-purple'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-text-muted pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events…"
              className="w-full h-7 pl-7 pr-3 rounded-lg border border-surface-border bg-white text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
            />
          </div>
        </div>

        {/* Timeline body */}
        <div className="px-4 py-4 overflow-y-auto scrollbar-thin" style={{ height: 240 }}>
          {groups.length === 0 ? (
            <div className="py-10 text-center">
              <Filter className="h-6 w-6 text-text-muted/40 mx-auto mb-2" />
              <p className="text-sm text-text-muted">No events match your filter</p>
            </div>
          ) : groups.map(group => (
            <div key={group.label} className="mb-6 last:mb-0">
              {/* day group label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{group.label}</span>
                <div className="flex-1 h-px bg-surface-border" />
              </div>

              {/* events */}
              <ol className="relative" role="list">
                {group.events.map((ev, idx) => {
                  const cfg = EVENT_CFG[ev.type];
                  const Icon = cfg.icon;
                  const isLast = idx === group.events.length - 1;
                  return (
                    <li key={ev.id} className="flex gap-3 relative">
                      {/* dot + connector */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ring-4 flex-shrink-0 ${cfg.color} ${cfg.ring}`}>
                          <Icon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 bg-surface-border mt-1" style={{ minHeight: 20 }} aria-hidden="true" />
                        )}
                      </div>

                      {/* content */}
                      <div className={`flex-1 min-w-0 pt-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className={`text-[11px] font-bold uppercase tracking-wide ${cfg.textColor}`}>
                              {cfg.label}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Avatar name={ev.actor.full_name} size="xs" />
                              <span className="text-xs font-semibold text-text-primary">{ev.actor.full_name}</span>
                            </div>
                          </div>
                          <span
                            className="text-[10px] text-text-muted whitespace-nowrap flex-shrink-0 mt-0.5"
                            title={formatDateTime(ev.timestamp)}
                          >
                            {formatRelative(ev.timestamp)}
                          </span>
                        </div>
                        <EventMeta ev={ev} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
