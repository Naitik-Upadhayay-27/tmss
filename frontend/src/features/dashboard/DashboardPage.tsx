import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Ticket, AlertTriangle, CheckCircle, Clock, Users,
  Activity, Plus, RefreshCw, Download, UserPlus,
  Filter,
} from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useDepartments } from '@/hooks/useDepartments';
import { useMembers } from '@/hooks/useUsers';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Skeleton, StatusBadge, PriorityBadge, Avatar, Pagination } from '@/design-system';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import { CreateTicketModal } from '@/features/tickets/CreateTicketModal';
import { BulkAssignModal } from '@/features/tickets/modals/BulkAssignModal';
import { DEPT_CATEGORIES } from '@/mockData/deptCategories';
import { formatRelative } from '@/utils';
import type { TicketFilters, Ticket as TicketType, TicketStatus, TicketPriority, TicketType as TType } from '@/types';

// ─── helpers ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

function filtersFromParams(p: URLSearchParams): TicketFilters {
  return {
    search:           p.get('search') ?? '',
    status:           (p.get('status')      as TicketFilters['status'])      ?? '',
    priority:         (p.get('priority')    as TicketFilters['priority'])    ?? '',
    ticket_type:      (p.get('ticket_type') as TicketFilters['ticket_type']) ?? '',
    department:       p.get('department') ? Number(p.get('department')) : '',
    sla_breached:     p.get('sla_breached') === 'true' ? true : (p.get('sla_breached') === 'false' ? false : ''),
    problem_category: p.get('problem_category') ?? '',
    page:             p.get('page') ? Number(p.get('page')) : 1,
  };
}

function exportCsv(tickets: TicketType[]) {
  const cols = ['ticket_number', 'subject', 'status', 'priority', 'ticket_type', 'department', 'assignee', 'created_at', 'sla_deadline', 'sla_breached'];
  const rows = tickets.map(t => [
    t.ticket_number, `"${t.subject.replace(/"/g, '""')}"`, t.status, t.priority,
    t.ticket_type, t.department.name, t.assignee?.full_name ?? 'Unassigned',
    t.created_at, t.sla_deadline, String(t.sla_breached),
  ]);
  const csv = [cols.join(','), ...rows.map(r => r.join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `tickets-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

interface Chip {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  valueColor: string;
  filter: Partial<TicketFilters>;
  link?: string;
}

function StatChip({
  chip, active, loading, onClick,
}: { chip: Chip; active: boolean; loading?: boolean; onClick: () => void }) {
  if (loading) return <Skeleton className="h-[68px] w-[148px] rounded-xl flex-shrink-0" />;
  return (
    <button
      onClick={onClick}
      className={[
        'flex-shrink-0 flex items-center gap-3 rounded-xl px-3.5 py-3 h-[68px] w-[148px] transition-all border',
        active
          ? 'bg-brand-purple border-brand-purple shadow-md'
          : 'bg-white border-surface-border hover:border-brand-purple/40 hover:shadow-card-hover',
      ].join(' ')}
    >
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-white/20' : chip.iconBg}`}>
        <chip.icon className={`h-4 w-4 ${active ? 'text-white' : chip.iconColor}`} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className={`text-[22px] font-extrabold leading-none tabular-nums ${active ? 'text-white' : chip.valueColor}`}>
          {chip.value}
        </p>
        <p className={`text-[11px] font-semibold mt-0.5 leading-tight truncate ${active ? 'text-white/80' : 'text-text-secondary'}`}>
          {chip.label}
        </p>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'on_hold', label: 'On Hold' },
];

const PRIORITY_OPTIONS: { value: TicketPriority | ''; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const TYPE_OPTIONS: { value: TType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'internal', label: 'Internal' },
];

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showBulkAssign, setShowBulkAssign] = useState(false);

  const filters = filtersFromParams(searchParams);
  const page = filters.page ?? 1;

  const updateFilter = useCallback((partial: Partial<TicketFilters>) => {
    setSelected(new Set());
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!('page' in partial)) next.set('page', '1');
      if (!('sla_breached' in partial)) next.delete('sla_breached');
      Object.entries(partial).forEach(([k, v]) => {
        if (v === '' || v == null) next.delete(k); else next.set(k, String(v));
      });
      return next;
    });
  }, [setSearchParams]);

  const setPage = (p: number) => {
    setSelected(new Set());
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', String(p)); return next; });
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());

  const { data, isLoading, refetch } = useTickets({ ...filters, page_size: PAGE_SIZE });
  const { data: deptData } = useDepartments();
  const { data: members } = useMembers();
  const tickets = data?.results ?? [];

  const deptOptions = [
    { value: '', label: 'All Departments' },
    ...(deptData?.results ?? []).map(d => ({ value: String(d.id), label: d.name })),
  ];

  // stats — unfiltered, only need counts so page_size:1 is enough
  const { data: allData } = useTickets({ page_size: 1 });
  const { data: unassignedData } = useTickets({ page_size: 1, status: 'open' });
  const { data: closedData } = useTickets({ page_size: 1, status: 'closed' });
  const { data: breachedData } = useTickets({ page_size: 1, sla_breached: true });
  const all = { length: allData?.count ?? 0 };
  const stats = {
    total:       allData?.count ?? 0,
    unassigned:  unassignedData?.count ?? 0,
    closed:      closedData?.count ?? 0,
    breached:    breachedData?.count ?? 0,
    users:       members?.length ?? 0,
    departments: deptData?.results?.length ?? 0,
  };

  const breachRate = stats.total > 0 ? ((stats.breached / stats.total) * 100).toFixed(1) : '0.0';

  const chips: Chip[] = [
    { label: 'Total',            value: stats.total,       icon: Ticket,        iconColor: 'text-brand-purple', iconBg: 'bg-brand-purple-faint', valueColor: 'text-brand-purple', filter: {} },
    { label: 'Unassigned',       value: stats.unassigned,  icon: Clock,         iconColor: 'text-blue-600',     iconBg: 'bg-blue-50',            valueColor: 'text-blue-600',    filter: { status: 'open' } },
    { label: 'Closed Tickets',   value: stats.closed,      icon: CheckCircle,   iconColor: 'text-green-600',    iconBg: 'bg-green-50',           valueColor: 'text-green-600',   filter: { status: 'closed' } },
    { label: 'SLA Breached',     value: stats.breached,    icon: AlertTriangle, iconColor: 'text-red-600',      iconBg: 'bg-red-50',             valueColor: 'text-red-600',     filter: { sla_breached: true } },
    { label: 'Users',            value: stats.users,       icon: Users,         iconColor: 'text-violet-600',   iconBg: 'bg-violet-50',          valueColor: 'text-violet-600',  filter: {}, link: '/admin/users' },
    { label: 'Departments',      value: stats.departments, icon: Activity,      iconColor: 'text-amber-600',    iconBg: 'bg-amber-50',           valueColor: 'text-amber-600',   filter: {}, link: '/admin/departments' },
  ];

  // check which chip is active
  const activeChip = (chip: Chip) => {
    if (chip.link) return false;

    const f = chip.filter;
    if (Object.keys(f).length === 0) {
      return !filters.status && !filters.priority && !filters.sla_breached && !filters.ticket_type && !filters.department && !filters.search;
    }
    if ('sla_breached' in f) return filters.sla_breached === true;
    if ('status' in f) return filters.status === f.status && !filters.sla_breached;
    return false;
  };

  // selection helpers
  const toggleSelect = (id: number) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selected.size === tickets.length) setSelected(new Set());
    else setSelected(new Set(tickets.map(t => t.id)));
  };

  const canCreate = user?.role !== 'MEMBER';
  const canBulkAssign = user?.role === 'SUPER_ADMIN' || user?.role === 'DEPT_HEAD';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Operations Dashboard"
        subtitle={`${all.length} total tickets · SLA breach rate ${breachRate}%`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
            <Button
              variant="secondary" size="sm"
              onClick={() => exportCsv(selected.size > 0 ? tickets.filter(t => selected.has(t.id)) : tickets)}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export{selected.size > 0 ? ` (${selected.size})` : ''}
            </Button>
            {canCreate && (
              <Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />} data-testid="create-ticket-btn">
                New Ticket
              </Button>
            )}
          </div>
        }
      />

      {/* ── Stat slab ── */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md px-5 py-4">
        <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[68px] w-[148px] rounded-xl flex-shrink-0" />)
            : chips.map(chip => (
                <StatChip
                  key={chip.label}
                  chip={chip}
                  active={activeChip(chip)}
                  onClick={() => {
                    if (chip.link) {
                      navigate(chip.link);
                      return;
                    }
                    const isActive = activeChip(chip);
                    if (isActive) {
                      setSearchParams(new URLSearchParams());
                    } else {
                      const next = new URLSearchParams();
                      Object.entries(chip.filter).forEach(([k, v]) => {
                        if (v !== '' && v != null) next.set(k, String(v));
                      });
                      setSearchParams(next);
                    }
                  }}
                />
              ))
          }
        </div>
      </div>

      {/* ── Ticket table ── */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden flex flex-col">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-surface-border bg-surface-secondary flex-shrink-0">

          {/* Status */}
          <select
            value={filters.status ?? ''}
            onChange={e => updateFilter({ status: e.target.value as TicketFilters['status'] })}
            className="h-9 py-1.5 pl-3 pr-8 rounded-lg border border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
            data-testid="status-filter"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Priority */}
          <select
            value={filters.priority ?? ''}
            onChange={e => updateFilter({ priority: e.target.value as TicketFilters['priority'] })}
            className="h-9 py-1.5 pl-3 pr-8 rounded-lg border border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
            data-testid="priority-filter"
          >
            {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Type */}
          <select
            value={filters.ticket_type ?? ''}
            onChange={e => updateFilter({ ticket_type: e.target.value as TicketFilters['ticket_type'] })}
            className="h-9 py-1.5 pl-3 pr-8 rounded-lg border border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
            data-testid="type-filter"
          >
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Department */}
          <select
            value={String(filters.department ?? '')}
            onChange={e => updateFilter({ department: e.target.value ? Number(e.target.value) : '' })}
            className="h-9 py-1.5 pl-3 pr-8 rounded-lg border border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
            data-testid="dept-filter"
          >
            {deptOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Problem Category */}
          <select
            value={filters.problem_category ?? ''}
            onChange={e => updateFilter({ problem_category: e.target.value })}
            className="h-9 py-1.5 pl-3 pr-8 rounded-lg border border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
            data-testid="category-filter"
          >
            <option value="">All Categories</option>
            {[...new Set(Object.values(DEPT_CATEGORIES).flat())].sort().map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Result count */}
          <span className="text-xs text-text-muted font-medium">{data?.count ?? 0} ticket{(data?.count ?? 0) !== 1 ? 's' : ''}</span>

          {/* Bulk assign */}
          {canBulkAssign && selected.size > 0 && (
            <Button
              variant="primary" size="sm"
              onClick={() => setShowBulkAssign(true)}
              leftIcon={<UserPlus className="h-3.5 w-3.5" />}
              data-testid="bulk-assign-btn"
            >
              Assign {selected.size}
            </Button>
          )}
        </div>

        {/* Column headers */}
        <div
          className="grid gap-3 px-4 py-2.5 border-b border-surface-border bg-surface-secondary text-[11px] font-semibold text-text-muted uppercase tracking-widest flex-shrink-0 items-center"
          style={{ gridTemplateColumns: '32px 2fr 110px 90px 160px 130px 90px' }}
        >
          <input
            type="checkbox"
            checked={tickets.length > 0 && selected.size === tickets.length}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer shadow-sm"
            aria-label="Select all"
          />
          <span>Subject</span>
          <span>Status</span>
          <span>Priority</span>
          <span>SLA</span>
          <span>Assignee</span>
          <span>Updated</span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="divide-y divide-surface-border">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="px-4 py-3"><Skeleton className="h-4 rounded" /></div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="h-8 w-8 text-text-muted/30 mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold text-text-primary">No tickets match</p>
            <p className="text-xs text-text-muted mt-0.5">Try adjusting your filters</p>
          </div>
        )}

        {/* Rows */}
        {!isLoading && tickets.length > 0 && (
          <div className="overflow-y-auto scrollbar-thin">
            {tickets.map(t => {
              const isSelected = selected.has(t.id);
              return (
                <div
                  key={t.id}
                  className={[
                    'grid gap-3 px-4 items-center border-b border-surface-border transition-colors',
                    isSelected ? 'bg-brand-purple-faint' : 'hover:bg-surface-secondary',
                    t.sla_breached ? 'border-l-2 border-red-400 pl-[14px]' : '',
                  ].join(' ')}
                  style={{ gridTemplateColumns: '32px 2fr 110px 90px 160px 130px 90px', minHeight: 56 }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(t.id)}
                    onClick={e => e.stopPropagation()}
                    className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer shadow-sm"
                    aria-label={`Select ${t.ticket_number}`}
                  />
                  <button
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="min-w-0 text-left group"
                    data-testid={`ticket-row-${t.id}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-semibold text-text-muted">{t.ticket_number}</span>
                      {t.sla_breached && <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1 rounded uppercase">SLA</span>}
                      <span className={`text-[10px] capitalize px-1.5 py-0.5 rounded font-semibold ${
                        t.ticket_type === 'insurance' ? 'bg-brand-purple-faint text-brand-purple' : 'bg-surface-tertiary text-text-secondary'
                      }`}>{t.ticket_type}</span>
                    </div>
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-purple transition-colors leading-tight">
                      {t.subject}
                    </p>
                  </button>
                  <StatusBadge status={t.status} size="sm" />
                  <PriorityBadge priority={t.priority} size="sm" />
                  <SLAIndicator deadline={t.sla_deadline} breached={t.sla_breached} size="sm" />
                  <div>
                    {t.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar name={t.assignee.full_name} size="xs" />
                        <span className="text-xs text-text-secondary truncate">{t.assignee.first_name}</span>
                      </div>
                    ) : <span className="text-xs text-text-muted italic">Unassigned</span>}
                  </div>
                  <span className="text-xs text-text-muted">{formatRelative(t.updated_at)}</span>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && (data?.count ?? 0) > 0 && (
          <div className="px-4 pb-3">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data!.count} onChange={setPage} />
          </div>
        )}
      </div>

      <CreateTicketModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      {showBulkAssign && (
        <BulkAssignModal
          ticketIds={Array.from(selected)}
          isOpen
          onClose={() => { setShowBulkAssign(false); setSelected(new Set()); }}
        />
      )}
    </div>
  );
}
