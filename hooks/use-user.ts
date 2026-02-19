import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/machine-api';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getMe(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
