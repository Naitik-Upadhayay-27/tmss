import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Ticket, Clock, CheckCircle, AlertTriangle, ArrowUpRight, Send } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, StatCard, StatusBadge } from '@/design-system';
import { TicketTable } from '@/features/tickets/components/TicketTable';
import { CreateTicketModal } from '@/features/tickets/CreateTicketModal';
import { formatRelative } from '@/utils';

export function AgentDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useTickets({ created_by: user?.id, page_size: 200 });
  const tickets = data?.results ?? [];

  const stats = {
    total:      tickets.length,
    open:       tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => ['in_progress','assigned'].includes(t.status)).length,
    resolved:   tickets.filter(t => ['resolved','closed'].includes(t.status)).length,
    breached:   tickets.filter(t => t.sla_breached).length,
  };

  // Status breakdown for mini table
  const statusBreakdown = [
    { status: 'open' as const,        count: stats.open },
    { status: 'assigned' as const,    count: tickets.filter(t => t.status === 'assigned').length },
    { status: 'in_progress' as const, count: stats.inProgress },
    { status: 'resolved' as const,    count: stats.resolved },
    { status: 'escalated' as const,   count: tickets.filter(t => t.status === 'escalated').length },
  ].filter(s => s.count > 0);

  const recent = [...tickets]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  const critical = tickets.filter(t => t.priority === 'critical' && !['resolved','closed'].includes(t.status));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tickets"
        subtitle={`${user?.first_name} · ${tickets.length} total · ${stats.breached > 0 ? `${stats.breached} SLA breach${stats.breached > 1 ? 'es' : ''}` : 'All SLAs healthy'}`}
        actions={
          <Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />} data-testid="create-ticket-btn">
            New Ticket
          </Button>
        }
      />

      {/* Stats — clickable slabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none">
        {[
          { label: 'Total Tickets', value: stats.total, icon: Ticket, iconColor: 'text-brand-purple', iconBg: 'bg-brand-purple-faint', valueColor: 'text-brand-purple', loading: isLoading, onClick: () => navigate('/agent/tickets') },
          { label: 'Open', value: stats.open, icon: Clock, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', valueColor: 'text-blue-600', loading: isLoading, onClick: () => navigate('/agent/tickets?status=open') },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50', valueColor: 'text-indigo-600', loading: isLoading, onClick: () => navigate('/agent/tickets?status=in_progress') },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, iconColor: 'text-green-600', iconBg: 'bg-green-50', valueColor: 'text-green-600', loading: isLoading, onClick: () => navigate('/agent/tickets?status=resolved') },
          { label: 'SLA Breached', value: stats.breached, icon: AlertTriangle, iconColor: 'text-red-600', iconBg: 'bg-red-50', valueColor: 'text-red-600', loading: isLoading, onClick: () => navigate('/agent/tickets?sla_breached=true') },
        ].map(chip => (
          chip.loading
            ? <div key={chip.label} className="h-[68px] w-[148px] rounded-xl bg-surface-tertiary animate-pulse flex-shrink-0" />
            : <button
                key={chip.label}
                onClick={chip.onClick}
                className="flex-shrink-0 flex items-center gap-3 bg-white border border-surface-border rounded-xl px-3.5 py-3 h-[68px] w-[148px] hover:border-brand-purple/40 hover:bg-surface-secondary/50 transition-all cursor-pointer group shadow-card"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${chip.iconBg} group-hover:scale-105 transition-transform`}>
                  <chip.icon className={`h-4 w-4 ${chip.iconColor}`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[22px] font-extrabold leading-none tabular-nums ${chip.valueColor}`}>{chip.value}</p>
                  <p className="text-[11px] font-semibold text-text-secondary mt-0.5 leading-tight truncate group-hover:text-text-primary transition-colors">{chip.label}</p>
                </div>
              </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5">
          <h2 className="text-sm font-bold text-text-primary mb-4">Breakdown by Status</h2>
          {isLoading ? (
            <div className="space-y-3">{Array.from({length:4}).map((_,i)=><div key={i} className="h-8 bg-surface-tertiary rounded-lg animate-pulse"/>)}</div>
          ) : statusBreakdown.length === 0 ? (
            <p className="text-sm text-text-muted">No tickets yet.</p>
          ) : (
            <div className="space-y-2">
              {statusBreakdown.map(({ status, count }) => (
                <button
                  key={status}
                  onClick={() => navigate(`/agent/tickets?status=${status}`)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-secondary transition-colors group"
                >
                  <StatusBadge status={status} size="sm" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary tabular-nums">{count}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-text-muted group-hover:text-brand-purple transition-colors" aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-surface-border">
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border-2 border-dashed border-surface-border-strong text-sm font-semibold text-text-muted hover:border-brand-orange hover:text-brand-orange transition-all"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Create new ticket
            </button>
          </div>
        </div>

        {/* Critical tickets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
            <h2 className="text-sm font-bold text-text-primary">
              Critical Priority
              {critical.length > 0 && (
                <span className="ml-2 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">{critical.length}</span>
              )}
            </h2>
            <button onClick={() => navigate('/agent/tickets?priority=critical')} className="text-xs text-brand-purple hover:text-brand-purple-light font-semibold">
              View all →
            </button>
          </div>
          {critical.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-text-primary">No critical tickets</p>
              <p className="text-xs text-text-muted mt-0.5">You're all good here.</p>
            </div>
          ) : (
            <TicketTable tickets={critical.slice(0,5)} columns={['subject','status','sla','updated']} />
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <h2 className="text-sm font-bold text-text-primary">Recent Activity</h2>
          <button onClick={() => navigate('/agent/tickets')} className="text-xs text-brand-purple hover:text-brand-purple-light font-semibold flex items-center gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <TicketTable
          tickets={recent}
          isLoading={isLoading}
          columns={['subject','status','priority','sla','updated']}
          emptyTitle="No tickets yet"
          emptyDescription="Create your first ticket to get started."
          emptyAction={<Button variant="orange" size="sm" onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4"/>}>New Ticket</Button>}
        />
      </div>

      <CreateTicketModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
