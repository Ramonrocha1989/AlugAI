import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications-api';

// Hook para listar notificações
export function useNotifications(params?: { read?: boolean; limit?: number }) {
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('currentUser');
  
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsService.getAll(params),
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Hook para contador de não lidas
export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsService.getUnreadCount(),
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
