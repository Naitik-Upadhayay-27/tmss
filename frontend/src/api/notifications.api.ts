/**
 * Notifications API
 */
import type { Notification } from '@/types';
import apiClient from './client';

export async function getNotifications(): Promise<Notification[]> {
  const res = await apiClient.get<Notification[]>('/notifications/');
  // Backend returns paginated — unwrap if needed
  if (Array.isArray(res.data)) return res.data;
  return (res.data as { results: Notification[] }).results ?? [];
}

export async function markRead(id: number): Promise<Notification> {
  const res = await apiClient.post<Notification>(`/notifications/${id}/read/`);
  return res.data;
}

export async function markAllRead(): Promise<void> {
  await apiClient.post('/notifications/read-all/');
}
