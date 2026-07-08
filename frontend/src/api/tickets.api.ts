/**
 * Ticket API — Phase 2: real axios calls to /api/v1/tickets/
 * Function signatures are identical to Phase 1 mock — hooks don't change.
 */
import type { Ticket, TicketFilters, PaginatedResponse } from '@/types';
import apiClient from './client';

export async function getTickets(filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> {
  const params: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(filters)) {
    if (v !== '' && v !== undefined && v !== null) params[k] = v;
  }
  try {
    const res = await apiClient.get<PaginatedResponse<Ticket>>('/tickets/', { params });
    return res.data;
  } catch (err: any) {
    // DRF returns 404 when page number exceeds available pages — treat as empty
    if (err?.response?.status === 404) {
      return { count: 0, next: null, previous: null, results: [] };
    }
    throw err;
  }
}

export async function getTicket(id: number): Promise<Ticket> {
  const res = await apiClient.get<Ticket>(`/tickets/${id}/`);
  return res.data;
}

export async function createTicket(data: Partial<Ticket>): Promise<Ticket> {
  const res = await apiClient.post<Ticket>('/tickets/', data);
  return res.data;
}

export async function updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket> {
  const res = await apiClient.patch<Ticket>(`/tickets/${id}/`, data);
  return res.data;
}

export async function assignTicket(id: number, assigneeId: number): Promise<Ticket> {
  const res = await apiClient.post<Ticket>(`/tickets/${id}/assign/`, { assignee_id: assigneeId });
  return res.data;
}

export async function changeTicketStatus(
  id: number,
  status: Ticket['status'],
  resolution?: string,
): Promise<Ticket> {
  const res = await apiClient.post<Ticket>(`/tickets/${id}/status/`, { status, resolution });
  return res.data;
}

export async function getTicketTimeline(id: number) {
  const res = await apiClient.get(`/tickets/${id}/timeline/`);
  return res.data;
}

export async function getTicketAudit(id: number) {
  const res = await apiClient.get(`/tickets/${id}/audit/`);
  return res.data;
}

export async function escalateTicket(id: number): Promise<Ticket> {
  const res = await apiClient.post<Ticket>(`/tickets/${id}/escalate/`);
  return res.data;
}

export interface AssignableGroup {
  label: string;
  users: { id: number; full_name: string; email: string; role: string; department: string }[];
}

export async function getAssignableUsers(ticketId: number): Promise<{ groups: AssignableGroup[] }> {
  const res = await apiClient.get<{ groups: AssignableGroup[] }>(`/tickets/${ticketId}/assignable-users/`);
  return res.data;
}

export async function getTicketAttachments(id: number) {
  const res = await apiClient.get(`/tickets/${id}/attachments/`);
  return res.data;
}

export async function uploadAttachment(id: number, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await apiClient.post(`/tickets/${id}/attachments/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
