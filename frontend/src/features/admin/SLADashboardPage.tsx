import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { PageHeader } from '@/layout/PageHeader';
import { PriorityBadge, Avatar, Skeleton, EmptyState, StatusBadge } from '@/design-system';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import { formatRelative, formatDateTime } from '@/utils';
import { differenceInMinutes, isPast } from 'date-fns';

export function SLADashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useTickets({ page_size: 300 });
  const tickets = data?.results ?? [];

  const breached = tickets.filter((t) => t.sla_breached && !['closed', 'resolved'].includes(t.status));
  const atRisk = tickets.filter((t) => {
    if (t.sla_breached || ['closed', 'resolved'].includes(t.status)) return false;
    const diff = differenceInMinutes(new Date(t.sla_deadline), new Date());
    return diff > 0 && diff <= 60;
  });
  const healthy = tickets.filter(
    (t) => !t.sla_breached && !['closed', 'resolved'].includes(t.status)
      && differenceInMinutes(new Date(t.sla_deadline), new Date()) > 60
  );

  const breachRate = tickets.length > 0
    ? ((breached.length / tickets.length) * 100).toFixed(1)
    : '0.0';

  const statCards = [
    { label: 'SLA Breached', value: breached.length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'At Risk (< 1h)', value: atRisk.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Healthy', value: healthy.length, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Breach Rate', value: `${breachRate}%`, icon: TrendingUp, color: 'text-text-secondary', bg: 'bg-surface-tertiary', border: 'border-surface-border' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="SLA Dashboard"
        subtitle="Real-time SLA status across all active tickets"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) =>
          isLoading ? (
            <Skeleton key={label} className="h-24 rounded-2xl" />
          ) : (
            <div key={label} className={`bg-white rounded-2xl border shadow-card p-5 flex items-center gap-4 ${border}`}>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
              </div>
              <div>
                <p className={`text-2xl font-bold tabular-nums ${color === 'text-text-secondary' ? 'text-text-primary' : color}`}>{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Breached tickets */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-card">
        <div className="px-5 py-4 border-b border-red-100 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary">Breached Tickets</h2>
          <span className="ml-auto text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {breached.length}
          </span>
        </div>
        <TicketTable tickets={breached} isLoading={isLoading} onNavigate={(id) => navigate(`/tickets/${id}`)} empty="No breached tickets — great work!" />
      </div>

      {/* At risk */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-card">
        <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary">At Risk — Less than 1 hour remaining</h2>
          <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            {atRisk.length}
          </span>
        </div>
        <TicketTable tickets={atRisk} isLoading={isLoading} onNavigate={(id) => navigate(`/tickets/${id}`)} empty="No tickets at risk right now" />
      </div>
    </div>
  );
}

import type { Ticket } from '@/types';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  onNavigate: (id: number) => void;
  empty: string;
}

function TicketTable({ tickets, isLoading, onNavigate, empty }: TicketTableProps) {
  if (isLoading) return <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>;
  if (tickets.length === 0) return <EmptyState title={empty} />;

  return (
    <div>
      <div className="grid grid-cols-[1fr_100px_150px_120px_90px_36px] gap-4 px-5 py-2.5 bg-surface-secondary border-b border-surface-border text-xs font-semibold text-text-muted uppercase tracking-wide">
        <span>Ticket</span><span>Priority</span><span>SLA Status</span><span>Assignee</span><span>Status</span><span></span>
      </div>
      {tickets.map((t) => (
        <button
          key={t.id}
          onClick={() => onNavigate(t.id)}
          className="w-full grid grid-cols-[1fr_100px_150px_120px_90px_36px] gap-4 px-5 py-3 border-b border-surface-border last:border-0 hover:bg-surface-secondary transition-colors text-left items-center group"
        >
          <div className="min-w-0">
            <p className="text-xs font-mono text-text-muted">{t.ticket_number}</p>
            <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand-purple transition-colors">{t.subject}</p>
            <p className="text-xs text-text-muted">{t.department.name}</p>
          </div>
          <PriorityBadge priority={t.priority} size="sm" />
          <SLAIndicator deadline={t.sla_deadline} breached={t.sla_breached} size="sm" />
          <div>
            {t.assignee ? (
              <div className="flex items-center gap-1.5">
                <Avatar name={t.assignee.full_name} size="xs" />
                <span className="text-xs text-text-secondary truncate">{t.assignee.first_name}</span>
              </div>
            ) : (
              <span className="text-xs text-text-muted">Unassigned</span>
            )}
          </div>
          <StatusBadge status={t.status} size="sm" />
          <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-brand-purple transition-colors" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
