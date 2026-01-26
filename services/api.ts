import axios from 'axios';
import { Equipment, User, LoginCredentials, RegisterData, CreateEquipmentData } from '@/types';
import { mockEquipments } from '@/lib/mock-data';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock de usuários
const mockUsers: User[] = [
  { id: '1', email: 'empresa@exemplo.com', companyName: 'Construtora Silva' },
];

// Mock de equipamentos do usuário (localStorage)
const getUserEquipments = (userId: string): Equipment[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`equipments_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

const saveUserEquipments = (userId: string, equipments: Equipment[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`equipments_${userId}`, JSON.stringify(equipments));
};

export const equipmentService = {
  // Lista todos os equipamentos
  getAll: async (filters?: { search?: string; location?: string }): Promise<Equipment[]> => {
    await delay(500);
    
    let equipments = [...mockEquipments];
    
    // Adiciona equipamentos do usuário logado
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const userEquipments = getUserEquipments(user.id);
      equipments = [...equipments, ...userEquipments];
    }
    
    if (filters?.search) {
      equipments = equipments.filter(eq => 
        eq.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters?.location) {
      equipments = equipments.filter(eq => 
        eq.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    return equipments;
  },

  // Busca equipamento por ID
  getById: async (id: string): Promise<Equipment | null> => {
    await delay(300);
    
    const allEquipments = [...mockEquipments];
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const userEquipments = getUserEquipments(user.id);
      allEquipments.push(...userEquipments);
    }
    
    return allEquipments.find(eq => eq.id === id) || null;
  },

  // Cria novo equipamento
  create: async (data: CreateEquipmentData): Promise<Equipment> => {
    await delay(500);
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) throw new Error('Usuário não autenticado');
    
    const user = JSON.parse(currentUser);
    const userEquipments = getUserEquipments(user.id);
    
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      ...data,
      ownerId: user.id,
      ownerName: user.companyName,
      available: true,
    };
    
    userEquipments.push(newEquipment);
    saveUserEquipments(user.id, userEquipments);
    
    return newEquipment;
  },

  // Lista equipamentos do usuário
  getMyEquipments: async (): Promise<Equipment[]> => {
    await delay(300);
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return [];
    
    const user = JSON.parse(currentUser);
    return getUserEquipments(user.id);
  },
};

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(500);
    
    // Mock: aceita qualquer email/senha
    const user: User = {
      id: '1',
      email: credentials.email,
      companyName: 'Construtora Silva',
      token: 'mock-token-' + Date.now(),
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  // Registro
  register: async (data: RegisterData): Promise<User> => {
    await delay(500);
    
    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      companyName: data.companyName,
      token: 'mock-token-' + Date.now(),
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  // Logout
  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem('currentUser');
  },

  // Verifica usuário atual
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  },
};
