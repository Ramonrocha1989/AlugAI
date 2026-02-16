import axios from 'axios';
import { Machine, CreateMachineData, MachineFilters, MachinesResponse } from '@/types/machine';
import { User, LoginCredentials, RegisterData } from '@/types';
import { mockMachines } from '@/lib/mock-machines';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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
        ownerName: user.companyName,
        isVerifiedSeller: false,
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        owner: {
          id: user.id,
          name: user.companyName,
          email: user.email,
        },
      };
      
      userMachines.push(newMachine);
      saveUserMachines(user.id, userMachines);
      return newMachine;
    }
    
    const { data: newMachine } = await api.post<Machine>('/machines', data);
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
        email: credentials.email,
        companyName: 'Agropecuária Exemplo',
        token: 'mock-token-' + Date.now(),
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    const { data } = await api.post<User>('/auth/login', credentials);
    localStorage.setItem('currentUser', JSON.stringify(data));
    return data;
  },

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
    
    const { data: user } = await api.post<User>('/auth/register', data);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      localStorage.removeItem('currentUser');
      return;
    }
    
    try {
      await api.post('/auth/logout');
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
