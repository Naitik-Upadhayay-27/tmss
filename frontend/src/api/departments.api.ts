/**
 * Departments API — Phase 2: real axios calls
 */
import type { Department, PaginatedResponse } from '@/types';
import apiClient from './client';

export async function getDepartments(): Promise<PaginatedResponse<Department>> {
  const res = await apiClient.get<PaginatedResponse<Department>>('/departments/');
  return res.data;
}

export async function getDepartment(id: number): Promise<Department> {
  const res = await apiClient.get<Department>(`/departments/${id}/`);
  return res.data;
}

export async function createDepartment(data: Partial<Department>): Promise<Department> {
  const res = await apiClient.post<Department>('/departments/', data);
  return res.data;
}

export async function updateDepartment(id: number, data: Partial<Department>): Promise<Department> {
  const res = await apiClient.patch<Department>(`/departments/${id}/`, data);
  return res.data;
}

export async function toggleDepartmentActive(id: number, is_active: boolean): Promise<Department> {
  const res = await apiClient.patch<Department>(`/departments/${id}/`, { is_active });
  return res.data;
}
