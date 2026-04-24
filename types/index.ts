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
  ownerPlan?: PlanId;
}

// Dados não sensíveis do usuário (armazenados em localStorage)
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'INDIVIDUAL' | 'COMPANY';
  role: string;
  plan: PlanId;
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

export type PlanId = 'free' | 'basico' | 'profissional' | 'premium';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  maxAds: number;
  maxPhotos: number;
  maxVideos: number;
  adDuration: number; // dias
  maxPremiumAds: number;
  maxFeaturedAds: number;
  hasAnalytics: boolean;
  analyticsLevel: 'none' | 'basic' | 'full' | 'premium';
  hasPriority: boolean;
  hasStorePage: boolean;
  hasVerifiedBadge: boolean;
  supportLevel: 'email_48h' | 'email_24h' | 'whatsapp_12h' | 'whatsapp_4h';
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

// Tipos para perfil da empresa
export interface Company {
  id: string;
  company_name: string | null;
  description: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  rating?: number;
  total_reviews?: number;
  created_at: Date;
  plan?: PlanId;
  is_verified?: boolean;
  logo?: string | null;
  banner?: string | null;
  gallery?: string[];
  businessHours?: string | null;
  categoriesWorked?: string[];
}
