import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/machine-api';
import { useAuthReady } from './use-auth-ready';

export function useUser() {
  const { isAuthenticated, isBootstrapping } = useAuthReady();

  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getMe(),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated && !isBootstrapping,
  });
}
