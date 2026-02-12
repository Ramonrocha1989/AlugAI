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
}

export interface User {
  id: string;
  email: string;
  companyName: string;
  token?: string;
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
