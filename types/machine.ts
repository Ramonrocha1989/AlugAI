// Tipos de negócio (UPPERCASE para match com backend)
export type BusinessType = 'SALE' | 'RENTAL' | 'EXCHANGE' | 'SERVICE';

// Categorias principais (UPPERCASE para match com backend)
export type MachineCategory = 
  | 'TRACTORS'
  | 'HARVESTERS'
  | 'PLANTING'
  | 'SPRAYING'
  | 'HAYMAKING'
  | 'IMPLEMENTS'
  | 'LIVESTOCK'
  | 'CONSTRUCTION';

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
  createdAt: string;
  updatedAt: string;
  views: number;
  
  // Owner aninhado (retornado pelo backend)
  owner: {
    id: string;
    name: string;
    email: string;
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
}
