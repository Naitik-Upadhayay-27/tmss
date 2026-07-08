import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, RefreshCw, Inbox } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Input, Select, StatusBadge, PriorityBadge, EmptyState, ErrorState, TicketRowSkeleton, Pagination } from '@/design-system';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import { CreateTicketModal } from '@/features/tickets/CreateTicketModal';
import { formatRelative } from '@/utils';
import type { TicketFilters } from '@/types';

const PAGE_SIZE = 50;

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'escalated', label: 'Escalated' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function AgentTicketListPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const filters: TicketFilters = {
    created_by:   user?.id,
    search:       searchParams.get('search') ?? '',
    status:       (searchParams.get('status') as TicketFilters['status']) ?? '',
    priority:     (searchParams.get('priority') as TicketFilters['priority']) ?? '',
    sla_breached: searchParams.get('sla_breached') === 'true' ? true : '',
    page,
  };

  const updateFilter = useCallback((key: string, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (key !== 'page') next.set('page', '1');
      if (!value) next.delete(key); else next.set(key, value);
      return next;
    });
  }, [setSearchParams]);

  const setPage = (p: number) => updateFilter('page', String(p));

  const { data, isLoading, isError, refetch } = useTickets({ ...filters, page_size: PAGE_SIZE });
  const tickets = data?.results ?? [];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="My Tickets"
        subtitle={data ? `${data.count} ticket${data.count !== 1 ? 's' : ''}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
            <Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />} data-testid="create-ticket-btn">
              New Ticket
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input
          placeholder="Search my tickets..."
          value={filters.search ?? ''}
          onChange={e => updateFilter('search', e.target.value)}
          className="w-56"
        />
        <Select options={STATUS_OPTIONS} value={filters.status ?? ''} onChange={e => updateFilter('status', e.target.value)} className="w-36" />
        <Select options={PRIORITY_OPTIONS} value={filters.priority ?? ''} onChange={e => updateFilter('priority', e.target.value)} className="w-36" />
        <button
          onClick={() => updateFilter('sla_breached', filters.sla_breached ? '' : 'true')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            filters.sla_breached
              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              : 'bg-white text-text-secondary border-surface-border hover:bg-surface-secondary'
          }`}
        >
          SLA Breached
        </button>
      </div>

      <div className="bg-white rounded-xl border border-surface-border shadow-card flex flex-col flex-1 min-h-0">
        <div className="grid gap-4 px-4 py-2.5 border-b border-surface-border bg-surface-secondary text-xs font-medium text-text-muted uppercase tracking-wide flex-shrink-0"
          style={{ gridTemplateColumns: '2fr 110px 100px 150px 80px' }}>
          <span>Subject</span><span>Status</span><span>Priority</span><span>SLA</span><span>Updated</span>
        </div>

        {isLoading && <div>{Array.from({ length: 6 }).map((_, i) => <TicketRowSkeleton key={i} />)}</div>}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && tickets.length === 0 && (
          <EmptyState
            icon={<Inbox className="h-10 w-10" />}
            title="You haven't created any tickets yet"
            description="When you create a ticket, it will appear here."
            action={<Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />}>New Ticket</Button>}
          />
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

      <CreateTicketModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
