import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import {
  Button, StatusBadge, PriorityBadge, Avatar,
  EmptyState, ErrorState, TicketRowSkeleton, Pagination,
} from '@/design-system';
import { TicketFiltersBar } from './components/TicketFiltersBar';
import { SLAIndicator } from './components/SLAIndicator';
import { CreateTicketModal } from './CreateTicketModal';
import { formatRelative } from '@/utils';
import type { TicketFilters, Ticket } from '@/types';
import { MessageSquare, Paperclip } from 'lucide-react';

const PAGE_SIZE = 50;

function filtersFromParams(p: URLSearchParams): TicketFilters {
  return {
    search:           p.get('search') ?? '',
    status:           (p.get('status')      as TicketFilters['status'])      ?? '',
    priority:         (p.get('priority')    as TicketFilters['priority'])    ?? '',
    ticket_type:      (p.get('ticket_type') as TicketFilters['ticket_type']) ?? '',
    department:       p.get('department') ? Number(p.get('department')) : '',
    sla_breached:     p.get('sla_breached') === 'true' ? true : '',
    problem_category: p.get('problem_category') ?? '',
    page:             p.get('page') ? Number(p.get('page')) : 1,
  };
}

export function TicketListPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);

  const filters = filtersFromParams(searchParams);
  const page = filters.page ?? 1;

  const updateFilter = useCallback((partial: Partial<TicketFilters>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      // reset to page 1 on any filter change
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

  const canCreate = user?.role !== 'MEMBER';

  return (
    <div className="flex flex-col h-[calc(100vh-104px)]">
      <PageHeader
        title="All Tickets"
        subtitle={data ? `${data.count.toLocaleString()} tickets` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
            {canCreate && (
              <Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />} data-testid="create-ticket-btn">
                New Ticket
              </Button>
            )}
          </div>
        }
      />

      <div className="mb-4">
        <TicketFiltersBar filters={filters} onChange={updateFilter} />
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-card flex flex-col min-h-0 flex-1">
        {/* Table header */}
        <div className="grid gap-3 px-4 py-2.5 border-b border-surface-border bg-surface-secondary text-[11px] font-semibold text-text-muted uppercase tracking-widest flex-shrink-0"
          style={{ gridTemplateColumns: '2fr 110px 90px 170px 130px 90px' }}>
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
          <EmptyState
            title="No tickets found"
            description="Try adjusting your filters or create a new ticket."
            action={canCreate
              ? <Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />}>New Ticket</Button>
              : undefined
            }
          />
        )}

        {!isLoading && !isError && tickets.length > 0 && (
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
            {tickets.map(t => (
              <button
                key={t.id}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className={[
                  'w-full grid gap-3 px-4 border-b border-surface-border items-center text-left',
                  'hover:bg-surface-secondary transition-colors group',
                  t.sla_breached ? 'border-l-2 border-red-400 pl-[14px]' : '',
                ].join(' ')}
                style={{ gridTemplateColumns: '2fr 110px 90px 170px 130px 90px', minHeight: 64 }}
                data-testid={`ticket-row-${t.id}`}
              >
                <TicketRow ticket={t} />
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

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <div className="w-full grid gap-3 items-center" style={{ gridTemplateColumns: '2fr 110px 90px 170px 130px 90px' }}>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-mono font-semibold text-text-muted">{ticket.ticket_number}</span>
          {ticket.sla_breached && (
            <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wider">SLA</span>
          )}
          <span className={`text-[10px] capitalize px-1.5 py-0.5 rounded font-semibold ${
            ticket.ticket_type === 'insurance'
              ? 'bg-brand-purple-faint text-brand-purple'
              : 'bg-surface-tertiary text-text-secondary'
          }`}>
            {ticket.ticket_type}
          </span>
        </div>
        <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-purple transition-colors leading-tight">
          {ticket.subject}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] text-text-muted truncate">{ticket.department.name}</span>
          <span className="flex items-center gap-0.5 text-[11px] text-text-muted">
            <MessageSquare className="h-3 w-3" aria-hidden="true" /> {ticket.comment_count}
          </span>
          {ticket.attachment_count > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-text-muted">
              <Paperclip className="h-3 w-3" aria-hidden="true" /> {ticket.attachment_count}
            </span>
          )}
        </div>
      </div>
      <StatusBadge status={ticket.status} size="sm" />
      <PriorityBadge priority={ticket.priority} size="sm" />
      <SLAIndicator deadline={ticket.sla_deadline} breached={ticket.sla_breached} size="sm" />
      <div>
        {ticket.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar name={ticket.assignee.full_name} size="xs" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate leading-tight">{ticket.assignee.first_name}</p>
              <p className="text-[10px] text-text-muted">{ticket.assignee.last_name}</p>
            </div>
          </div>
        ) : (
          <span className="text-xs text-text-muted italic">Unassigned</span>
        )}
      </div>
      <span className="text-xs text-text-muted whitespace-nowrap">{formatRelative(ticket.updated_at)}</span>
    </div>
  );
}
