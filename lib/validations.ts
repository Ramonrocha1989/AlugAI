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
  businessType: z.enum(['SALE', 'RENTAL', 'EXCHANGE', 'SERVICE'], { required_error: 'Tipo de negócio é obrigatório' }),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  category: z.enum(['TRACTORS', 'HARVESTERS', 'PLANTING', 'SPRAYING', 'HAYMAKING', 'IMPLEMENTS', 'LIVESTOCK', 'CONSTRUCTION'], { required_error: 'Categoria é obrigatória' }),
  manufacturer: z.string().min(2, 'Fabricante é obrigatório'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  yearModel: z.number().min(1900).max(new Date().getFullYear() + 1, 'Ano inválido'),
  power: z.number().optional(),
  engineHours: z.number().optional(),
  serialNumber: z.string().optional(),
  price: z.number().min(1, 'Preço deve ser maior que zero'),
  acceptsTradeDown: z.boolean().default(false),
  acceptsTradeUp: z.boolean().default(false),
  acceptsGrains: z.boolean().default(false),
  acceptsFinancing: z.boolean().default(false),
  state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  zipCode: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'Adicione pelo menos uma imagem'),
  videoUrl: z.string().url().optional().or(z.literal('')),
  quickTags: z.array(z.enum(['NEW_TIRES', 'ORIGINAL_CABIN', 'AUTHORIZED_SERVICE', 'GPS_INTEGRATED', 'AIR_CONDITIONING', 'SINGLE_OWNER', 'COMPLETE_DOCS'])).default([]),
  ownerPhone: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EquipmentFormData = z.infer<typeof equipmentSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
