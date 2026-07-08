import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, UserPlus, X } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import {
  Button, StatusBadge, PriorityBadge, Avatar,
  EmptyState, ErrorState, TicketRowSkeleton, Pagination,
} from '@/design-system';
import { TicketFiltersBar } from '@/features/tickets/components/TicketFiltersBar';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import { AssignModal } from '@/features/tickets/modals/AssignModal';
import { DeptBulkAssignDrawer } from './DeptBulkAssignDrawer';
import { formatRelative } from '@/utils';
import type { TicketFilters, Ticket } from '@/types';

const PAGE_SIZE = 50;

function filtersFromParams(p: URLSearchParams): TicketFilters {
  return {
    search:           p.get('search') ?? '',
    status:           (p.get('status') as TicketFilters['status']) ?? '',
    priority:         (p.get('priority') as TicketFilters['priority']) ?? '',
    ticket_type:      (p.get('ticket_type') as TicketFilters['ticket_type']) ?? '',
    sla_breached:     p.get('sla_breached') === 'true' ? true : '',
    problem_category: p.get('problem_category') ?? '',
    page:             p.get('page') ? Number(p.get('page')) : 1,
  };
}

export function DeptHeadTicketsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [assignTicket, setAssignTicket] = useState<Ticket | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showBulkDrawer, setShowBulkDrawer] = useState(false);

  const parsed = filtersFromParams(searchParams);
  const page = parsed.page ?? 1;

  const filters: TicketFilters = { ...parsed, department: user?.department?.id };

  const updateFilter = useCallback((partial: Partial<TicketFilters>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!('page' in partial)) next.set('page', '1');
      Object.entries(partial).forEach(([k, v]) => {
        if (v === '' || v == null) next.delete(k); else next.set(k, String(v));
      });
      return next;
    });
  }, [setSearchParams]);

  const setPage = (p: number) => updateFilter({ page: p });

  const { data, isLoading, isError, refetch } = useTickets({ ...filters, page_size: PAGE_SIZE });
  const tickets = data?.results ?? [];

  const toggleSelect = (id: number) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selected.size === tickets.length) setSelected(new Set());
    else setSelected(new Set(tickets.map(t => t.id)));
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Department Tickets"
        subtitle={data ? `${data.count} tickets in ${user?.department?.name ?? 'your department'}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">{selected.size} selected</span>
                <Button variant="primary" size="sm" onClick={() => setShowBulkDrawer(true)} leftIcon={<UserPlus className="h-4 w-4" />}>
                  Assign ({selected.size})
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())} leftIcon={<X className="h-4 w-4" />}>
                  Clear
                </Button>
              </div>
            )}
          </div>
        }
      />

      <div className="mb-4">
        <TicketFiltersBar filters={filters} onChange={updateFilter} />
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-card flex flex-col flex-1 min-h-0">
        {/* Column headers */}
        <div
          className="grid gap-4 px-4 py-2.5 border-b border-surface-border bg-surface-secondary text-xs font-semibold text-text-muted uppercase tracking-wide items-center flex-shrink-0"
          style={{ gridTemplateColumns: '32px 2fr 110px 100px 150px 130px 100px' }}
        >
          <input
            type="checkbox"
            checked={tickets.length > 0 && selected.size === tickets.length}
            onChange={toggleAll}
            className="h-3.5 w-3.5 rounded border-2 border-surface-border-strong text-brand-purple focus:ring-brand-purple bg-white"
          />
          <span>Subject</span>
          <span>Status</span>
          <span>Priority</span>
          <span>SLA</span>
          <span>Assignee</span>
          <span>Updated</span>
        </div>

        {isLoading && <div>{Array.from({ length: 8 }).map((_, i) => <TicketRowSkeleton key={i} />)}</div>}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && tickets.length === 0 && (
          <EmptyState title="No tickets found" description="Adjust your filters to see more results." />
        )}

        {!isLoading && !isError && tickets.length > 0 && (
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
            {tickets.map(t => {
              const isSelected = selected.has(t.id);
              return (
                <div
                  key={t.id}
                  className={[
                    'grid gap-4 px-4 border-b border-surface-border transition-colors items-center group',
                    isSelected ? 'bg-brand-purple-faint' : 'hover:bg-surface-secondary',
                    t.sla_breached ? 'border-l-2 border-red-400 pl-[14px]' : '',
                  ].join(' ')}
                  style={{ gridTemplateColumns: '32px 2fr 110px 100px 150px 130px 100px', minHeight: 57 }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(t.id)}
                    onClick={e => e.stopPropagation()}
                    className="h-3.5 w-3.5 rounded border-2 border-surface-border-strong text-brand-purple focus:ring-brand-purple bg-white"
                  />
                  <button onClick={() => navigate(`/tickets/${t.id}`)} className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-muted">{t.ticket_number}</span>
                      {t.sla_breached && <span className="text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-600 font-semibold">SLA</span>}
                    </div>
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand-purple transition-colors">
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
                    ) : (
                      <button
                        onClick={() => setAssignTicket(t)}
                        className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-purple transition-colors"
                      >
                        <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                        Assign
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-text-muted">{formatRelative(t.updated_at)}</span>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && (data?.count ?? 0) > 0 && (
          <div className="px-4 pb-3 flex-shrink-0">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data!.count} onChange={setPage} />
          </div>
        )}
      </div>

      {assignTicket && (
        <AssignModal ticket={assignTicket} isOpen onClose={() => setAssignTicket(null)} />
      )}

      {showBulkDrawer && (
        <DeptBulkAssignDrawer
          ticketIds={Array.from(selected)}
          isOpen
          onClose={() => { setShowBulkDrawer(false); setSelected(new Set()); }}
        />
      )}
    </div>
  );
}
