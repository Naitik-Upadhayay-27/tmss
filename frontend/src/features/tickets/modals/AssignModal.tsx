import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, UserCheck, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, Button } from '@/design-system';
import { useAssignTicket } from '@/hooks/useTickets';
import { getAssignableUsers, type AssignableGroup } from '@/api/tickets.api';
import type { Ticket } from '@/types';

interface AssignModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignModal({ ticket, isOpen, onClose }: AssignModalProps) {
  const { mutate: assign, isPending } = useAssignTicket();
  const [groups, setGroups] = useState<AssignableGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch assignable users when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setSelectedId(null);
    setSearch('');
    getAssignableUsers(ticket.id)
      .then(data => setGroups(data.groups))
      .catch(() => toast.error('Failed to load assignable users'))
      .finally(() => setLoading(false));
    setTimeout(() => searchRef.current?.focus(), 100);
  }, [isOpen, ticket.id]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  const handleAssign = () => {
    if (!selectedId) return;
    assign(
      { id: ticket.id, assigneeId: selectedId },
      {
        onSuccess: () => {
          toast.success(`${ticket.ticket_number} assigned successfully`);
          onClose();
        },
        onError: () => toast.error('Failed to assign ticket'),
      },
    );
  };

  const toggleGroup = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));

  // Filter users by search across all groups
  const filteredGroups = groups
    .map(g => ({
      ...g,
      users: g.users.filter(
        u =>
          search.trim() === '' ||
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.department.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter(g => g.users.length > 0);

  const selectedUser = groups.flatMap(g => g.users).find(u => u.id === selectedId);
  const totalUsers = groups.reduce((acc, g) => acc + g.users.length, 0);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="assign-modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F1120]/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Sidebar panel — slides in from right */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-brand-purple flex-shrink-0">
          <div>
            <h2 id="assign-modal-title" className="text-sm font-bold text-white">Assign Ticket</h2>
            <p className="text-[11px] text-white/60 mt-0.5 font-mono">{ticket.ticket_number}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Ticket subject */}
        <div className="px-5 py-3 bg-surface-secondary border-b border-surface-border flex-shrink-0">
          <p className="text-xs text-text-muted mb-0.5">Assigning</p>
          <p className="text-sm font-semibold text-text-primary line-clamp-2">{ticket.subject}</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-surface-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, department…"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-surface-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
            />
          </div>
          {!loading && (
            <p className="text-[10px] text-text-muted mt-1.5">{totalUsers} user{totalUsers !== 1 ? 's' : ''} available to assign</p>
          )}
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-6 w-6 text-brand-purple animate-spin" />
              <p className="text-sm text-text-muted">Loading assignable users…</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 px-6 text-center">
              <UserCheck className="h-8 w-8 text-text-muted/30" />
              <p className="text-sm font-medium text-text-muted">
                {search ? 'No users match your search' : 'No assignable users found'}
              </p>
            </div>
          ) : (
            filteredGroups.map(group => (
              <div key={group.label}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-5 py-2.5 bg-surface-secondary hover:bg-surface-tertiary transition-colors border-b border-surface-border"
                >
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                    {group.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
                      {group.users.length}
                    </span>
                    {collapsed[group.label]
                      ? <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                      : <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                    }
                  </div>
                </button>

                {/* Group users */}
                {!collapsed[group.label] && (
                  <ul>
                    {group.users.map(u => {
                      const isSelected = selectedId === u.id;
                      const isCurrent = ticket.assignee?.id === u.id;
                      return (
                        <li key={u.id}>
                          <button
                            onClick={() => !isCurrent && setSelectedId(isSelected ? null : u.id)}
                            disabled={isCurrent}
                            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all border-b border-surface-border/50 ${
                              isCurrent
                                ? 'bg-surface-secondary opacity-60 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-brand-purple-faint border-l-2 border-l-brand-purple'
                                  : 'hover:bg-surface-secondary'
                            }`}
                          >
                            <Avatar name={u.full_name} size="sm" className="flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-semibold truncate ${isSelected ? 'text-brand-purple' : 'text-text-primary'}`}>
                                  {u.full_name}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex-shrink-0">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-text-muted truncate">{u.department}</p>
                            </div>
                            {isSelected && !isCurrent && (
                              <div className="h-4 w-4 rounded-full bg-brand-purple flex items-center justify-center flex-shrink-0">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              </div>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-surface-border px-5 py-4 bg-white">
          {selectedUser && (
            <div className="flex items-center gap-2.5 mb-3 px-3 py-2.5 bg-brand-purple-faint rounded-xl border border-purple-200">
              <Avatar name={selectedUser.full_name} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-brand-purple truncate">{selectedUser.full_name}</p>
                <p className="text-[10px] text-text-muted truncate">{selectedUser.department}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
                aria-label="Deselect"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="flex gap-2.5">
            <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAssign}
              isLoading={isPending}
              disabled={!selectedId}
              className="flex-1"
              data-testid="assign-confirm-btn"
            >
              Assign
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
