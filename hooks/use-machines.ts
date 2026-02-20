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
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('currentUser');
  
  return useQuery({
    queryKey: ['my-machines'],
    queryFn: () => machineService.getMyMachines(),
    enabled: isAuthenticated,
    retry: false,
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

// Hook para editar máquina
export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMachineData> }) => 
      machineService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', variables.id] });
    },
  });
}

// Hook para deletar máquina
export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => machineService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
      queryClient.removeQueries({ queryKey: ['machine', id] });
    },
  });
}

// Hook para incrementar visualizações
export function useIncrementViews() {
  return useMutation({
    mutationFn: (id: string) => machineService.incrementViews(id),
  });
}
