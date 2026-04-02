import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/machine-api';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => {
      // Sempre usar API real, não mock
      return authService.getMe();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // Não tentar novamente em caso de erro
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('currentUser'), // Só executar se tiver usuário
  });
}
