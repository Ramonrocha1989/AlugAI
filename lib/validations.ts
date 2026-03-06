import { z } from 'zod';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.discriminatedUnion('userType', [
  // Pessoa Física
  z.object({
    userType: z.literal('INDIVIDUAL'),
    fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    cpf: z.string()
      .optional()
      .refine((doc) => {
        if (!doc) return true;
        const clean = doc.replace(/\D/g, '');
        return clean.length === 11 && cpf.isValid(doc);
      }, 'CPF inválido'),
    phone: z.string()
      .regex(/^\d{10,11}$/, 'Telefone inválido. Use formato: DDD + número (ex: 51999887766)'),
    email: z.string().email('Email inválido'),
    password: z.string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  }),
  // Empresa
  z.object({
    userType: z.literal('COMPANY'),
    companyName: z.string().min(3, 'Nome da empresa deve ter no mínimo 3 caracteres'),
    cnpj: z.string()
      .optional()
      .refine((doc) => {
        if (!doc) return true;
        const clean = doc.replace(/\D/g, '');
        return clean.length === 14 && cnpj.isValid(doc);
      }, 'CNPJ inválido'),
    responsibleName: z.string().min(3, 'Nome do responsável é obrigatório'),
    phone: z.string()
      .regex(/^\d{10,11}$/, 'Telefone inválido. Use formato: DDD + número (ex: 51999887766)'),
    email: z.string().email('Email inválido'),
    password: z.string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  }),
]);

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
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string().min(8, 'Confirmação de senha obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const deleteAccountSchema = z.object({
  password: z.string().min(6, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EquipmentFormData = z.infer<typeof equipmentSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
