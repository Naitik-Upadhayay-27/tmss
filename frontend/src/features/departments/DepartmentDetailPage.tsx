import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Users, Clock, ShieldAlert, BarChart3, PieChart, Plus, ArrowRightLeft, Shield, X, Search, UserPlus } from 'lucide-react';
import { PageHeader } from '@/layout/PageHeader';
import { useDepartments, useUpdateDepartment } from '@/hooks/useDepartments';
import { useUsers, useUpdateUser } from '@/hooks/useUsers';
import { useTickets } from '@/hooks/useTickets';
import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Avatar, Modal, Input, Select, Button } from '@/design-system';
import { createUser } from '@/api/users.api';
import type { User } from '@/types';

export function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deptData } = useDepartments();
  const { data: usersData } = useUsers();
  const { data: ticketsData } = useTickets({ page_size: 1000 });
  const updateDept = useUpdateDepartment();
  const updateUser = useUpdateUser();

  const department = deptData?.results?.find(d => d.id === Number(id));
  const deptUsers = usersData?.results?.filter(u => u.department?.id === Number(id)) ?? [];
  const allUsers = usersData?.results ?? [];
  const deptTickets = ticketsData?.results?.filter(t => t.department?.id === Number(id)) ?? [];

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [criticalSLA, setCriticalSLA] = useState('4');
  const [highSLA, setHighSLA] = useState('8');
  const [headUserId, setHeadUserId] = useState('');
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [tab, setTab] = useState<'new' | 'transfer'>('transfer');
  // transfer filters
  const [memberSearch, setMemberSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterRole, setFilterRole] = useState('');
  // new member form
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'MEMBER' | 'DEPT_HEAD'>('MEMBER');

  const totalTickets = deptTickets.length;
  const openTickets = deptTickets.filter(t => ['open', 'assigned', 'in_progress'].includes(t.status)).length;
  const resolvedTickets = deptTickets.filter(t => ['resolved', 'closed'].includes(t.status)).length;
  const breachedTickets = deptTickets.filter(t => t.sla_breached).length;
  const breachRate = totalTickets ? Math.round((breachedTickets / totalTickets) * 100) : 0;
  const insuranceCount = deptTickets.filter(t => t.ticket_type === 'insurance').length;
  const internalCount = deptTickets.filter(t => t.ticket_type === 'internal').length;

  useEffect(() => {
    if (department) {
      setName(department.name);
      setCode(department.code);
      setCriticalSLA(String(department.sla_critical_hours));
      setHighSLA(String(department.sla_high_hours));
      setHeadUserId(department.head?.id ? String(department.head.id) : '');
    }
  }, [department]);

  const qc = useQueryClient();
  const createMember = useMutation({
    mutationFn: (data: Parameters<typeof createUser>[0]) => createUser(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });

  const availableUsers = useMemo(() => {
    const q = memberSearch.toLowerCase();
    return allUsers.filter(u => {
      if (u.department?.id === Number(id)) return false;
      if (u.role === 'SUPER_ADMIN') return false;
      if (!u.is_active) return false;
      if (filterDept && String(u.department?.id ?? '') !== filterDept) return false;
      if (filterRole && u.role !== filterRole) return false;
      if (q && !u.full_name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allUsers, id, memberSearch, filterDept, filterRole]);

  if (!department) return <div className="p-8 text-center text-text-muted">Loading department...</div>;

  const handleSave = async () => {
    await updateDept.mutateAsync({
      id: department.id,
      data: {
        name,
        code,
        sla_critical_hours: Number(criticalSLA),
        sla_high_hours: Number(highSLA),
        head: headUserId ? Number(headUserId) : null,
      } as any,
    });
    toast.success('Department settings saved');
  };

  const closePanel = () => {
    setShowMembersPanel(false); setTab('transfer');
    setMemberSearch(''); setFilterDept(''); setFilterRole('');
    setNewFirst(''); setNewLast(''); setNewEmail(''); setNewPassword(''); setNewRole('MEMBER');
  };

  const handleCreateMember = async () => {
    if (!newFirst || !newLast || !newEmail || !newPassword) { toast.error('All fields are required'); return; }
    await createMember.mutateAsync({
      first_name: newFirst, last_name: newLast,
      email: newEmail, password: newPassword,
      role: newRole, department: Number(id), is_active: true,
    } as any);
    toast.success(`${newFirst} ${newLast} added to ${department!.name}`);
    setNewFirst(''); setNewLast(''); setNewEmail(''); setNewPassword(''); setNewRole('MEMBER');
  };

  const handleTransfer = async (user: User) => {
    await updateUser.mutateAsync({ id: user.id, data: { department: Number(id) } as any });
    toast.success(`${user.full_name} moved to ${department.name}`);
  };

  const handlePromote = async (user: User) => {
    await updateUser.mutateAsync({ id: user.id, data: { role: 'DEPT_HEAD' } });
    toast.success(`${user.full_name} promoted to Dept Head`);
  };

  const handleDemote = async (user: User) => {
    await updateUser.mutateAsync({ id: user.id, data: { role: 'MEMBER' } });
    toast.success(`${user.full_name} changed to Member`);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <PageHeader
            title={department.name}
            subtitle="Configure department properties, SLA policies, and manage members"
            actions={
              <button
                onClick={handleSave}
                className="h-10 px-4 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            }
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Ticket Workload</span>
              <BarChart3 className="h-3.5 w-3.5 text-brand-purple" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-text-primary">{openTickets}</span>
              <span className="text-xs text-text-muted">active / {totalTickets} total</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-brand-purple h-full" style={{ width: `${totalTickets ? (openTickets / totalTickets) * 100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">SLA Compliance</span>
              <Clock className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-xl font-bold ${breachRate > 15 ? 'text-red-600' : 'text-green-600'}`}>
                {totalTickets ? (100 - breachRate) : 100}%
              </span>
              <span className="text-xs text-text-muted">in-SLA target</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full mt-3 overflow-hidden">
            <div className={`h-full ${breachRate > 15 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${totalTickets ? (100 - breachRate) : 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Ticket Types</span>
              <PieChart className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-1 text-xs font-semibold text-text-primary">
              <span>{insuranceCount} Ins</span>
              <span className="text-text-muted">/</span>
              <span>{internalCount} Int</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full mt-3 overflow-hidden flex">
            <div className="bg-blue-500 h-full" style={{ width: `${totalTickets ? (insuranceCount / totalTickets) * 100 : 0}%` }} />
            <div className="bg-amber-500 h-full" style={{ width: `${totalTickets ? (internalCount / totalTickets) * 100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Resolution Rate</span>
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-text-primary">
                {totalTickets ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%
              </span>
              <span className="text-xs text-text-muted">resolved ({resolvedTickets})</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${totalTickets ? (resolvedTickets / totalTickets) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Config & Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Config */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-surface-border shadow-sm">
            <div className="px-4 py-3 border-b border-surface-border flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand-purple" />
              <h3 className="font-semibold text-text-primary text-sm">Department Configuration</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Department Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-xs focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Department Code</label>
                  <input type="text" value={code} onChange={e => setCode(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-xs focus:outline-none focus:border-brand-purple font-mono uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Department Head (HOD)</label>
                <select value={headUserId} onChange={e => setHeadUserId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-xs focus:outline-none focus:border-brand-purple">
                  <option value="">No head assigned</option>
                  {allUsers.filter(u => u.role === 'DEPT_HEAD' || u.role === 'SUPER_ADMIN').map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.role === 'DEPT_HEAD' ? 'HOD' : 'Admin'})</option>
                  ))}
                </select>
              </div>
              <div className="pt-3 border-t border-surface-border">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-brand-purple" />
                  <h4 className="font-semibold text-text-primary text-xs">SLA Performance Targets</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Critical Priority SLA (Hours)</label>
                    <input type="number" value={criticalSLA} onChange={e => setCriticalSLA(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-xs focus:outline-none focus:border-brand-purple font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">High Priority SLA (Hours)</label>
                    <input type="number" value={highSLA} onChange={e => setHighSLA(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-xs focus:outline-none focus:border-brand-purple font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-surface-border shadow-sm h-full flex flex-col">
            <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-purple" />
                <h3 className="font-semibold text-text-primary text-sm">Members</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                  {deptUsers.length}
                </span>
              </div>
              <button
                onClick={() => setShowMembersPanel(true)}
                className="h-7 w-7 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white flex items-center justify-center transition-colors"
                title="Add / transfer members"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[350px]">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-surface-secondary border-b border-surface-border">
                    <th className="px-4 py-2 text-[9px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-[9px] font-semibold text-text-muted uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-[9px] font-semibold text-text-muted uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {deptUsers.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-6 text-center text-text-muted italic">No members yet</td></tr>
                  )}
                  {deptUsers.map(user => (
                    <tr key={user.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={user.full_name} size="xs" />
                          <button onClick={() => navigate(`/admin/users/${user.id}`)} className="font-medium text-text-primary hover:text-brand-purple truncate max-w-[100px] transition-colors">
                            {user.full_name}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          user.role === 'DEPT_HEAD' ? 'bg-brand-purple/10 text-brand-purple' : 'bg-surface-tertiary text-text-secondary'
                        }`}>
                          {user.role === 'DEPT_HEAD' ? 'Head' : 'Member'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {user.role === 'MEMBER' ? (
                          <button
                            onClick={() => handlePromote(user)}
                            className="inline-flex items-center gap-1 text-[10px] text-brand-purple hover:underline font-semibold"
                            title="Promote to Dept Head"
                          >
                            <Shield className="h-3 w-3" /> Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemote(user)}
                            className="inline-flex items-center gap-1 text-[10px] text-text-muted hover:text-red-500 hover:underline font-semibold"
                            title="Change to Member"
                          >
                            <X className="h-3 w-3" /> Demote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Transfer Members Modal */}
      <Modal
        isOpen={showMembersPanel}
        onClose={closePanel}
        title={`Manage Members — ${department.name}`}
        size="md"
      >
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-secondary rounded-lg mb-4">
          {(['transfer', 'new'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                tab === t ? 'bg-white text-brand-purple shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t === 'transfer' ? <><ArrowRightLeft className="h-3.5 w-3.5" /> Transfer Existing</> : <><UserPlus className="h-3.5 w-3.5" /> Add New Member</>}
            </button>
          ))}
        </div>

        {/* Transfer tab */}
        {tab === 'transfer' && (
          <div className="space-y-3">
            {/* Filters row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                <input
                  type="text" placeholder="Search name or email..."
                  value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-border text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>
              <select
                value={filterDept} onChange={e => setFilterDept(e.target.value)}
                className="h-9 px-2 rounded-lg border border-surface-border text-xs focus:outline-none focus:border-brand-purple bg-white"
              >
                <option value="">All Depts</option>
                {deptData?.results?.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
              </select>
              <select
                value={filterRole} onChange={e => setFilterRole(e.target.value)}
                className="h-9 px-2 rounded-lg border border-surface-border text-xs focus:outline-none focus:border-brand-purple bg-white"
              >
                <option value="">All Roles</option>
                <option value="MEMBER">Member</option>
                <option value="DEPT_HEAD">Dept Head</option>
                <option value="CALLER">Caller</option>
              </select>
            </div>
            {/* Results */}
            <div className="max-h-72 overflow-y-auto divide-y divide-surface-border rounded-lg border border-surface-border">
              {availableUsers.length === 0
                ? <p className="py-8 text-center text-sm text-text-muted">No users found</p>
                : availableUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-secondary transition-colors">
                    <Avatar name={user.full_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{user.full_name}</p>
                      <p className="text-[11px] text-text-muted">{user.department?.name ?? 'No dept'} · {user.role.replace('_', ' ').toLowerCase()}</p>
                    </div>
                    <button
                      onClick={() => handleTransfer(user)}
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-brand-purple hover:bg-brand-purple hover:text-white px-2.5 py-1 rounded-lg border border-brand-purple/30 transition-colors"
                    >
                      <ArrowRightLeft className="h-3 w-3" /> Transfer
                    </button>
                  </div>
                ))
              }
            </div>
            <p className="text-[11px] text-text-muted">Transfer moves the user into this department. Role stays unchanged — promote/demote from the members list.</p>
          </div>
        )}

        {/* New member tab */}
        {tab === 'new' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name *" value={newFirst} onChange={e => setNewFirst(e.target.value)} placeholder="e.g. Rahul" />
              <Input label="Last Name *" value={newLast} onChange={e => setNewLast(e.target.value)} placeholder="e.g. Sharma" />
            </div>
            <Input label="Email *" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="rahul.sharma@fatakpay.com" />
            <Input label="Password *" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" />
            <Select
              label="Role *"
              value={newRole}
              onChange={e => setNewRole(e.target.value as 'MEMBER' | 'DEPT_HEAD')}
              options={[
                { value: 'MEMBER', label: 'Member' },
                { value: 'DEPT_HEAD', label: 'Department Head' },
                { value: 'CALLER', label: 'Caller' },
              ]}
            />
            <div className="pt-1">
              <p className="text-[11px] text-text-muted mb-3">Will be added directly to <span className="font-semibold text-text-primary">{department.name}</span>.</p>
              <Button
                variant="primary" size="sm"
                onClick={handleCreateMember}
                isLoading={createMember.isPending}
                leftIcon={<UserPlus className="h-3.5 w-3.5" />}
              >
                Create & Add Member
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
