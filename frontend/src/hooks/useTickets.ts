import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { TicketFilters, TimelineEvent } from '@/types';
import { getTickets, getTicket, assignTicket, changeTicketStatus, updateTicket, getTicketTimeline } from '@/api/tickets.api';

export function useTickets(filters: TicketFilters = {}) {
  const [, setSearchParams] = useSearchParams();
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => getTickets(filters),
    staleTime: 1000 * 30,
    select: (data) => {
      // DRF 404 on out-of-range page — auto-reset to page 1
      if (data.count === 0 && (filters.page ?? 1) > 1) {
        setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', '1'); return next; });
      }
      return data;
    },
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicket(id),
    enabled: !!id,
  });
}

export function useTicketTimeline(id: number) {
  return useQuery({
    queryKey: ['ticket-timeline', id],
    queryFn: () => getTicketTimeline(id) as Promise<TimelineEvent[]>,
    enabled: !!id,
    staleTime: 1000 * 15,
  });
}

export function useAssignTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: number; assigneeId: number }) =>
      assignTicket(id, assigneeId),
    onSuccess: (ticket) => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['ticket-timeline', ticket.id] });
      qc.setQueryData(['ticket', ticket.id], ticket);
    },
  });
}

export function useChangeTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      resolution,
    }: {
      id: number;
      status: Parameters<typeof changeTicketStatus>[1];
      resolution?: string;
    }) => changeTicketStatus(id, status, resolution),
    onSuccess: (ticket) => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['ticket-timeline', ticket.id] });
      qc.setQueryData(['ticket', ticket.id], ticket);
    },
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateTicket>[1] }) =>
      updateTicket(id, data),
    onSuccess: (ticket) => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['ticket-timeline', ticket.id] });
      qc.setQueryData(['ticket', ticket.id], ticket);
    },
  });
}
