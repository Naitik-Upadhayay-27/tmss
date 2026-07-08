import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button } from '@/design-system';
import { useMembers } from '@/hooks/useUsers';
import { assignTicket } from '@/api/tickets.api';

interface DeptBulkAssignDrawerProps {
  ticketIds: number[];
  isOpen: boolean;
  onClose: () => void;
}

export function DeptBulkAssignDrawer({ ticketIds, isOpen, onClose }: DeptBulkAssignDrawerProps) {
  const qc = useQueryClient();
  const { data: members = [] } = useMembers();
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedMember) return;
    setIsLoading(true);
    try {
      await Promise.all(ticketIds.map(id => assignTicket(id, selectedMember)));
      qc.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(`${ticketIds.length} ticket${ticketIds.length > 1 ? 's' : ''} assigned`);
      onClose();
    } catch {
      toast.error('Failed to assign tickets');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F1120]/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slides in from right */}
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-modal flex flex-col animate-slide-up"
        style={{ animation: 'slideInRight 0.2s ease-out' }}
        role="dialog"
        aria-modal="true"
        aria-label="Bulk assign tickets"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-brand-purple flex-shrink-0">
          <div>
            <p className="text-sm font-bold text-white">Bulk Assign</p>
            <p className="text-[11px] text-white/60 mt-0.5">
              {ticketIds.length} ticket{ticketIds.length > 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selected count pill */}
        <div className="px-5 py-3 border-b border-surface-border bg-brand-purple-faint flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-brand-purple font-semibold">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Select a team member to assign all {ticketIds.length} ticket{ticketIds.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {members.length === 0 ? (
            <div className="py-10 text-center text-sm text-text-muted">No team members found</div>
          ) : members.map(member => {
            const isSelected = selectedMember === member.id;
            return (
              <button
                key={member.id}
                onClick={() => setSelectedMember(isSelected ? null : member.id)}
                className={[
                  'w-full flex items-center gap-3 px-5 py-3.5 transition-all text-left border-b border-surface-border',
                  isSelected
                    ? 'bg-brand-purple-faint border-l-4 border-l-brand-purple'
                    : 'hover:bg-surface-secondary',
                ].join(' ')}
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={member.full_name} size="md" />
                  {isSelected && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-brand-purple rounded-full flex items-center justify-center ring-2 ring-white">
                      <CheckCircle className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isSelected ? 'text-brand-purple' : 'text-text-primary'}`}>
                    {member.full_name}
                  </p>
                  <p className="text-[11px] text-text-muted capitalize">
                    {member.role.replace(/_/g, ' ').toLowerCase()}
                  </p>
                  <p className="text-[10px] text-text-muted">{member.email}</p>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold text-brand-purple bg-brand-purple-faint border border-purple-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-surface-border bg-surface-secondary flex-shrink-0 space-y-2">
          {selectedMember && (
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
              <Avatar name={members.find(m => m.id === selectedMember)?.full_name ?? ''} size="xs" />
              <span>
                Assigning <strong>{ticketIds.length}</strong> ticket{ticketIds.length > 1 ? 's' : ''} to{' '}
                <strong>{members.find(m => m.id === selectedMember)?.full_name}</strong>
              </span>
            </div>
          )}
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={handleAssign}
            disabled={!selectedMember}
            isLoading={isLoading}
            leftIcon={<UserPlus className="h-4 w-4" />}
            data-testid="drawer-assign-confirm-btn"
          >
            Assign Tickets
          </Button>
          <Button variant="ghost" size="md" className="w-full justify-center" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
