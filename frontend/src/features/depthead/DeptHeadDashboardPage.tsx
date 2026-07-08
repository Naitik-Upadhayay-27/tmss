import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Clock, Users, CheckCircle, AlertTriangle, UserPlus, ArrowUpRight, Activity, Shield } from 'lucide-react';
import { isToday } from 'date-fns';
import { useTickets } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Avatar, PriorityBadge, StatusBadge } from '@/design-system';
import { TicketTable } from '@/features/tickets/components/TicketTable';
import { AssignModal } from '@/features/tickets/modals/AssignModal';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import type { Ticket as TicketType } from '@/types';

export function DeptHeadDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [assignTarget, setAssignTarget] = useState<TicketType | null>(null);

  const { data, isLoading } = useTickets({ department: user?.department?.id, page_size: 300 });
  const tickets = data?.results ?? [];

  const stats = {
    total:       tickets.length,
    open:        tickets.filter(t => t.status === 'open').length,
    assigned:    tickets.filter(t => t.status === 'assigned').length,
    inProgress:  tickets.filter(t => t.status === 'in_progress').length,
    resolvedToday: tickets.filter(t => t.resolved_at && isToday(new Date(t.resolved_at))).length,
    breached:    tickets.filter(t => t.sla_breached).length,
    escalated:   tickets.filter(t => t.status === 'escalated').length,
    unassigned:  tickets.filter(t => !t.assignee && t.status === 'open').length,
  };

  const breachRate = tickets.length > 0 ? ((stats.breached / tickets.length) * 100).toFixed(1) : '0.0';

  // Agent workload table
  const agentMap = new Map<number, {
    name: string; fullName: string;
    total: number; inProgress: number; resolved: number; breached: number;
  }>();
  tickets.forEach(t => {
    if (!t.assignee) return;
    const id = t.assignee.id;
    if (!agentMap.has(id)) agentMap.set(id, { name: t.assignee.first_name, fullName: t.assignee.full_name, total: 0, inProgress: 0, resolved: 0, breached: 0 });
    const e = agentMap.get(id)!;
    e.total++;
    if (t.status === 'in_progress') e.inProgress++;
    if (['resolved','closed'].includes(t.status)) e.resolved++;
    if (t.sla_breached) e.breached++;
  });
  const agentRows = Array.from(agentMap.values()).sort((a, b) => b.total - a.total);

  const unassigned = tickets.filter(t => !t.assignee && t.status === 'open').slice(0, 6);
  const breachedTickets = tickets.filter(t => t.sla_breached && !['closed'].includes(t.status)).slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Overview"
        subtitle={`${user?.department?.name ?? 'Department'} · ${tickets.length} total tickets`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/head/tickets')}>
              All Tickets
            </Button>
          </div>
        }
      />

      {/* Stats — clickable slabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none">
        {[
          { label: 'Total',          value: stats.total,          icon: Ticket,        iconColor: 'text-brand-purple', iconBg: 'bg-brand-purple-faint', valueColor: 'text-brand-purple', loading: isLoading, onClick: () => navigate('/head/tickets') },
          { label: 'Open',           value: stats.open,           icon: Clock,         iconColor: 'text-blue-600',     iconBg: 'bg-blue-50',            valueColor: 'text-blue-600',    loading: isLoading, onClick: () => navigate('/head/tickets?status=open') },
          { label: 'In Progress',    value: stats.inProgress,     icon: Activity,      iconColor: 'text-indigo-600',   iconBg: 'bg-indigo-50',          valueColor: 'text-indigo-600',  loading: isLoading, onClick: () => navigate('/head/tickets?status=in_progress') },
          { label: 'Resolved Today', value: stats.resolvedToday,  icon: CheckCircle,   iconColor: 'text-green-600',    iconBg: 'bg-green-50',           valueColor: 'text-green-600',   loading: isLoading, onClick: () => navigate('/head/tickets?status=resolved') },
          { label: 'SLA Breached',   value: stats.breached,       icon: AlertTriangle, iconColor: 'text-red-600',      iconBg: 'bg-red-50',             valueColor: 'text-red-600',     loading: isLoading, onClick: () => navigate('/head/tickets?sla_breached=true') },
          { label: 'Team Members',   value: agentRows.length,     icon: Users,         iconColor: 'text-brand-purple', iconBg: 'bg-brand-purple-faint', valueColor: 'text-brand-purple', loading: isLoading, onClick: () => navigate('/reports') },
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

      {/* Two-column: agent workload + unassigned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Agent workload */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border">
            <h2 className="text-sm font-bold text-text-primary">Team Workload</h2>
            <p className="text-xs text-text-muted mt-0.5">Active assignments per member</p>
          </div>
          {agentRows.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">No assignments yet</div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_60px_70px_60px_60px] gap-3 px-5 py-2.5 bg-surface-secondary border-b border-surface-border text-[11px] font-semibold text-text-muted uppercase tracking-widest">
                <span>Member</span><span className="text-right">Total</span><span className="text-right">Active</span><span className="text-right">Done</span><span className="text-right">SLA</span>
              </div>
              <div className="divide-y divide-surface-border">
                {agentRows.map(agent => (
                  <div key={agent.fullName} className="grid grid-cols-[1fr_60px_70px_60px_60px] gap-3 px-5 py-3 items-center hover:bg-surface-secondary transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={agent.fullName} size="sm" />
                      <span className="text-sm font-semibold text-text-primary truncate">{agent.fullName}</span>
                    </div>
                    <span className="text-right text-sm font-bold text-text-primary tabular-nums">{agent.total}</span>
                    <span className="text-right text-sm text-blue-600 font-semibold tabular-nums">{agent.inProgress}</span>
                    <span className="text-right text-sm text-green-600 font-semibold tabular-nums">{agent.resolved}</span>
                    <span className={`text-right text-sm font-bold tabular-nums ${agent.breached > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {agent.breached}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Unassigned */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-text-primary">Unassigned Tickets</h2>
              <p className="text-xs text-text-muted mt-0.5">{stats.unassigned} need assignment</p>
            </div>
            {stats.unassigned > 6 && (
              <button onClick={() => navigate('/head/tickets?status=open')} className="text-xs text-brand-purple font-semibold">View all →</button>
            )}
          </div>
          {unassigned.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-text-primary">All tickets assigned</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {unassigned.map(ticket => (
                <div key={ticket.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-secondary transition-colors">
                  <button onClick={() => navigate(`/tickets/${ticket.id}`)} className="flex-1 min-w-0 text-left">
                    <p className="text-[10px] font-mono text-text-muted">{ticket.ticket_number}</p>
                    <p className="text-sm font-semibold text-text-primary truncate hover:text-brand-purple transition-colors">{ticket.subject}</p>
                    <SLAIndicator deadline={ticket.sla_deadline} breached={ticket.sla_breached} size="sm" />
                  </button>
                  <PriorityBadge priority={ticket.priority} size="sm" />
                  <Button variant="secondary" size="sm" onClick={() => setAssignTarget(ticket)}
                    leftIcon={<UserPlus className="h-3.5 w-3.5" />} data-testid={`assign-${ticket.id}`}>
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SLA Breached */}
      {breachedTickets.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 bg-red-50/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <h2 className="text-sm font-bold text-red-700">SLA Breached — Escalate Immediately</h2>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">{stats.breached} total</span>
          </div>
          <TicketTable
            tickets={breachedTickets}
            columns={['subject','status','priority','sla','assignee']}
            highlightBreached={false}
          />
        </div>
      )}

      {assignTarget && (
        <AssignModal ticket={assignTarget} isOpen onClose={() => setAssignTarget(null)} />
      )}
    </div>
  );
}
