import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, machineService } from '@/services/machine-api';
import { companyService } from '@/services/company-api';
import { LoginCredentials, RegisterData, CreateMachineData, MachineFilters } from '@/types';

// Hook para listar máquinas
export const useEquipments = (filters?: MachineFilters) => {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => machineService.getAll(filters),
  });
};

// Hook para buscar máquina por ID
export const useEquipment = (id: string) => {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: () => machineService.getById(id),
    enabled: !!id,
  });
};

// Hook para listar máquinas do usuário
export const useMyEquipments = () => {
  return useQuery({
    queryKey: ['my-machines'],
    queryFn: () => machineService.getMyMachines(),
  });
};

// Hook para criar máquina
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMachineData) => machineService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
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

// Hook para solicitar recuperação de senha
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

// Hook para resetar senha
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => 
      authService.resetPassword(token, password),
  });
};

// Hook para buscar dados da empresa
export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: !!id,
  });
};

// Hook para buscar máquinas da empresa
export const useCompanyMachines = (companyId: string) => {
  return useQuery({
    queryKey: ['company-machines', companyId],
    queryFn: () => companyService.getCompanyMachines(companyId),
    enabled: !!companyId,
  });
};
