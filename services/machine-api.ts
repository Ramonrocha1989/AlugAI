import { Machine, CreateMachineData, MachineFilters, MachinesResponse } from '@/types/machine';
import { User, LoginCredentials, RegisterData, Plan, PlanId, Equipment, CreateEquipmentData, UserProfile, Company } from '@/types';
import { mockMachines } from '@/lib/mock-machines';
import { mockEquipments } from '@/lib/mock-data';
import { apiRequest } from '@/lib/api-refresh';
import { httpClient, setAccessToken, clearAccessToken } from '@/lib/http-client';

const api = httpClient;

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
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

// Definição dos 4 planos com valores e limites
export const PLANS_CONFIG: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    maxAds: 2,
    maxPhotos: 3,
    maxVideos: 0,
    adDuration: 30,
    maxPremiumAds: 0,
    maxFeaturedAds: 0,
    hasAnalytics: false,
    analyticsLevel: 'none',
    hasPriority: false,
    hasStorePage: false,
    hasVerifiedBadge: false,
    supportLevel: 'email_48h',
    features: [
      '2 anúncios ativos',
      '3 fotos por anúncio',
      'Anúncios válidos por 30 dias',
      'Suporte por email (48h)',
    ],
  },
  {
    id: 'basico',
    name: 'Básico',
    price: 89,
    maxAds: 8,
    maxPhotos: 8,
    maxVideos: 0,
    adDuration: -1,
    maxPremiumAds: 0,
    maxFeaturedAds: 0,
    hasAnalytics: true,
    analyticsLevel: 'basic',
    hasPriority: false,
    hasStorePage: false,
    hasVerifiedBadge: true,
    supportLevel: 'email_24h',
    features: [
      '8 anúncios ativos',
      '8 fotos por anúncio',
      'Anúncios ativos enquanto o plano estiver pago',
      'Analytics básico (views + cliques)',
      'Badge "Anunciante"',
      'Suporte por email (24h)',
    ],
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 179,
    maxAds: 20,
    maxPhotos: 15,
    maxVideos: 1,
    adDuration: -1,
    maxPremiumAds: 3,
    maxFeaturedAds: 2,
    hasAnalytics: true,
    analyticsLevel: 'full',
    hasPriority: true,
    hasStorePage: false,
    hasVerifiedBadge: true,
    supportLevel: 'whatsapp_12h',
    features: [
      '20 anúncios ativos',
      '15 fotos por anúncio',
      '1 vídeo por anúncio',
      'Anúncios ativos enquanto o plano estiver pago',
      '3 anúncios Premium simultâneos',
      '2 anúncios Destaque simultâneos',
      'Analytics completo (views + cliques + leads + gráficos)',
      'Badge "Vendedor Verificado"',
      'Prioridade nos resultados',
      'Suporte por WhatsApp (12h)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 349,
    maxAds: 50,
    maxPhotos: 25,
    maxVideos: 3,
    adDuration: -1,
    maxPremiumAds: 8,
    maxFeaturedAds: 5,
    hasAnalytics: true,
    analyticsLevel: 'premium',
    hasPriority: true,
    hasStorePage: true,
    hasVerifiedBadge: true,
    supportLevel: 'whatsapp_4h',
    features: [
      '50 anúncios ativos',
      '25 fotos por anúncio',
      '3 vídeos por anúncio',
      'Anúncios ativos enquanto o plano estiver pago',
      '8 anúncios Premium simultâneos',
      '5 anúncios Destaque simultâneos',
      'Analytics premium + relatório de mercado',
      'Badge "Loja Premium"',
      'Prioridade máxima nos resultados',
      'Página da loja personalizada',
      'Selo de confiança',
      'Suporte WhatsApp dedicado (4h)',
    ],
  },
];

// Helper para buscar config de um plano
export function getPlanConfig(planId: PlanId): Plan {
  return PLANS_CONFIG.find(p => p.id === planId) || PLANS_CONFIG[0];
}

export const planService = {
  getAll: async (): Promise<Plan[]> => {
    try {
      const { data } = await api.get<Plan[]>('/plans');
      // Se o backend retornar os 4 planos com a estrutura nova, usar
      if (data && data.length === 4 && data[0].maxPhotos !== undefined) {
        return data;
      }
    } catch (e) {
      // fallback
    }
    // Usar config local até o backend ser atualizado
    return PLANS_CONFIG;
  },
};

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
    
    const { data } = await api.get<Equipment[]>('/equipments', { params: filters });
    return data;
  },

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
    
    const { data } = await api.get<Equipment>(`/equipments/${id}`);
    return data;
  },

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
        ownerName: user.company?.name || user.name,
        available: true,
      };
      
      userEquipments.push(newEquipment);
      saveUserEquipments(user.id, userEquipments);
      return newEquipment;
    }
    
    const { data: newEquipment } = await api.post<Equipment>('/equipments', data);
    return newEquipment;
  },

  getMyEquipments: async (): Promise<Equipment[]> => {
    if (USE_MOCK) {
      await delay(300);
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return [];
      const user = JSON.parse(currentUser);
      return getUserEquipments(user.id);
    }
    
    const { data } = await api.get<Equipment[]>('/equipments/my');
    return data;
  },

  trackWhatsApp: async (id: string): Promise<void> => {
    await api.post(`/machines/${id}/track-whatsapp`);
  },

  markLead: async (id: string): Promise<void> => {
    await api.post(`/machines/${id}/mark-lead`);
  },
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
    
    const data = await apiRequest('/machines/my', { method: 'GET' });
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
        userType: 'COMPANY',
        role: 'USER',
        plan: 'basico',
        maxAds: 8,
        maxPremiumAds: 0,
        maxFeaturedAds: 0,
        isVerifiedSeller: false,
        emailVerified: true,
        company: {
          id: '1',
          name: 'Agropecuária Exemplo',
        },
        usage: {
          activeAds: 2,
          premiumAds: 1,
          featuredAds: 1,
        },
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.accessToken) setAccessToken(data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    if (USE_MOCK) {
      await delay(500);
      const user: User = {
        id: Date.now().toString(),
        name: data.userType === 'INDIVIDUAL' ? data.fullName! : data.companyName!,
        email: data.email,
        userType: data.userType,
        role: 'USER',
        plan: 'free',
        maxAds: 2,
        maxPremiumAds: 0,
        maxFeaturedAds: 0,
        isVerifiedSeller: false,
        emailVerified: false,
        company: {
          id: Date.now().toString(),
          name: data.userType === 'COMPANY' ? data.companyName! : data.fullName!,
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

    const payload: RegisterData & { responsibleName?: string } = {
      userType: data.userType,
      email: data.email,
      password: data.password,
      phone: data.phone,
      ...(data.userType === 'INDIVIDUAL'
        ? { fullName: data.fullName, ...(data.cpf && { cpf: data.cpf }) }
        : { companyName: data.companyName, responsibleName: data.responsibleName, ...(data.cnpj && { cnpj: data.cnpj }) }
      ),
    };

    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    localStorage.setItem('currentUser', JSON.stringify(response.user));
    if (response.accessToken) setAccessToken(response.accessToken);

    return response.user;
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (_) {}
    clearAccessToken();
    localStorage.removeItem('currentUser');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('currentUser');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.user || parsed;
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  },

  getMe: async (): Promise<User> => {
    const data = await apiRequest('/auth/me', { method: 'GET' });
    if (typeof window !== 'undefined' && data) {
      localStorage.setItem('currentUser', JSON.stringify(data));
    }
    return data;
  },

  getProfile: async (): Promise<UserProfile> => {
    return await apiRequest('/auth/profile', { method: 'GET' });
  },

  forgotPassword: async (email: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await api.post('/auth/reset-password', { token, password });
  },

  verifyEmail: async (token: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await api.post('/auth/verify-email', { token });
  },

  requestDeleteAccount: async (password: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await api.post('/auth/request-delete', { password });
  },

  confirmDeleteAccount: async (token: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(500);
      localStorage.removeItem('currentUser');
      return;
    }
    await api.post('/auth/confirm-delete', { token });
    localStorage.removeItem('currentUser');
  },

  getCompany: async (id: string): Promise<Company> => {
    if (USE_MOCK) {
      await delay(300);
      return {
        id,
        company_name: 'Construtora ABC',
        description: 'Empresa especializada em locação de equipamentos de construção há mais de 10 anos.',
        phone: '(51) 99999-9999',
        location: 'Porto Alegre, RS',
        rating: 4.8,
        total_reviews: 25,
        created_at: '2020-01-01T00:00:00Z',
      };
    }
    
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },

  getCompanyMachines: async (companyId: string): Promise<Machine[]> => {
    if (USE_MOCK) {
      await delay(300);
      return mockMachines.filter(machine => machine.ownerId === companyId);
    }
    
    const { data } = await api.get(`/companies/${companyId}/machines`);
    return data;
  },

  getMyCompany: async (): Promise<Company> => {
    const { data } = await api.get('/companies/me');
    return data;
  },

  updateCompanyProfile: async (profileData: Partial<Company>): Promise<Company> => {
    const { data } = await api.put('/companies/profile', profileData);
    return data;
  },
};