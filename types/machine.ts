import { PlanId } from '@/types';

// Tipos de negócio (UPPERCASE para match com backend)
export type BusinessType = 'SALE' | 'RENTAL' | 'EXCHANGE' | 'SERVICE';

// Categorias - agora dinâmicas do backend (slug)
export type MachineCategory = string;

// Tags rápidas (UPPERCASE para match com backend)
export type QuickTag = 
  | 'NEW_TIRES'
  | 'ORIGINAL_CABIN'
  | 'AUTHORIZED_SERVICE'
  | 'GPS_INTEGRATED'
  | 'AIR_CONDITIONING'
  | 'SINGLE_OWNER'
  | 'COMPLETE_DOCS';

// Interface principal da Máquina
export interface Machine {
  id: string;
  
  // Tipo de negócio
  businessType: BusinessType;
  
  // Identificação básica
  name: string;
  description: string;
  category: MachineCategory;
  
  // Dados técnicos obrigatórios
  manufacturer: string;
  model: string;
  yearModel: number;
  power?: number;
  engineHours?: number;
  serialNumber?: string;
  
  // Preço e negociação
  price: number;
  acceptsTradeDown: boolean;
  acceptsTradeUp: boolean;
  acceptsGrains: boolean;
  acceptsFinancing: boolean;
  
  // Localização
  state: string;
  city: string;
  zipCode?: string;
  
  // Mídia
  images: string[];
  videoUrl?: string;
  
  // Tags e adicionais
  quickTags: QuickTag[];
  
  // Proprietário
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  isVerifiedSeller: boolean;
  isFeatured?: boolean;
  
  // Metadados
  available: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  
  // Monetização
  isPremium?: boolean;
  whatsappClicks?: number;
  qualifiedLeads?: number;
  ownerPlan?: PlanId;
  
  // Analytics (retornado em /machines/my)
  favoritesCount?: number;
  proposalsCount?: {
    pending: number;
    accepted: number;
    rejected: number;
    countered: number;
  };
  
  // Owner aninhado (retornado pelo backend)
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

// Analytics summary do usuário
export interface AnalyticsSummary {
  totals: {
    views: number;
    whatsappClicks: number;
    qualifiedLeads: number;
    favorites: number;
    proposals: {
      pending: number;
      accepted: number;
      rejected: number;
      countered: number;
    };
  };
  averages: {
    daysToFirstContact: number;
    viewsPerMachine: number;
    clickRatePercent: number;
  };
}

// Benchmarks por categoria
export interface CategoryBenchmarks {
  category: string;
  platformAverage: {
    views: number;
    whatsappClicks: number;
    clickRatePercent: number;
    daysToSell: number;
    averagePrice: number;
  };
  userAverage: {
    views: number;
    whatsappClicks: number;
    clickRatePercent: number;
    averagePrice: number;
  };
  comparison: {
    viewsVsPlatform: number;
    clickRateVsPlatform: number;
  };
}

// Response de listagem com paginação
export interface MachinesResponse {
  data: Machine[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Interface para criação de máquina
export interface CreateMachineData {
  businessType: BusinessType;
  name: string;
  description: string;
  category: MachineCategory;
  manufacturer: string;
  model: string;
  yearModel: number;
  power?: number;
  engineHours?: number;
  serialNumber?: string;
  price: number;
  acceptsTradeDown: boolean;
  acceptsTradeUp: boolean;
  acceptsGrains: boolean;
  acceptsFinancing: boolean;
  state: string;
  city: string;
  zipCode?: string;
  images: string[];
  videoUrl?: string;
  quickTags: QuickTag[];
  ownerPhone?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
}

// Filtros de busca
export interface MachineFilters {
  search?: string;
  category?: MachineCategory;
  businessType?: BusinessType;
  manufacturer?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minEngineHours?: number;
  maxEngineHours?: number;
  minPower?: number;
  maxPower?: number;
  acceptsTradeDown?: boolean;
  acceptsTradeUp?: boolean;
  acceptsGrains?: boolean;
  isVerifiedSeller?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
}
