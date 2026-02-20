import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favorites-api';

// Hook para listar favoritos
export function useFavorites() {
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('currentUser');
  
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesService.list(),
    enabled: isAuthenticated,
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
    onSuccess: () => {
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
    onSuccess: () => {
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
  return useQuery({
    queryKey: ['favorited-machines'],
    queryFn: () => favoritesService.listWithMachines(),
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => ({
      data,
      count: data.length,
      isLoading: false,
    }),
  });
}
