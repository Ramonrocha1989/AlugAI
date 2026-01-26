import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  companyName: z.string().min(3, 'Nome da empresa deve ter no mínimo 3 caracteres'),
});

export const equipmentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  dailyPrice: z.number().min(1, 'Preço deve ser maior que zero'),
  location: z.string().min(3, 'Localização é obrigatória'),
  category: z.string().min(3, 'Categoria é obrigatória'),
  images: z.array(z.string().url()).min(1, 'Adicione pelo menos uma imagem'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EquipmentFormData = z.infer<typeof equipmentSchema>;
