import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/machine-api';
import { useMounted } from './use-mounted';

export function useUser() {
  const mounted = useMounted();
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getMe(),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: mounted && !!localStorage.getItem('currentUser'),
  });
}
