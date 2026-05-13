import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favorites-api';
import { useAuthReady } from './use-auth-ready';

// Hook para listar favoritos
export function useFavorites() {
  const { isAuthenticated, isBootstrapping } = useAuthReady();

  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesService.list(),
    enabled: isAuthenticated && !isBootstrapping,
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Hook para verificar se uma máquina está favoritada
export function useIsFavorited(machineId: string) {
  const { data: favorites = [] } = useFavorites();
  return favorites.includes(machineId);
}

// Hook para adicionar favorito
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (machineId: string) => favoritesService.add(machineId),
    onMutate: async (machineId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<string[]>(['favorites']);
      queryClient.setQueryData<string[]>(['favorites'], (old = []) =>
        old.includes(machineId) ? old : [...old, machineId]
      );
      return { previous };
    },
    onError: (_err, _machineId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['favorites'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorited-machines'] });
    },
  });
}

// Hook para remover favorito
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (machineId: string) => favoritesService.remove(machineId),
    onMutate: async (machineId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<string[]>(['favorites']);
      queryClient.setQueryData<string[]>(['favorites'], (old = []) => old.filter((id) => id !== machineId));
      return { previous };
    },
    onError: (_err, _machineId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['favorites'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorited-machines'] });
    },
  });
}

// Hook para toggle (adicionar/remover)
export function useToggleFavorite() {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { data: favorites = [] } = useFavorites();

  return {
    toggle: (machineId: string) => {
      if (favorites.includes(machineId)) {
        return removeFavorite.mutate(machineId);
      } else {
        return addFavorite.mutate(machineId);
      }
    },
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  };
}

// Hook para listar máquinas favoritadas (com dados completos do backend)
export function useFavoritedMachines() {
  const { isAuthenticated, isBootstrapping } = useAuthReady();

  return useQuery({
    queryKey: ['favorited-machines'],
    queryFn: () => favoritesService.listWithMachines(),
    enabled: isAuthenticated && !isBootstrapping,
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => ({
      data,
      count: data.length,
      isLoading: false,
    }),
  });
}
