import axios from 'axios';
import { Machine, CreateMachineData, MachineFilters, MachinesResponse } from '@/types/machine';
import { User, LoginCredentials, RegisterData } from '@/types';
import { mockMachines } from '@/lib/mock-machines';
import { apiRequest } from '@/lib/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enviar cookies automaticamente
  validateStatus: () => true,
  transformRequest: [(data) => {
    if (data && typeof data === 'object') {
      const cleanData = { ...data };
      if (cleanData.images) {
        cleanData.images = Array.from(cleanData.images).filter(img => img);
      }
      if (cleanData.quickTags) {
        cleanData.quickTags = Array.from(cleanData.quickTags).filter(tag => tag);
      }
      return JSON.stringify(cleanData);
    }
    return data;
  }],
});

// Remover filtro de console (não funciona para logs do navegador)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Remover interceptor de Authorization - cookies são enviados automaticamente

api.interceptors.response.use(
  (response) => {
    // Rejeitar status de erro manualmente
    if (response.status >= 400) {
      const error: any = new Error(response.statusText);
      error.response = response;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    // Não redirecionar automaticamente em erro 401
    // Deixar componentes tratarem o erro
    return Promise.reject(error);
  }
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getUserMachines = (userId: string): Machine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`machines_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

const saveUserMachines = (userId: string, machines: Machine[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`machines_${userId}`, JSON.stringify(machines));
};

const applyFilters = (machines: Machine[], filters?: MachineFilters): Machine[] => {
  if (!filters) return machines;

  return machines.filter(machine => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        machine.name.toLowerCase().includes(searchLower) ||
        machine.description.toLowerCase().includes(searchLower) ||
        machine.manufacturer.toLowerCase().includes(searchLower) ||
        machine.model.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.category && machine.category !== filters.category) return false;
    if (filters.businessType && machine.businessType !== filters.businessType) return false;
    if (filters.manufacturer && machine.manufacturer !== filters.manufacturer) return false;
    if (filters.state && machine.state !== filters.state) return false;
    if (filters.city && machine.city !== filters.city) return false;

    if (filters.minPrice && machine.price < filters.minPrice) return false;
    if (filters.maxPrice && machine.price > filters.maxPrice) return false;
    if (filters.minYear && machine.yearModel < filters.minYear) return false;
    if (filters.maxYear && machine.yearModel > filters.maxYear) return false;
    
    if (filters.minEngineHours && machine.engineHours && machine.engineHours < filters.minEngineHours) return false;
    if (filters.maxEngineHours && machine.engineHours && machine.engineHours > filters.maxEngineHours) return false;
    
    if (filters.minPower && machine.power && machine.power < filters.minPower) return false;
    if (filters.maxPower && machine.power && machine.power > filters.maxPower) return false;

    if (filters.acceptsTradeDown && !machine.acceptsTradeDown) return false;
    if (filters.acceptsTradeUp && !machine.acceptsTradeUp) return false;
    if (filters.acceptsGrains && !machine.acceptsGrains) return false;
    if (filters.isVerifiedSeller && !machine.isVerifiedSeller) return false;

    return true;
  });
};

export const machineService = {
  getAll: async (filters?: MachineFilters): Promise<Machine[]> => {
    if (USE_MOCK) {
      await delay(500);
      let machines = [...mockMachines];
      
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const userMachines = getUserMachines(user.id);
        machines = [...machines, ...userMachines];
      }
      
      return applyFilters(machines, filters);
    }
    
    const { data } = await api.get<MachinesResponse>('/machines', { params: filters });
    return data.data;
  },

  getById: async (id: string): Promise<Machine | null> => {
    if (USE_MOCK) {
      await delay(300);
      const allMachines = [...mockMachines];
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const userMachines = getUserMachines(user.id);
        allMachines.push(...userMachines);
      }
      return allMachines.find(m => m.id === id) || null;
    }
    
    const { data } = await api.get<Machine>(`/machines/${id}`);
    return data;
  },

  create: async (data: CreateMachineData): Promise<Machine> => {
    if (USE_MOCK) {
      await delay(500);
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) throw new Error('Usuário não autenticado');
      
      const user = JSON.parse(currentUser);
      const userMachines = getUserMachines(user.id);
      
      const newMachine: Machine = {
        id: Date.now().toString(),
        ...data,
        ownerId: user.id,
        ownerName: user.company?.name || user.name,
        isVerifiedSeller: false,
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        owner: {
          id: user.id,
          name: user.company?.name || user.name,
          email: user.email,
        },
      };
      
      userMachines.push(newMachine);
      saveUserMachines(user.id, userMachines);
      return newMachine;
    }
    
    // Converter para array denso (sem buracos) para evitar serialização como objeto
    const images = Array.isArray(data.images) 
      ? data.images.filter(img => img && typeof img === 'string' && img.trim())
      : [];
    
    const quickTags = Array.isArray(data.quickTags)
      ? data.quickTags.filter(tag => tag)
      : [];
    
    const payload = {
      ...data,
      images,
      quickTags,
    };
    
    const { data: newMachine } = await api.post<Machine>('/machines', payload);
    return newMachine;
  },

  update: async (id: string, data: Partial<CreateMachineData>): Promise<Machine> => {
    const { data: updatedMachine } = await api.put<Machine>(`/machines/${id}`, data);
    return updatedMachine;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/machines/${id}`);
  },

  getMyMachines: async (): Promise<Machine[]> => {
    if (USE_MOCK) {
      await delay(300);
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return [];
      const user = JSON.parse(currentUser);
      return getUserMachines(user.id);
    }
    
    const { data } = await api.get<Machine[]>('/machines/my');
    return data;
  },

  incrementViews: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(100);
      return;
    }
    
    await api.post(`/machines/${id}/view`);
  },

  trackWhatsApp: async (id: string): Promise<void> => {
    await api.post(`/machines/${id}/track-whatsapp`);
  },

  markLead: async (id: string): Promise<void> => {
    await api.post(`/machines/${id}/mark-lead`);
  },
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    if (USE_MOCK) {
      await delay(500);
      const user: User = {
        id: '1',
        name: 'Agropecuária Exemplo',
        email: credentials.email,
        role: 'USER',
        plan: 'FREE',
        maxAds: 3,
        maxPremiumAds: 0,
        maxFeaturedAds: 0,
        isVerifiedSeller: false,
        emailVerified: true,
        company: {
          id: '1',
          name: 'Agropecuária Exemplo',
        },
        usage: {
          activeAds: 0,
          premiumAds: 0,
          featuredAds: 0,
        },
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    // Backend define cookie httpOnly automaticamente
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Salvar apenas dados não sensíveis do usuário
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    
    return data.user;
  },

  register: async (data: RegisterData): Promise<User> => {
    if (USE_MOCK) {
      await delay(500);
      const user: User = {
        id: Date.now().toString(),
        name: data.companyName,
        email: data.email,
        role: 'USER',
        plan: 'FREE',
        maxAds: 3,
        maxPremiumAds: 0,
        maxFeaturedAds: 0,
        isVerifiedSeller: false,
        emailVerified: false,
        company: {
          id: Date.now().toString(),
          name: data.companyName,
        },
        usage: {
          activeAds: 0,
          premiumAds: 0,
          featuredAds: 0,
        },
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Salvar apenas dados não sensíveis
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    
    return response.user;
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      localStorage.removeItem('currentUser');
      return;
    }
    
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('currentUser');
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.user || parsed;
  },

  getMe: async (): Promise<User> => {
    const data = await apiRequest('/auth/me', { method: 'GET' });
    // ❌ NÃO salvar no localStorage - /auth/me retorna dados sensíveis
    // localStorage é atualizado apenas no login/register
    return data;
  },

  // Buscar perfil completo (incluindo dados sensíveis)
  getProfile: async (): Promise<any> => {
    return await apiRequest('/auth/profile', { method: 'GET' });
  },

  forgotPassword: async (email: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      console.log(`Email de recuperação enviado para: ${email}`);
      return;
    }
    
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      console.log(`Senha resetada com token: ${token}`);
      return;
    }
    
    await api.post('/auth/reset-password', { token, password });
  },

  verifyEmail: async (token: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      console.log(`Email verificado com token: ${token}`);
      return;
    }
    
    await api.post('/auth/verify-email', { token });
  },
};
