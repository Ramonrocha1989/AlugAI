import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '@/services/reviews-api';
import { CreateReviewData, UpdateReviewData } from '@/types/review';

// Hook para listar avaliações de um usuário
export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => reviewsService.getUserReviews(userId),
    enabled: !!userId,
  });
}

// Hook para listar avaliações de uma máquina
export function useMachineReviews(machineId: string) {
  return useQuery({
    queryKey: ['reviews', 'machine', machineId],
    queryFn: () => reviewsService.getMachineReviews(machineId),
    enabled: !!machineId,
  });
}

// Hook para obter rating de um usuário
export function useUserRating(userId: string) {
  return useQuery({
    queryKey: ['rating', userId],
    queryFn: () => reviewsService.getUserRating(userId),
    enabled: !!userId,
  });
}

// Hook para criar avaliação
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', variables.reviewedUserId] });
      queryClient.invalidateQueries({ queryKey: ['rating', variables.reviewedUserId] });
      if (variables.machineId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'machine', variables.machineId] });
      }
    },
  });
}

// Hook para editar avaliação
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      reviewsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['rating'] });
    },
  });
}

// Hook para deletar avaliação
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['rating'] });
    },
  });
}
