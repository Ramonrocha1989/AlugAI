// Re-exportar tipos de máquinas
export * from './machine';

// Tipos legados (manter por compatibilidade temporária)
export interface Equipment {
  id: string;
  name: string;
  description: string;
  dailyPrice: number;
  location: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  category: string;
  available: boolean;
  isPremium?: boolean;
  views?: number;
  whatsappClicks?: number;
  qualifiedLeads?: number;
  ownerPlan?: 'free' | 'lojista';
}

// Dados não sensíveis do usuário (armazenados em localStorage)
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'INDIVIDUAL' | 'COMPANY';
  role: string;
  plan: string;
  planExpiresAt?: string | null;
  maxAds: number;
  maxPremiumAds: number;
  maxFeaturedAds: number;
  isVerifiedSeller: boolean;
  emailVerified: boolean;
  company?: {
    id: string;
    name: string;
  };
  usage: {
    activeAds: number;
    premiumAds: number;
    featuredAds: number;
  };
}

// Dados completos do perfil (incluindo sensíveis - apenas via API)
export interface UserProfile extends User {
  phone: string;
  company: {
    id: string;
    name: string;
    document: string;
  };
}

export interface Plan {
  id: 'free' | 'lojista';
  name: string;
  price: number;
  maxAds: number;
  features: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  userType: 'INDIVIDUAL' | 'COMPANY';
  email: string;
  password: string;
  phone: string;
  // Pessoa Física
  fullName?: string;
  cpf?: string;
  // Empresa
  companyName?: string;
  cnpj?: string;
  responsibleName?: string;
}

export interface CreateEquipmentData {
  name: string;
  description: string;
  dailyPrice: number;
  location: string;
  category: string;
  images: string[];
}
