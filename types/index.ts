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

export interface User {
  id: string;
  email: string;
  companyName: string;
  token?: string;
  plan?: 'free' | 'lojista';
  maxAds?: number;
  maxPremiumAds?: number;
  maxFeaturedAds?: number;
  usage?: {
    activeAds: number;
    premiumAds: number;
    featuredAds: number;
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
  email: string;
  password: string;
  companyName: string;
}

export interface CreateEquipmentData {
  name: string;
  description: string;
  dailyPrice: number;
  location: string;
  category: string;
  images: string[];
}
