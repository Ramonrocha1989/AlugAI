import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin-api';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats(),
  });
}

export function useAdminUsers(params: any) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) =>
      adminService.banUser(id, isBanned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerifiedSeller }: { id: string; isVerifiedSeller: boolean }) =>
      adminService.verifyUser(id, isVerifiedSeller),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.removeQueries({ queryKey: ['machines-infinite'] });
    },
  });
}

export function useUpdateUserPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan, expiresAt }: { id: string; plan: string; expiresAt: string | null }) =>
      adminService.updateUserPlan(id, plan, expiresAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useAdminMachines(params: any) {
  return useQuery({
    queryKey: ['admin', 'machines', params],
    queryFn: () => adminService.getMachines(params),
  });
}

export function useUpdateMachineStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateMachineStatus(id, status),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'machines'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.removeQueries({ queryKey: ['machines-infinite'] });
    },
  });
}

export function useFeatureMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      adminService.featureMachine(id, isFeatured),
    onSuccess: async (data, variables) => {
      // Atualização otimista na lista admin
      queryClient.setQueryData(['admin', 'machines'], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((m: any) => 
            m.id === variables.id ? { ...m, isFeatured: variables.isFeatured } : m
          );
        }
        if (old.machines) {
          return {
            ...old,
            machines: old.machines.map((m: any) => 
              m.id === variables.id ? { ...m, isFeatured: variables.isFeatured } : m
            )
          };
        }
        return old;
      });
      
      // Remover cache e forçar refetch
      queryClient.removeQueries({ queryKey: ['machines-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'machines'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      await queryClient.refetchQueries({ queryKey: ['machines-infinite'] });
    },
  });
}

export function useDeleteMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'machines'] });
    },
  });
}

export function useAdminReviews(params: any) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => adminService.getReviews(params),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}

export function useAdminVerifications(params: any) {
  return useQuery({
    queryKey: ['admin', 'verifications', params],
    queryFn: () => adminService.getVerificationRequests(params),
  });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.approveVerification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.removeQueries({ queryKey: ['machines-infinite'] });
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminService.rejectVerification(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.removeQueries({ queryKey: ['machines-infinite'] });
    },
  });
}
