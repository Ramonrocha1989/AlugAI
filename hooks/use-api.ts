import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService, authService } from '@/services/api';
import { LoginCredentials, RegisterData, CreateEquipmentData } from '@/types';

// Hook para listar equipamentos
export const useEquipments = (filters?: { search?: string; location?: string }) => {
  return useQuery({
    queryKey: ['equipments', filters],
    queryFn: () => equipmentService.getAll(filters),
  });
};

// Hook para buscar equipamento por ID
export const useEquipment = (id: string) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentService.getById(id),
    enabled: !!id,
  });
};

// Hook para listar equipamentos do usuário
export const useMyEquipments = () => {
  return useQuery({
    queryKey: ['my-equipments'],
    queryFn: () => equipmentService.getMyEquipments(),
  });
};

// Hook para criar equipamento
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEquipmentData) => equipmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['my-equipments'] });
    },
  });
};

// Hook para login
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
  });
};

// Hook para registro
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
