/**
 * Comments API
 */
import type { Comment } from '@/types';
import apiClient from './client';

export async function getComments(ticketId: number): Promise<Comment[]> {
  const res = await apiClient.get<Comment[]>(`/tickets/${ticketId}/comments/`);
  return res.data;
}

export async function addComment(ticketId: number, body: string, isInternal = false): Promise<Comment> {
  const res = await apiClient.post<Comment>(`/tickets/${ticketId}/comments/`, {
    body,
    is_internal: isInternal,
  });
  return res.data;
}

export async function updateComment(commentId: number, body: string): Promise<Comment> {
  const res = await apiClient.patch<Comment>(`/comments/${commentId}/`, { body });
  return res.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await apiClient.delete(`/comments/${commentId}/`);
}

