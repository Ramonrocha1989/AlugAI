import { useMutation, useQueryClient } from '@tanstack/react-query';
import { machineService } from '@/services/machine-api';

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao cancelar assinatura');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useMarkLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (machineId: string) => machineService.markLead(machineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
    },
  });
}
