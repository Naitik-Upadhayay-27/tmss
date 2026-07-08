import { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useUsers } from '@/hooks/useUsers';
import { useDepartments } from '@/hooks/useDepartments';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { Avatar, StatusBadge, PriorityBadge, Skeleton } from '@/design-system';
import { ChevronRight, Building2, Users, User, CheckCircle, Clock, AlertTriangle, Ticket, TrendingUp } from 'lucide-react';
import { formatRelative } from '@/utils';
import type { User as UserType, Department } from '@/types';

type SelectionLevel = 'overview' | 'department' | 'hod' | 'member';

interface Selection {
  level: SelectionLevel;
  dept?: Department;
  user?: UserType;
}

// ── Metric pill ───────────────────────────────────────────────────────────────
function MetricPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col">
      <span className={`text-xl font-extrabold tabular-nums ${color}`}>{value}</span>
      <span className="text-[11px] text-text-muted mt-0.5">{label}</span>
    </div>
  );
}

// ── Health bar ────────────────────────────────────────────────────────────────
function HealthBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = pct > 80 ? 'bg-green-500' : pct > 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-bold text-text-muted w-8 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

// ── SLA badge ─────────────────────────────────────────────────────────────────
function SlaRateBadge({ rate }: { rate: number }) {
  const color = rate >= 90 ? 'bg-green-50 text-green-700 border-green-200' : rate >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{rate}%</span>;
}

export function AgentPerformanceTab() {
  const [selection, setSelection] = useState<Selection>({ level: 'overview' });
  const { user: currentUser } = useAuthStore();

  const { data: ticketData, isLoading: ticketsLoading } = useTickets({ page_size: 500 });
  const { data: userData } = useUsers();
  const { data: deptData } = useDepartments();

  const tickets = ticketData?.results ?? [];
  const users   = userData?.results ?? [];
  const depts   = deptData?.results ?? [];

  // Filter data based on user role
  const filteredTickets = currentUser?.role === 'DEPT_HEAD' 
    ? tickets.filter(t => t.department.id === currentUser.department?.id)
    : tickets;
  
  const filteredDepts = currentUser?.role === 'DEPT_HEAD'
    ? depts.filter(d => d.id === currentUser.department?.id)
    : depts;
  
  const filteredUsers = currentUser?.role === 'DEPT_HEAD'
    ? users.filter(u => u.department?.id === currentUser.department?.id)
    : users;

  // Compute per-dept stats using filtered data
  const deptStats = filteredDepts.map(d => {
    const dTickets = filteredTickets.filter(t => t.department.id === d.id);
    const resolved = dTickets.filter(t => ['resolved','closed'].includes(t.status));
    const breached  = dTickets.filter(t => t.sla_breached);
    const slaRate   = dTickets.length > 0 ? Math.round(((dTickets.length - breached.length) / dTickets.length) * 100) : 100;
    const members   = filteredUsers.filter(u => u.department?.id === d.id && u.role === 'MEMBER');
    const hod       = filteredUsers.find(u => u.department?.id === d.id && u.role === 'DEPT_HEAD');
    return { dept: d, total: dTickets.length, open: dTickets.filter(t=>t.status==='open').length, resolved: resolved.length, breached: breached.length, slaRate, members, hod };
  }).filter(d => d.total > 0 || currentUser?.role === 'DEPT_HEAD'); // Show dept even if no tickets for dept heads

  // Compute per-user stats using filtered tickets
  const userStats = (targetUser: UserType) => {
    const ut = filteredTickets.filter(t => t.assignee?.id === targetUser.id);
    const resolved = ut.filter(t => ['resolved','closed'].includes(t.status));
    const breached  = ut.filter(t => t.sla_breached);
    const slaRate   = ut.length > 0 ? Math.round(((ut.length - breached.length) / ut.length) * 100) : 100;
    return { total: ut.length, open: ut.filter(t=>t.status==='open').length, inProgress: ut.filter(t=>t.status==='in_progress').length, resolved: resolved.length, breached: breached.length, slaRate, tickets: ut };
  };

  // Overall stats using filtered data
  const overallStats = {
    totalAgents: filteredUsers.filter(u => u.role === 'MEMBER').length,
    totalHods: filteredUsers.filter(u => u.role === 'DEPT_HEAD').length,
    totalTickets: filteredTickets.length,
    resolved: filteredTickets.filter(t => ['resolved','closed'].includes(t.status)).length,
    breached: filteredTickets.filter(t => t.sla_breached).length,
    slaRate: filteredTickets.length > 0 ? Math.round(((filteredTickets.length - filteredTickets.filter(t=>t.sla_breached).length) / filteredTickets.length) * 100) : 100,
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-220px)] min-h-[600px]">

      {/* ── LEFT PANEL: selection tree ── */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-surface-border bg-brand-purple-faint flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" aria-hidden="true" />
          <span className="text-[11px] font-bold text-brand-purple uppercase tracking-widest">Organisation</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Overview row */}
          <button
            onClick={() => setSelection({ level: 'overview' })}
            className={`w-full flex items-center gap-2.5 px-4 py-3 border-b border-surface-border text-left transition-colors hover:bg-surface-secondary ${selection.level === 'overview' ? 'bg-brand-purple-faint border-l-2 border-l-brand-purple' : ''}`}
          >
            <div className="h-7 w-7 rounded-lg bg-brand-purple-faint flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-brand-purple" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-primary">
                {currentUser?.role === 'DEPT_HEAD' ? currentUser.department?.name || 'Department' : 'All Departments'}
              </p>
              <p className="text-[10px] text-text-muted">
                {currentUser?.role === 'DEPT_HEAD' ? 'Department overview' : 'Organisation overview'}
              </p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-text-muted flex-shrink-0" aria-hidden="true" />
          </button>

          {/* Department rows */}
          {ticketsLoading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="px-4 py-3 border-b border-surface-border"><Skeleton className="h-8" /></div>)
            : deptStats.map(ds => (
              <div key={ds.dept.id}>
                {/* Dept row */}
                <button
                  onClick={() => setSelection({ level: 'department', dept: ds.dept })}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 border-b border-surface-border text-left transition-colors hover:bg-surface-secondary ${selection.level === 'department' && selection.dept?.id === ds.dept.id ? 'bg-brand-purple-faint border-l-2 border-l-brand-purple' : ''}`}
                >
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-primary truncate">{ds.dept.name}</p>
                    <p className="text-[10px] text-text-muted">{ds.total} tickets · {ds.members.length} agents</p>
                  </div>
                  <SlaRateBadge rate={ds.slaRate} />
                </button>

                {/* HOD row (only when dept is selected) */}
                {(selection.dept?.id === ds.dept.id) && ds.hod && (
                  <button
                    onClick={() => setSelection({ level: 'hod', dept: ds.dept, user: ds.hod })}
                    className={`w-full flex items-center gap-2.5 pl-8 pr-4 py-2 border-b border-surface-border text-left transition-colors hover:bg-surface-secondary ${selection.level === 'hod' && selection.user?.id === ds.hod.id ? 'bg-violet-50 border-l-2 border-l-violet-500' : ''}`}
                  >
                    <Avatar name={ds.hod.full_name} size="xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text-primary truncate">{ds.hod.full_name}</p>
                      <p className="text-[10px] text-text-muted">Department Head</p>
                    </div>
                  </button>
                )}

                {/* Member rows */}
                {(selection.dept?.id === ds.dept.id) && ds.members.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelection({ level: 'member', dept: ds.dept, user: m })}
                    className={`w-full flex items-center gap-2.5 pl-10 pr-4 py-2 border-b border-surface-border text-left transition-colors hover:bg-surface-secondary ${selection.level === 'member' && selection.user?.id === m.id ? 'bg-green-50 border-l-2 border-l-green-500' : ''}`}
                  >
                    <Avatar name={m.full_name} size="xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text-primary truncate">{m.full_name}</p>
                      <p className="text-[10px] text-text-muted">Team Member</p>
                    </div>
                  </button>
                ))}
              </div>
            ))
          }
        </div>
      </div>

      {/* ── RIGHT PANEL: details ── */}
      <div className="flex-1 bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden flex flex-col min-w-0">
        {selection.level === 'overview' && <OverviewDetail stats={overallStats} deptStats={deptStats} isDeptHead={currentUser?.role === 'DEPT_HEAD'} currentDept={currentUser?.department} />}
        {selection.level === 'department' && selection.dept && (
          <DeptDetail ds={deptStats.find(d => d.dept.id === selection.dept!.id)!} onSelectUser={(u, isHod) => setSelection({ level: isHod ? 'hod' : 'member', dept: selection.dept, user: u })} />
        )}
        {(selection.level === 'hod' || selection.level === 'member') && selection.user && (
          <UserDetail user={selection.user} stats={userStats(selection.user)} isHod={selection.level === 'hod'} />
        )}
      </div>
    </div>
  );
}

// ── OVERVIEW panel ────────────────────────────────────────────────────────────
function OverviewDetail({ stats, deptStats, isDeptHead, currentDept }: { stats: any; deptStats: any[]; isDeptHead?: boolean; currentDept?: Department | null }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-surface-border bg-gradient-to-r from-brand-purple to-brand-purple-light flex-shrink-0">
        <h2 className="text-base font-bold text-white">
          {isDeptHead ? `${currentDept?.name || 'Department'} Overview` : 'Organisation Overview'}
        </h2>
        <p className="text-xs text-white/60 mt-0.5">
          {isDeptHead ? `${currentDept?.name || 'Your department'} team members` : 'All departments · All agents'}
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-6 divide-x divide-surface-border border-b border-surface-border flex-shrink-0">
        {[
          { label: 'Total Tickets', value: stats.totalTickets, color: 'text-brand-purple', icon: Ticket },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-600', icon: CheckCircle },
          { label: 'SLA Breached', value: stats.breached, color: 'text-red-600', icon: AlertTriangle },
          { label: 'SLA Rate', value: `${stats.slaRate}%`, color: stats.slaRate >= 90 ? 'text-green-600' : stats.slaRate >= 70 ? 'text-amber-600' : 'text-red-600', icon: TrendingUp },
          { label: 'Dept Heads', value: stats.totalHods, color: 'text-violet-600', icon: User },
          { label: 'Team Members', value: stats.totalAgents, color: 'text-indigo-600', icon: Users },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="px-5 py-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden="true" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
            </div>
            <p className={`text-2xl font-extrabold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Department breakdown table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-secondary border-b border-surface-border">
              {['Department', 'Code', 'Total', 'Open', 'Resolved', 'Breached', 'SLA Rate', 'Agents', 'HOD'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-[11px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {deptStats.map(ds => (
              <tr key={ds.dept.id} className="hover:bg-surface-secondary transition-colors">
                <td className="px-5 py-3">
                  <p className="text-sm font-bold text-text-primary">{ds.dept.name}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[10px] font-mono font-bold bg-surface-tertiary text-text-muted px-1.5 py-0.5 rounded">{ds.dept.code}</span>
                </td>
                <td className="px-5 py-3 text-sm font-bold text-text-primary tabular-nums">{ds.total}</td>
                <td className="px-5 py-3 text-sm text-blue-600 font-semibold tabular-nums">{ds.open}</td>
                <td className="px-5 py-3 text-sm text-green-600 font-semibold tabular-nums">{ds.resolved}</td>
                <td className="px-5 py-3">
                  <span className={`text-sm font-bold tabular-nums ${ds.breached > 0 ? 'text-red-600' : 'text-green-600'}`}>{ds.breached}</span>
                </td>
                <td className="px-5 py-3"><SlaRateBadge rate={ds.slaRate} /></td>
                <td className="px-5 py-3 text-sm text-text-secondary tabular-nums">{ds.members.length}</td>
                <td className="px-5 py-3">
                  {ds.hod ? (
                    <div className="flex items-center gap-1.5">
                      <Avatar name={ds.hod.full_name} size="xs" />
                      <span className="text-xs text-text-secondary truncate max-w-[100px]">{ds.hod.full_name}</span>
                    </div>
                  ) : <span className="text-xs text-text-muted italic">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── DEPARTMENT panel ──────────────────────────────────────────────────────────
function DeptDetail({ ds, onSelectUser }: { ds: any; onSelectUser: (u: UserType, isHod: boolean) => void }) {
  if (!ds) return null;
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-surface-border bg-gradient-to-r from-indigo-600 to-indigo-700 flex-shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded">{ds.dept.code}</span>
        </div>
        <h2 className="text-base font-bold text-white">{ds.dept.name}</h2>
        <p className="text-xs text-white/60 mt-0.5">{ds.members.length} team members · SLA rate {ds.slaRate}%</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-5 divide-x divide-surface-border border-b border-surface-border flex-shrink-0">
        {[
          { label: 'Total',    value: ds.total,    color: 'text-brand-purple' },
          { label: 'Open',     value: ds.open,     color: 'text-blue-600' },
          { label: 'Resolved', value: ds.resolved, color: 'text-green-600' },
          { label: 'Breached', value: ds.breached, color: ds.breached > 0 ? 'text-red-600' : 'text-green-600' },
          { label: 'SLA Rate', value: `${ds.slaRate}%`, color: ds.slaRate >= 90 ? 'text-green-600' : ds.slaRate >= 70 ? 'text-amber-600' : 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-extrabold tabular-nums mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* HOD section */}
        {ds.hod && (
          <div className="px-5 py-3 border-b border-surface-border">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Department Head</p>
            <button onClick={() => onSelectUser(ds.hod, true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-surface-border hover:border-violet-400 hover:bg-violet-50 transition-all text-left">
              <Avatar name={ds.hod.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary">{ds.hod.full_name}</p>
                <p className="text-xs text-text-muted">{ds.hod.email}</p>
              </div>
              <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">HOD</span>
              <ChevronRight className="h-4 w-4 text-text-muted flex-shrink-0" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Members table */}
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Team Members ({ds.members.length})</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border">
                {['Member', 'Total', 'Active', 'Resolved', 'SLA'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-[11px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {ds.members.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-text-muted">No team members in this department</td></tr>
              ) : ds.members.map((m: UserType) => {
                const mt = useTicketsForUser(m.id);
                return (
                  <tr key={m.id} className="hover:bg-surface-secondary transition-colors cursor-pointer" onClick={() => onSelectUser(m, false)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={m.full_name} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{m.full_name}</p>
                          <p className="text-[10px] text-text-muted">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-text-primary tabular-nums">{mt.total}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold tabular-nums">{mt.active}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold tabular-nums">{mt.resolved}</td>
                    <td className="px-4 py-3"><SlaRateBadge rate={mt.slaRate} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tiny hook to get per-user ticket counts without calling hooks in a loop ───
function useTicketsForUser(userId: number) {
  const { data } = useTickets({ assignee: userId, page_size: 200 });
  const tickets = data?.results ?? [];
  const resolved = tickets.filter(t => ['resolved','closed'].includes(t.status)).length;
  const active   = tickets.filter(t => ['open','assigned','in_progress','escalated','on_hold'].includes(t.status)).length;
  const breached = tickets.filter(t => t.sla_breached).length;
  const slaRate  = tickets.length > 0 ? Math.round(((tickets.length - breached) / tickets.length) * 100) : 100;
  return { total: tickets.length, active, resolved, breached, slaRate };
}

// ── USER panel (HOD or Member) ────────────────────────────────────────────────
function UserDetail({ user, stats, isHod }: { user: UserType; stats: any; isHod: boolean }) {
  const { data } = useTickets({ assignee: user.id, page_size: 200 });
  const tickets = data?.results ?? [];
  const recent  = [...tickets].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 12);

  const accentGradient = isHod ? 'from-violet-600 to-violet-700' : 'from-green-600 to-green-700';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-6 py-4 border-b border-surface-border bg-gradient-to-r ${accentGradient} flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <Avatar name={user.full_name} size="lg" className="ring-2 ring-white/30" />
          <div>
            <h2 className="text-base font-bold text-white">{user.full_name}</h2>
            <p className="text-xs text-white/60">{user.email} · {isHod ? 'Department Head' : 'Team Member'}</p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-5 divide-x divide-surface-border border-b border-surface-border flex-shrink-0">
        {[
          { label: 'Assigned',   value: stats.total,      color: 'text-brand-purple' },
          { label: 'Open',       value: stats.open,       color: 'text-blue-600' },
          { label: 'In Progress',value: stats.inProgress, color: 'text-indigo-600' },
          { label: 'Resolved',   value: stats.resolved,   color: 'text-green-600' },
          { label: 'SLA Rate',   value: `${stats.slaRate}%`, color: stats.slaRate >= 90 ? 'text-green-600' : stats.slaRate >= 70 ? 'text-amber-600' : 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-extrabold tabular-nums mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* SLA health bar */}
      <div className="px-6 py-3 border-b border-surface-border flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">SLA Compliance</p>
          <SlaRateBadge rate={stats.slaRate} />
        </div>
        <HealthBar value={stats.slaRate} max={100} />
      </div>

      {/* Recent tickets table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-5 py-3 border-b border-surface-border flex-shrink-0">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Assigned Tickets ({tickets.length})</p>
        </div>
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-secondary border-b border-surface-border">
              {['#', 'Subject', 'Status', 'Priority', 'SLA', 'Updated'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[11px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {recent.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-text-muted">No tickets assigned</td></tr>
            ) : recent.map(t => (
              <tr key={t.id} className={`hover:bg-surface-secondary transition-colors ${t.sla_breached ? 'border-l-2 border-red-400' : ''}`}>
                <td className="px-4 py-2.5 font-mono text-[10px] font-bold text-text-muted whitespace-nowrap">{t.ticket_number}</td>
                <td className="px-4 py-2.5 max-w-[200px]">
                  <p className="text-sm font-semibold text-text-primary truncate">{t.subject}</p>
                  <p className="text-[10px] text-text-muted">{t.department.name}</p>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap"><StatusBadge status={t.status} size="sm" /></td>
                <td className="px-4 py-2.5 whitespace-nowrap"><PriorityBadge priority={t.priority} size="sm" /></td>
                <td className="px-4 py-2.5">
                  {t.sla_breached
                    ? <span className="text-xs font-bold text-red-600">Breached</span>
                    : <span className="text-xs text-green-600 font-semibold">On track</span>
                  }
                </td>
                <td className="px-4 py-2.5 text-xs text-text-muted whitespace-nowrap">{formatRelative(t.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
