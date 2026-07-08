import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, StatusBadge, PriorityBadge, EmptyState, ErrorState, TicketRowSkeleton, Pagination } from '@/design-system';
import { TicketFiltersBar } from '@/features/tickets/components/TicketFiltersBar';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import { formatRelative } from '@/utils';
import type { TicketFilters } from '@/types';

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

export function MemberTicketsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const parsed = filtersFromParams(searchParams);
  const page = parsed.page ?? 1;
  const filters = { ...parsed, assignee: user?.id };

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

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="All My Tickets"
        subtitle={data ? `${data.count} ticket${data.count !== 1 ? 's' : ''} assigned to you` : undefined}
        actions={
          <Button variant="secondary" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
        }
      />
      <div className="mb-4">
        <TicketFiltersBar filters={filters} onChange={updateFilter} />
      </div>
      <div className="bg-white rounded-xl border border-surface-border shadow-card flex flex-col flex-1 min-h-0">
        <div className="grid gap-4 px-4 py-2.5 border-b border-surface-border bg-surface-secondary text-xs font-medium text-text-muted uppercase tracking-wide flex-shrink-0"
          style={{ gridTemplateColumns: '2fr 110px 100px 150px 80px' }}>
          <span>Subject</span><span>Status</span><span>Priority</span><span>SLA</span><span>Updated</span>
        </div>
        {isLoading && <div>{Array.from({ length: 6 }).map((_, i) => <TicketRowSkeleton key={i} />)}</div>}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && tickets.length === 0 && (
          <EmptyState title="No assigned tickets" description="Tickets assigned to you will appear here." />
        )}
        {!isLoading && !isError && tickets.length > 0 && (
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
            {tickets.map(t => (
              <button
                key={t.id}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className="w-full grid gap-4 px-4 py-3 border-b border-surface-border hover:bg-surface-secondary transition-colors text-left items-center"
                style={{ gridTemplateColumns: '2fr 110px 100px 150px 80px' }}
              >
                <div className="min-w-0">
                  <p className="text-xs font-mono text-text-muted">{t.ticket_number}</p>
                  <p className="text-sm text-text-primary font-medium truncate">{t.subject}</p>
                  <p className="text-xs text-text-muted">{t.department.name}</p>
                </div>
                <StatusBadge status={t.status} size="sm" />
                <PriorityBadge priority={t.priority} size="sm" />
                <SLAIndicator deadline={t.sla_deadline} breached={t.sla_breached} size="sm" />
                <span className="text-xs text-text-muted">{formatRelative(t.updated_at)}</span>
              </button>
            ))}
          </div>
        )}
        {!isLoading && !isError && (data?.count ?? 0) > 0 && (
          <div className="px-4 pb-3 flex-shrink-0">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data!.count} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
