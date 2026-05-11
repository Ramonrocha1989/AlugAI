import { z } from 'zod';

// Schema para criação de máquina
export const createMachineSchema = z.object({
  businessType: z.enum(['SALE', 'RENTAL', 'EXCHANGE', 'SERVICE']),
  
  name: z.string().min(5, 'Nome deve ter no mínimo 5 caracteres'),
  description: z.string().min(100, 'Descrição deve ter no mínimo 100 caracteres'),
  
  category: z.enum([
    'TRACTORS',
    'HARVESTERS',
    'PLANTING',
    'SPRAYING',
    'HAYMAKING',
    'IMPLEMENTS',
    'LIVESTOCK',
    'CONSTRUCTION',
  ]),
  
  manufacturer: z.string().min(2, 'Fabricante é obrigatório'),
  model: z.string().min(2, 'Modelo é obrigatório'),
  yearModel: z.number()
    .min(1980, 'Ano deve ser maior que 1980')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  
  power: z.number().min(1).optional(),
  engineHours: z.number().min(0).optional(),
  serialNumber: z.string()
    .min(6, 'Número de série deve ter no mínimo 6 caracteres')
    .max(25, 'Número de série deve ter no máximo 25 caracteres')
    .regex(/^[A-Z0-9-]+$/i, 'Apenas letras, números e hífens são permitidos'),
  
  price: z.number().min(1, 'Preço deve ser maior que zero'),
  
  acceptsTradeDown: z.boolean().default(false),
  acceptsTradeUp: z.boolean().default(false),
  acceptsGrains: z.boolean().default(false),
  acceptsFinancing: z.boolean().default(false),
  
  state: z.string().length(2, 'Estado inválido'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  zipCode: z.string().optional(),
  
  images: z.array(z.string().url()).min(1, 'Adicione pelo menos uma imagem').max(25, 'Máximo de 25 imagens'),
  videoUrl: z.string().url().optional().or(z.literal('')),
  
  quickTags: z.array(z.enum([
    'NEW_TIRES',
    'ORIGINAL_CABIN',
    'AUTHORIZED_SERVICE',
    'GPS_INTEGRATED',
    'AIR_CONDITIONING',
    'SINGLE_OWNER',
    'COMPLETE_DOCS',
  ])).default([]),
  
  ownerPhone: z.string()
    .regex(/^\d{10,11}$/, 'Telefone inválido. Use formato: DDD + número (ex: 51999887766)')
    .optional(),
});

// Schema para filtros de busca
export const machineFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  businessType: z.enum(['SALE', 'RENTAL', 'EXCHANGE', 'SERVICE']).optional(),
  manufacturer: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
  minEngineHours: z.number().optional(),
  maxEngineHours: z.number().optional(),
  minPower: z.number().optional(),
  maxPower: z.number().optional(),
  acceptsTradeDown: z.boolean().optional(),
  acceptsTradeUp: z.boolean().optional(),
  acceptsGrains: z.boolean().optional(),
  acceptsFinancing: z.boolean().optional(),
  isVerifiedSeller: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type CreateMachineFormData = z.infer<typeof createMachineSchema>;
export type MachineFiltersFormData = z.infer<typeof machineFiltersSchema>;
