import { useNavigate } from 'react-router-dom';
import { MessageSquare, Paperclip, ChevronRight } from 'lucide-react';
import { StatusBadge, PriorityBadge, Avatar, EmptyState, TicketRowSkeleton } from '@/design-system';
import { SLAIndicator } from './SLAIndicator';
import { formatRelative } from '@/utils';
import type { Ticket } from '@/types';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  columns?: ('number' | 'subject' | 'status' | 'priority' | 'sla' | 'assignee' | 'dept' | 'created' | 'updated' | 'actions')[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  onTicketClick?: (ticket: Ticket) => void;
  renderRowActions?: (ticket: Ticket) => React.ReactNode;
  highlightBreached?: boolean;
}

const DEFAULT_COLS: TicketTableProps['columns'] = ['subject', 'status', 'priority', 'sla', 'assignee', 'updated'];

export function TicketTable({
  tickets,
  isLoading = false,
  columns = DEFAULT_COLS,
  emptyTitle = 'No tickets found',
  emptyDescription,
  emptyAction,
  onTicketClick,
  renderRowActions,
  highlightBreached = true,
}: TicketTableProps) {
  const navigate = useNavigate();
  const handleClick = (t: Ticket) => onTicketClick ? onTicketClick(t) : navigate(`/tickets/${t.id}`);

  const hasCol = (c: NonNullable<TicketTableProps['columns']>[number]) => columns?.includes(c) ?? true;

  // Build grid template
  const colDefs: string[] = [];
  if (hasCol('number'))  colDefs.push('80px');
  if (hasCol('subject')) colDefs.push('1fr');
  if (hasCol('dept'))    colDefs.push('120px');
  if (hasCol('status'))  colDefs.push('110px');
  if (hasCol('priority'))colDefs.push('90px');
  if (hasCol('sla'))     colDefs.push('160px');
  if (hasCol('assignee'))colDefs.push('130px');
  if (hasCol('created')) colDefs.push('90px');
  if (hasCol('updated')) colDefs.push('90px');
  if (renderRowActions)  colDefs.push('auto');
  colDefs.push('20px'); // chevron

  const gridStyle = { gridTemplateColumns: colDefs.join(' ') };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="grid gap-3 px-4 py-2.5 border-b border-surface-border bg-surface-secondary text-[11px] font-semibold text-text-muted uppercase tracking-widest flex-shrink-0"
        style={gridStyle}
      >
        {hasCol('number')   && <span>#</span>}
        {hasCol('subject')  && <span>Subject</span>}
        {hasCol('dept')     && <span>Department</span>}
        {hasCol('status')   && <span>Status</span>}
        {hasCol('priority') && <span>Priority</span>}
        {hasCol('sla')      && <span>SLA</span>}
        {hasCol('assignee') && <span>Assignee</span>}
        {hasCol('created')  && <span>Created</span>}
        {hasCol('updated')  && <span>Updated</span>}
        {renderRowActions   && <span></span>}
        <span></span>
      </div>

      {/* Rows */}
      {isLoading && (
        <div>{Array.from({ length: 6 }).map((_, i) => <TicketRowSkeleton key={i} />)}</div>
      )}

      {!isLoading && tickets.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      )}

      {!isLoading && tickets.length > 0 && (
        <div className="divide-y divide-surface-border">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={[
                'grid gap-3 px-4 py-3 items-center group transition-all duration-100',
                'hover:bg-surface-secondary cursor-pointer',
                highlightBreached && ticket.sla_breached ? 'border-l-2 border-red-400 pl-[14px]' : '',
              ].join(' ')}
              style={gridStyle}
              onClick={() => handleClick(ticket)}
              role="row"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(ticket); }}
              data-testid={`ticket-row-${ticket.id}`}
            >
              {hasCol('number') && (
                <span className="text-[11px] font-mono font-semibold text-text-muted">{ticket.ticket_number}</span>
              )}

              {hasCol('subject') && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {!hasCol('number') && (
                      <span className="text-[10px] font-mono font-semibold text-text-muted flex-shrink-0">{ticket.ticket_number}</span>
                    )}
                    {ticket.sla_breached && (
                      <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-red-100 text-red-600">SLA</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-purple transition-colors leading-snug">
                    {ticket.subject}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {!hasCol('dept') && (
                      <span className="text-[11px] text-text-muted">{ticket.department.name}</span>
                    )}
                    <span className="flex items-center gap-0.5 text-[11px] text-text-muted">
                      <MessageSquare className="h-3 w-3" aria-hidden="true" />
                      {ticket.comment_count}
                    </span>
                    {ticket.attachment_count > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px] text-text-muted">
                        <Paperclip className="h-3 w-3" aria-hidden="true" />
                        {ticket.attachment_count}
                      </span>
                    )}
                    <span className={`text-[11px] capitalize px-1.5 py-0.5 rounded font-medium ${
                      ticket.ticket_type === 'insurance'
                        ? 'bg-brand-purple-faint text-brand-purple'
                        : 'bg-surface-tertiary text-text-secondary'
                    }`}>
                      {ticket.ticket_type}
                    </span>
                  </div>
                </div>
              )}

              {hasCol('dept') && (
                <span className="text-xs text-text-secondary truncate">{ticket.department.name}</span>
              )}

              {hasCol('status') && <StatusBadge status={ticket.status} size="sm" />}
              {hasCol('priority') && <PriorityBadge priority={ticket.priority} size="sm" />}
              {hasCol('sla') && (
                <SLAIndicator deadline={ticket.sla_deadline} breached={ticket.sla_breached} size="sm" />
              )}

              {hasCol('assignee') && (
                <div>
                  {ticket.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={ticket.assignee.full_name} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate leading-tight">{ticket.assignee.first_name}</p>
                        <p className="text-[10px] text-text-muted truncate leading-tight">{ticket.assignee.last_name}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted italic">Unassigned</span>
                  )}
                </div>
              )}

              {hasCol('created') && (
                <span className="text-xs text-text-muted whitespace-nowrap">{formatRelative(ticket.created_at)}</span>
              )}
              {hasCol('updated') && (
                <span className="text-xs text-text-muted whitespace-nowrap">{formatRelative(ticket.updated_at)}</span>
              )}

              {renderRowActions && (
                <div onClick={(e) => e.stopPropagation()}>{renderRowActions(ticket)}</div>
              )}

              <ChevronRight className="h-4 w-4 text-text-muted/40 group-hover:text-brand-purple transition-colors" aria-hidden="true" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
