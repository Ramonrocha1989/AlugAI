import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machineService } from '@/services/machine-api';
import { Machine, CreateMachineData, MachineFilters } from '@/types/machine';

// Hook para listar máquinas com filtros
export function useMachines(filters?: MachineFilters) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => machineService.getAll(filters),
  });
}

// Hook para buscar máquina por ID
export function useMachine(id: string) {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: () => machineService.getById(id),
    enabled: !!id,
  });
}

// Hook para listar máquinas do usuário
export function useMyMachines() {
  return useQuery({
    queryKey: ['my-machines'],
    queryFn: () => machineService.getMyMachines(),
  });
}

// Hook para criar máquina
export function useCreateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMachineData) => machineService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
    },
  });
}

// Hook para incrementar visualizações
export function useIncrementViews() {
  return useMutation({
    mutationFn: (id: string) => machineService.incrementViews(id),
  });
}
