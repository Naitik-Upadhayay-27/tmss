import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Drawer, Avatar } from '@/design-system';
import { assignTicket } from '@/api/tickets.api';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useUsers } from '@/hooks/useUsers';
import { Users, CheckCircle2 } from 'lucide-react';
import { User } from '@/types';

interface BulkAssignModalProps {
  ticketIds: number[];
  isOpen: boolean;
  onClose: () => void;
}

export function BulkAssignModal({ ticketIds, isOpen, onClose }: BulkAssignModalProps) {
  const qc = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const { data: usersData } = useUsers();
  const [isAssigningId, setIsAssigningId] = useState<number | null>(null);

  const allUsers = usersData?.results ?? [];
  const assignableUsers = allUsers.filter(u => {
    if (currentUser?.role === 'SUPER_ADMIN') return u.role === 'DEPT_HEAD';
    if (currentUser?.role === 'DEPT_HEAD') return u.role === 'MEMBER' || u.role === 'DEPT_HEAD';
    return false;
  });

  const handleAssign = async (member: User) => {
    if (isAssigningId) return;
    setIsAssigningId(member.id);
    try {
      await Promise.all(ticketIds.map((id) => assignTicket(id, member.id)));
      qc.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(`${ticketIds.length} ticket${ticketIds.length > 1 ? 's' : ''} assigned to ${member.full_name}`);
      onClose();
    } catch {
      toast.error('Failed to assign tickets');
    } finally {
      setIsAssigningId(null);
    }
  };

  // Group assignable users by department
  const byDept = assignableUsers.reduce((acc, m) => {
    const dName = m.department?.name || 'No Department';
    if (!acc[dName]) acc[dName] = [];
    acc[dName].push(m);
    return acc;
  }, {} as Record<string, User[]>);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Assign Tickets"
    >
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3 p-3 bg-brand-purple-faint rounded-lg border border-brand-purple/20">
          <Users className="h-5 w-5 text-brand-purple flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-brand-purple font-medium">
            Assigning {ticketIds.length} ticket{ticketIds.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="space-y-6">
          {Object.entries(byDept).map(([dept, deptMembers]) => (
            <div key={dept}>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{dept}</h3>
              <div className="space-y-1">
                {deptMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleAssign(m)}
                    disabled={isAssigningId !== null}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary transition-colors text-left group disabled:opacity-50"
                  >
                    <Avatar name={m.full_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-brand-purple transition-colors truncate">
                        {m.full_name}
                      </p>
                      <p className="text-xs text-text-secondary truncate">{m.role.replace('_', ' ')}</p>
                    </div>
                    {isAssigningId === m.id && (
                      <div className="h-5 w-5 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {assignableUsers.length === 0 && (
            <p className="text-sm text-text-muted text-center py-8">No team members available for assignment.</p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
