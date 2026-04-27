import { useMutation, useQueryClient } from '@tanstack/react-query';
import { machineService } from '@/services/machine-api';
import { httpClient, validateEndpoint } from '@/lib/http-client';

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await httpClient.post(validateEndpoint('/subscriptions/cancel'));
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
