import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { UserPlus, Search, Shield, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Avatar, RoleBadge, Input, Select, Modal, ConfirmDialog, Skeleton } from '@/design-system';
import { mockUsers, mockDepartments, mockPermissions } from '@/mockData';
import { formatDate } from '@/utils';
import type { User, Role } from '@/types';

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'DEPT_HEAD', label: 'Department Head' },
  { value: 'CALLER', label: 'Caller / Agent' },
  { value: 'MEMBER', label: 'Team Member' },
];

const ROLE_FILTER_OPTIONS = [{ value: '', label: 'All Roles' }, ...ROLE_OPTIONS];

const DEFAULT_ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: [
    'tms:ticket:read_all', 'tms:ticket:read_dept', 'tms:ticket:create', 'tms:ticket:update', 'tms:ticket:delete', 'tms:ticket:assign', 'tms:ticket:escalate',
    'tms:sla:manage_rules', 'tms:sla:override_breach',
    'iam:user:read', 'iam:user:create', 'iam:user:update', 'iam:user:manage_roles',
    'sys:config:view_audit', 'sys:config:manage_depts',
    'ai:engine:reports', 'ai:engine:settings'
  ],
  DEPT_HEAD: [
    'tms:ticket:read_dept', 'tms:ticket:create', 'tms:ticket:update', 'tms:ticket:assign', 'tms:ticket:escalate',
    'tms:sla:override_breach',
    'iam:user:read', 'iam:user:create', 'iam:user:update'
  ],
  CALLER: [
    'tms:ticket:create', 'tms:ticket:read_dept'
  ],
  MEMBER: [
    'tms:ticket:read_dept', 'tms:ticket:update'
  ]
};

const inviteSchema = z.object({
  first_name: z.string().min(2, 'Required'),
  last_name: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Select a role'),
  departmentId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});
type InviteFormData = z.infer<typeof inviteSchema>;

const PAGE_SIZE = 20;

export function UserManagementPage() {
  const { user: currentUser } = useAuthStore();
  const { data, isLoading } = useUsers();
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deactivateUser, setDeactivateUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const users = data?.results ?? [];

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      permissions: [],
    }
  });

  const watchedRole = watch('role');

  useEffect(() => {
    if (watchedRole) {
      setValue('permissions', DEFAULT_ROLE_PERMISSIONS[watchedRole as Role] || []);
    }
  }, [watchedRole, setValue]);

  const onInvite = (data: InviteFormData) => {
    const selectedDept = mockDepartments.find(d => String(d.id) === data.departmentId);
    const newUser: User = {
      id: mockUsers.length + 1,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: `${data.first_name} ${data.last_name}`,
      role: data.role as Role,
      department: selectedDept,
      permissions: data.permissions || [],
      is_active: true,
      date_joined: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    toast.success(`Invitation sent to ${data.email}`);
    reset();
    setShowInvite(false);
  };

  const handleDeactivate = () => {
    if (!deactivateUser) return;
    const idx = mockUsers.findIndex((u) => u.id === deactivateUser.id);
    if (idx !== -1) mockUsers[idx] = { ...mockUsers[idx], is_active: !mockUsers[idx].is_active };
    toast.success(`User ${deactivateUser.is_active ? 'deactivated' : 'activated'}`);
    setDeactivateUser(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Management"
        subtitle={`${users.length} total users`}
        actions={
          <Button variant="orange" size="sm" onClick={() => setShowInvite(true)} leftIcon={<UserPlus className="h-4 w-4" />} data-testid="invite-user-btn">
            Invite User
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          leftIcon={<Search className="h-4 w-4" />}
          className="w-64"
          data-testid="user-search"
        />
        <Select
          options={ROLE_FILTER_OPTIONS}
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="w-44"
        />
        <span className="text-xs text-text-muted ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
        <table className="w-full text-sm" role="grid">
          <thead>
            <tr className="bg-surface-secondary border-b border-surface-border">
              {['User', 'Role', 'Department', 'Status', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              : paged.map((u) => (
                  <tr 
                    key={u.id} 
                    className={`hover:bg-surface-secondary transition-colors cursor-pointer ${!u.is_active ? 'opacity-50' : ''}`}
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.full_name} size="sm" />
                        <div>
                          <p className="font-medium text-text-primary text-sm">{u.full_name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3.5 text-sm text-text-secondary">{u.department?.name ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        u.is_active
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-surface-tertiary text-text-muted border-surface-border'
                      }`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-text-secondary">{formatDate(u.date_joined)}</td>
                    <td className="px-5 py-3.5">
                      {u.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setDeactivateUser(u); }}
                          data-testid={`deactivate-${u.id}`}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border bg-surface-secondary">
            <p className="text-xs text-text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
                    p === page
                      ? 'bg-brand-purple text-white'
                      : 'text-text-secondary hover:bg-surface-tertiary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invite modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite New User"
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowInvite(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="orange" size="sm" onClick={handleSubmit(onInvite)} isLoading={isSubmitting} data-testid="invite-submit-btn">
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onInvite)} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-purple border-b border-surface-border pb-1.5 uppercase tracking-wider">User Account Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" error={errors.first_name?.message} {...register('first_name')} />
              <Input label="Last Name" error={errors.last_name?.message} {...register('last_name')} />
            </div>
            <Input label="Email Address" type="email" error={errors.email?.message} {...register('email')} />
            <Select label="Role" options={ROLE_OPTIONS} placeholder="Select role" error={errors.role?.message} {...register('role')} />
            <Select label="Department" options={mockDepartments.map(d => ({ value: String(d.id), label: d.name }))} placeholder="Select department" error={errors.departmentId?.message} {...register('departmentId')} />
          </div>

          <div className="flex flex-col h-[340px] overflow-hidden border border-surface-border rounded-xl bg-surface-primary">
            <div className="px-4 py-3 bg-surface-secondary border-b border-surface-border flex-shrink-0">
              <h3 className="text-xs font-bold text-[#1A1D2E] uppercase tracking-wider">Policy Permissions</h3>
              <p className="text-[10px] text-text-secondary mt-0.5">Permissions are loaded based on selected role, customize below.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {mockPermissions.map((category) => (
                <div key={category.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-purple border-b border-brand-purple/10 pb-1">
                    {category.name}
                  </h4>
                  <div className="space-y-2.5 pl-0.5">
                    {category.permissions.map((p) => (
                      <label key={p.id} className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          value={p.id}
                          className="mt-0.5 rounded border-surface-border text-brand-purple focus:ring-brand-purple h-3.5 w-3.5"
                          {...register('permissions')}
                        />
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{p.name}</p>
                          <p className="text-[10px] text-text-muted mt-0.5 leading-normal">{p.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Deactivate confirm */}
      <ConfirmDialog
        isOpen={!!deactivateUser}
        onClose={() => setDeactivateUser(null)}
        onConfirm={handleDeactivate}
        title={`${deactivateUser?.is_active ? 'Deactivate' : 'Activate'} User`}
        message={`Are you sure you want to ${deactivateUser?.is_active ? 'deactivate' : 'activate'} ${deactivateUser?.full_name}?`}
        confirmLabel={deactivateUser?.is_active ? 'Deactivate' : 'Activate'}
        variant={deactivateUser?.is_active ? 'danger' : 'primary'}
      />
    </div>
  );
}
