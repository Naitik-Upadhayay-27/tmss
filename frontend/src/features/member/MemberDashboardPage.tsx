import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, CheckCircle, AlertTriangle,
  Play, ArrowUpRight, Zap,
} from 'lucide-react';
import { isToday } from 'date-fns';
import { useTickets, useChangeTicketStatus } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { StatCard, Button, PriorityBadge, StatusBadge, Avatar } from '@/design-system';
import { SLAIndicator } from '@/features/tickets/components/SLAIndicator';
import { TicketTable } from '@/features/tickets/components/TicketTable';
import { ResolveModal } from '@/features/tickets/modals/ResolveModal';
import toast from 'react-hot-toast';
import type { Ticket } from '@/types';
import { differenceInMinutes } from 'date-fns';

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export function MemberDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [resolveTicket, setResolveTicket] = useState<Ticket | null>(null);
  const { mutate: changeStatus } = useChangeTicketStatus();

  const { data, isLoading } = useTickets({ assignee: user?.id, page_size: 200 });
  const tickets = data?.results ?? [];

  const active = tickets.filter(t => !['resolved','closed'].includes(t.status));
  const resolved = tickets.filter(t => ['resolved','closed'].includes(t.status));
  const resolvedToday = resolved.filter(t => t.resolved_at && isToday(new Date(t.resolved_at)));
  const atRisk = active.filter(t => {
    if (t.sla_breached) return true;
    const mins = differenceInMinutes(new Date(t.sla_deadline), new Date());
    return mins > 0 && mins <= 60;
  });

  const workQueue = [...active].sort((a, b) => {
    if (a.sla_breached !== b.sla_breached) return a.sla_breached ? -1 : 1;
    return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
  });

  const handleStart = (ticket: Ticket) => {
    changeStatus({ id: ticket.id, status: 'in_progress' }, {
      onSuccess: () => toast.success(`Started ${ticket.ticket_number}`),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Work Queue"
        subtitle={`${user?.first_name} · ${active.length} active · ${atRisk.length > 0 ? `${atRisk.length} at risk` : 'All SLAs healthy'}`}
        actions={
          <button onClick={() => navigate('/member/tickets')} className="text-sm text-brand-purple hover:text-brand-purple-light font-semibold flex items-center gap-1 transition-colors">
            All my tickets <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      />

      {/* Stats — clickable slabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none">
        {[
          { label: 'Active Tickets', value: active.length, icon: ClipboardList, iconColor: 'text-brand-purple', iconBg: 'bg-brand-purple-faint', valueColor: 'text-brand-purple', loading: isLoading, onClick: () => navigate('/member/tickets') },
          { label: 'Assigned', value: tickets.filter(t=>t.status==='assigned').length, icon: Clock, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', valueColor: 'text-blue-600', loading: isLoading, onClick: () => navigate('/member/tickets?status=assigned') },
          { label: 'In Progress', value: tickets.filter(t=>t.status==='in_progress').length, icon: Clock, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50', valueColor: 'text-indigo-600', loading: isLoading, onClick: () => navigate('/member/tickets?status=in_progress') },
          { label: 'Resolved Today', value: resolvedToday.length, icon: CheckCircle, iconColor: 'text-green-600', iconBg: 'bg-green-50', valueColor: 'text-green-600', loading: isLoading, onClick: () => navigate('/member/tickets?status=resolved') },
          { label: 'SLA at Risk', value: atRisk.length, icon: AlertTriangle, iconColor: 'text-red-600', iconBg: 'bg-red-50', valueColor: 'text-red-600', loading: isLoading, onClick: () => navigate('/member/tickets?sla_breached=true') },
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

      {/* Priority queue — the main action surface */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Priority Queue</h2>
            <p className="text-xs text-text-muted mt-0.5">Sorted by SLA urgency then priority</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Zap className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
            <span>{workQueue.length} pending</span>
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-surface-border">
            {Array.from({length:5}).map((_,i)=>(
              <div key={i} className="px-5 py-4 flex gap-4 items-center">
                <div className="h-4 bg-surface-tertiary rounded animate-pulse flex-1" />
              </div>
            ))}
          </div>
        ) : workQueue.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-base font-bold text-text-primary">Queue clear</p>
            <p className="text-sm text-text-muted mt-1">All your tickets are resolved. Great work!</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_90px_160px_100px_120px_140px] gap-3 px-5 py-2.5 bg-surface-secondary border-b border-surface-border text-[11px] font-semibold text-text-muted uppercase tracking-widest">
              <span>Ticket</span><span>Priority</span><span>SLA Status</span><span>Status</span><span>Department</span><span>Action</span>
            </div>
            <div className="divide-y divide-surface-border">
              {workQueue.map(ticket => (
                <div
                  key={ticket.id}
                  className={`grid grid-cols-[1fr_90px_160px_100px_120px_140px] gap-3 px-5 py-3.5 items-center transition-colors hover:bg-surface-secondary ${
                    ticket.sla_breached ? 'border-l-2 border-red-400 pl-[18px]' : ''
                  }`}
                >
                  <button onClick={() => navigate(`/tickets/${ticket.id}`)} className="text-left min-w-0 group">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-semibold text-text-muted">{ticket.ticket_number}</span>
                      {ticket.sla_breached && <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1 rounded uppercase">SLA</span>}
                    </div>
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-purple transition-colors">{ticket.subject}</p>
                  </button>
                  <PriorityBadge priority={ticket.priority} size="sm" />
                  <SLAIndicator deadline={ticket.sla_deadline} breached={ticket.sla_breached} size="sm" />
                  <StatusBadge status={ticket.status} size="sm" />
                  <span className="text-xs text-text-secondary truncate">{ticket.department.name}</span>
                  <div>
                    {ticket.status === 'assigned' && (
                      <Button variant="primary" size="sm" onClick={() => handleStart(ticket)}
                        leftIcon={<Play className="h-3.5 w-3.5" />} data-testid={`start-${ticket.id}`}>
                        Start Work
                      </Button>
                    )}
                    {ticket.status === 'in_progress' && (
                      <Button variant="secondary" size="sm" onClick={() => setResolveTicket(ticket)}
                        leftIcon={<CheckCircle className="h-3.5 w-3.5" />} data-testid={`resolve-${ticket.id}`}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recently resolved */}
      {resolved.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
            <h2 className="text-sm font-bold text-text-primary">Recently Resolved</h2>
            <button onClick={() => navigate('/member/tickets?status=resolved')} className="text-xs text-brand-purple font-semibold">
              View all →
            </button>
          </div>
          <TicketTable
            tickets={resolved.slice(0, 5)}
            columns={['subject', 'priority', 'status', 'updated']}
          />
        </div>
      )}

      {resolveTicket && (
        <ResolveModal ticket={resolveTicket} isOpen onClose={() => setResolveTicket(null)} />
      )}
    </div>
  );
}
