import axios from 'axios';
import { Equipment, User, LoginCredentials, RegisterData, CreateEquipmentData } from '@/types';
import { mockEquipments } from '@/lib/mock-data';

// Configuração do cliente Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Modo mock (true = usa dados mockados, false = usa backend real)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Interceptor: adiciona token JWT em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Interceptor: trata erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('currentUser');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
    if (USE_MOCK) {
      await delay(500);
      let equipments = [...mockEquipments];
      
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
    }
    
    // Backend real
    const { data } = await api.get<Equipment[]>('/equipments', { params: filters });
    return data;
  },

  // Busca equipamento por ID
  getById: async (id: string): Promise<Equipment | null> => {
    if (USE_MOCK) {
      await delay(300);
      const allEquipments = [...mockEquipments];
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const userEquipments = getUserEquipments(user.id);
        allEquipments.push(...userEquipments);
      }
      return allEquipments.find(eq => eq.id === id) || null;
    }
    
    // Backend real
    const { data } = await api.get<Equipment>(`/equipments/${id}`);
    return data;
  },

  // Cria novo equipamento
  create: async (data: CreateEquipmentData): Promise<Equipment> => {
    if (USE_MOCK) {
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
    }
    
    // Backend real
    const { data: newEquipment } = await api.post<Equipment>('/equipments', data);
    return newEquipment;
  },

  // Lista equipamentos do usuário
  getMyEquipments: async (): Promise<Equipment[]> => {
    if (USE_MOCK) {
      await delay(300);
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return [];
      const user = JSON.parse(currentUser);
      return getUserEquipments(user.id);
    }
    
    // Backend real
    const { data } = await api.get<Equipment[]>('/equipments/my');
    return data;
  },
};

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User> => {
    if (USE_MOCK) {
      await delay(500);
      const user: User = {
        id: '1',
        email: credentials.email,
        companyName: 'Construtora Silva',
        token: 'mock-token-' + Date.now(),
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    // Backend real
    const { data } = await api.post<User>('/auth/login', credentials);
    localStorage.setItem('currentUser', JSON.stringify(data));
    return data;
  },

  // Registro
  register: async (data: RegisterData): Promise<User> => {
    if (USE_MOCK) {
      await delay(500);
      const user: User = {
        id: Date.now().toString(),
        email: data.email,
        companyName: data.companyName,
        token: 'mock-token-' + Date.now(),
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    // Backend real
    const { data: user } = await api.post<User>('/auth/register', data);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  // Logout
  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      localStorage.removeItem('currentUser');
      return;
    }
    
    // Backend real
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('currentUser');
    }
  },

  // Verifica usuário atual
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  },

  // Solicita recuperação de senha
  forgotPassword: async (email: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      console.log(`Email de recuperação enviado para: ${email}`);
      return;
    }
    
    await api.post('/auth/forgot-password', { email });
  },

  // Reseta a senha com token
  resetPassword: async (token: string, password: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      console.log(`Senha resetada com token: ${token}`);
      return;
    }
    
    await api.post('/auth/reset-password', { token, password });
  },

  // Verifica email com token
  verifyEmail: async (token: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      console.log(`Email verificado com token: ${token}`);
      return;
    }
    
    await api.post('/auth/verify-email', { token });
  },
};
