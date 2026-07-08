import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Building2, Clock, Edit2, Eye, Plus, Power } from 'lucide-react';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useToggleDepartmentActive } from '@/hooks/useDepartments';
import { useTickets } from '@/hooks/useTickets';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Avatar, Modal, Input, Skeleton } from '@/design-system';
import type { Department } from '@/types';

const deptSchema = z.object({
  name: z.string().min(2, 'Required'),
  code: z.string().min(1, 'Required').toUpperCase(),
  sla_critical_hours: z.number().min(1, 'Required'),
  sla_high_hours: z.number().min(1, 'Required'),
});
type DeptFormData = z.infer<typeof deptSchema>;

export function DepartmentManagementPage() {
  const { data, isLoading } = useDepartments();
  const { data: ticketsData } = useTickets({ page_size: 500 });
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const toggleMutation = useToggleDepartmentActive();

  const depts = data?.results ?? [];
  const tickets = ticketsData?.results ?? [];
  const getTicketCount = (deptId: number) => tickets.filter((t) => t.department.id === deptId).length;

  // ── Edit form ──────────────────────────────────────────────────────────────
  const editForm = useForm<DeptFormData>({ resolver: zodResolver(deptSchema) });

  const openEdit = (dept: Department) => {
    editForm.reset({
      name: dept.name,
      code: dept.code,
      sla_critical_hours: dept.sla_critical_hours,
      sla_high_hours: dept.sla_high_hours,
    });
    setEditDept(dept);
  };

  const onEdit = editForm.handleSubmit(async (values) => {
    if (!editDept) return;
    await updateMutation.mutateAsync({ id: editDept.id, data: values });
    toast.success(`${editDept.name} updated`);
    setEditDept(null);
  });

  // ── Add form ───────────────────────────────────────────────────────────────
  const addForm = useForm<DeptFormData>({ resolver: zodResolver(deptSchema) });

  const onAdd = addForm.handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
    toast.success(`${values.name} department created`);
    addForm.reset();
    setAddOpen(false);
  });

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (dept: Department) => {
    await toggleMutation.mutateAsync({ id: dept.id, is_active: !dept.is_active });
    toast.success(`${dept.name} ${dept.is_active ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Department Management"
        subtitle={`${depts.length} departments configured`}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
            Add Department
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" role="grid">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide w-[28%]">Department</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide w-[22%]">Department Head</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide w-[25%]">SLA Targets</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide w-[8%] text-center">Tickets</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide w-[8%] text-center">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide w-[9%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                : depts.map((dept) => (
                    <tr
                      key={dept.id}
                      className={`hover:bg-surface-secondary/40 transition-colors cursor-pointer group ${!dept.is_active ? 'opacity-50' : ''}`}
                      onClick={() => navigate(`/admin/departments/${dept.id}`)}
                    >
                      {/* Name & Code */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-brand-purple/5 text-brand-purple flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary group-hover:text-brand-purple transition-colors text-sm">{dept.name}</p>
                            <span className="font-mono text-[10px] text-text-muted bg-surface-secondary border border-surface-border px-1 py-0.5 rounded">
                              {dept.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Head */}
                      <td className="px-5 py-3">
                        {dept.head ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={dept.head.full_name} size="sm" className="h-6 w-6 text-[10px]" />
                            <span className="text-xs font-medium text-text-primary truncate max-w-[140px]">{dept.head.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted italic">Unassigned</span>
                        )}
                      </td>

                      {/* SLAs */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-100">
                            <Clock className="h-3 w-3" /> Critical: {dept.sla_critical_hours}h
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <Clock className="h-3 w-3" /> High: {dept.sla_high_hours}h
                          </span>
                        </div>
                      </td>

                      {/* Ticket count */}
                      <td className="px-5 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                          {getTicketCount(dept.id)}
                        </span>
                      </td>

                      {/* Active badge */}
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${dept.is_active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {dept.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(dept)}
                            className="p-1 text-text-muted hover:text-brand-purple hover:bg-brand-purple-faint rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/departments/${dept.id}`)}
                            className="p-1 text-text-muted hover:text-brand-purple hover:bg-brand-purple-faint rounded-md transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggle(dept)}
                            className={`p-1 rounded-md transition-colors ${dept.is_active ? 'text-green-600 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                            title={dept.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Department Modal ── */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); addForm.reset(); }}
        title="Add Department"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setAddOpen(false); addForm.reset(); }}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onAdd} isLoading={createMutation.isPending}>Create</Button>
          </>
        }
      >
        <form onSubmit={onAdd} noValidate className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Finance"
            error={addForm.formState.errors.name?.message}
            {...addForm.register('name')}
          />
          <Input
            label="Code"
            placeholder="e.g. FINANCE"
            hint="Short unique identifier (auto-uppercased)"
            error={addForm.formState.errors.code?.message}
            {...addForm.register('code')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Critical SLA (hours)"
              type="number"
              error={addForm.formState.errors.sla_critical_hours?.message}
              {...addForm.register('sla_critical_hours', { valueAsNumber: true })}
            />
            <Input
              label="High SLA (hours)"
              type="number"
              error={addForm.formState.errors.sla_high_hours?.message}
              {...addForm.register('sla_high_hours', { valueAsNumber: true })}
            />
          </div>
        </form>
      </Modal>

      {/* ── Edit Department Modal ── */}
      <Modal
        isOpen={!!editDept}
        onClose={() => setEditDept(null)}
        title={`Edit — ${editDept?.name}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditDept(null)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={onEdit} isLoading={updateMutation.isPending}>Save</Button>
          </>
        }
      >
        <form onSubmit={onEdit} noValidate className="space-y-4">
          <Input
            label="Department Name"
            error={editForm.formState.errors.name?.message}
            {...editForm.register('name')}
          />
          <Input
            label="Code"
            error={editForm.formState.errors.code?.message}
            {...editForm.register('code')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Critical SLA (hours)"
              type="number"
              error={editForm.formState.errors.sla_critical_hours?.message}
              {...editForm.register('sla_critical_hours', { valueAsNumber: true })}
            />
            <Input
              label="High SLA (hours)"
              type="number"
              error={editForm.formState.errors.sla_high_hours?.message}
              {...editForm.register('sla_high_hours', { valueAsNumber: true })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
