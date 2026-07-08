import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDepartments, createDepartment, updateDepartment, toggleDepartmentActive } from '@/api/departments.api';

export function useDepartments() {
  return useQuery({ queryKey: ['departments'], queryFn: getDepartments, staleTime: 1000 * 60 * 10 });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateDepartment>[1] }) =>
      updateDepartment(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useToggleDepartmentActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      toggleDepartmentActive(id, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}
