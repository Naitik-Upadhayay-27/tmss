/**
 * Users API — Phase 2: real axios calls
 */
import type { User, PaginatedResponse } from '@/types';
import apiClient from './client';

export async function getUsers(): Promise<PaginatedResponse<User>> {
  const res = await apiClient.get<PaginatedResponse<User>>('/users/');
  return res.data;
}

export async function getUser(id: number): Promise<User> {
  const res = await apiClient.get<User>(`/users/${id}/`);
  return res.data;
}

export async function getMembers(): Promise<User[]> {
  // Backend provides a flat array at /users/members/
  const res = await apiClient.get<User[]>('/users/members/');
  return res.data;
}

export async function createUser(data: Partial<User> & { password: string }): Promise<User> {
  const res = await apiClient.post<User>('/users/', data);
  return res.data;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const res = await apiClient.patch<User>(`/users/${id}/`, data);
  return res.data;
}

export async function deactivateUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}/`);
}
