import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getMembers, updateUser } from '@/api/users.api';

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers, staleTime: 1000 * 60 * 5 });
}

export function useMembers() {
  return useQuery({ queryKey: ['members'], queryFn: getMembers, staleTime: 1000 * 60 * 5 });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
