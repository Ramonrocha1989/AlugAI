import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications-api';
import { useAuthReady } from './use-auth-ready';

// Hook para listar notificações
export function useNotifications(
  params?: { read?: boolean; limit?: number; offset?: number },
  options?: { enabled?: boolean }
) {
  const { isAuthenticated, isBootstrapping } = useAuthReady();
  const listEnabled = options?.enabled !== false;

  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsService.getAll(params),
    enabled: isAuthenticated && !isBootstrapping && listEnabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Hook para contador de não lidas (leve — use no header / sino)
export function useUnreadCount() {
  const { isAuthenticated, isBootstrapping } = useAuthReady();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsService.getUnreadCount(),
    enabled: isAuthenticated && !isBootstrapping,
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Hook para marcar como lida
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Hook para marcar todas como lidas
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Hook para deletar notificação
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
