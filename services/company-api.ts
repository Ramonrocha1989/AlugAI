import axios from 'axios';
import { Company } from '@/types';
import { Machine } from '@/types/machine';
import { mockMachines } from '@/lib/mock-machines';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Adicionar token do localStorage em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock de dados das empresas baseado nas máquinas
const mockCompanies: Record<string, Company> = {
  '1': {
    id: '1',
    company_name: 'Agropecuária Campos Verdes',
    description: 'Empresa especializada em máquinas agrícolas de alta qualidade. Atuamos no mercado há mais de 15 anos.',
    phone: '(55) 4999-8877',
    location: 'Passo Fundo, RS',
    website: 'www.camposverdes.com.br',
    rating: 4.9,
    total_reviews: 42,
    created_at: new Date('2018-03-15'),
  },
  '2': {
    id: '2',
    company_name: 'Fazenda Santa Rita',
    description: 'Fazenda familiar com tradição na agricultura. Vendemos apenas equipamentos bem conservados.',
    phone: '(55) 4988-7766',
    location: 'Cruz Alta, RS',
    website: null,
    rating: 4.7,
    total_reviews: 28,
    created_at: new Date('2019-07-22'),
  },
  '3': {
    id: '3',
    company_name: 'Arrozeira Fronteira Sul',
    description: 'Especializada em cultivo de arroz irrigado. Equipamentos sempre bem mantidos e revisados.',
    phone: '(55) 5999-8877',
    location: 'Uruguaiana, RS',
    website: 'www.fronteirasul.com.br',
    rating: 4.8,
    total_reviews: 35,
    created_at: new Date('2017-11-08'),
  },
  '4': {
    id: '4',
    company_name: 'Agrícola Paraná',
    description: 'Empresa paranaense focada em tecnologia agrícola. Oferecemos os melhores equipamentos do mercado.',
    phone: '(45) 4988-7766',
    location: 'Cascavel, PR',
    website: 'www.agricolaparana.com.br',
    rating: 4.6,
    total_reviews: 51,
    created_at: new Date('2016-05-12'),
  },
  '5': {
    id: '5',
    company_name: 'Cooperativa Agrícola Oeste',
    description: 'Cooperativa de produtores rurais. Comercializamos equipamentos de nossos cooperados.',
    phone: '(49) 4977-6655',
    location: 'Chapecó, SC',
    website: 'www.coopagro.com.br',
    rating: 4.5,
    total_reviews: 67,
    created_at: new Date('2015-01-20'),
  },
  '6': {
    id: '6',
    company_name: 'Locadora Máquinas Sul',
    description: 'Locação de equipamentos para construção civil. Frota sempre renovada e bem conservada.',
    phone: '(51) 5188-7766',
    location: 'Porto Alegre, RS',
    website: 'www.locadorasul.com.br',
    rating: 4.9,
    total_reviews: 89,
    created_at: new Date('2014-09-03'),
  },
  '7': {
    id: '7',
    company_name: 'Sítio Boa Vista',
    description: 'Propriedade rural familiar. Vendemos nossos equipamentos com transparência e honestidade.',
    phone: '(42) 4988-7766',
    location: 'Guarapuava, PR',
    website: null,
    rating: 4.4,
    total_reviews: 19,
    created_at: new Date('2020-02-14'),
  },
  '8': {
    id: '8',
    company_name: 'Fazenda Serra Catarinense',
    description: 'Fazenda especializada em pecuária leiteira. Equipamentos voltados para produção de forragem.',
    phone: '(49) 4966-5544',
    location: 'Lages, SC',
    website: 'www.serracatarinense.com.br',
    rating: 4.7,
    total_reviews: 33,
    created_at: new Date('2018-12-05'),
  },
};

export const companyService = {
  getCompany: async (id: string): Promise<Company> => {
    console.log('getCompany called with id:', id);
    console.log('USE_MOCK:', USE_MOCK);
    console.log('API URL:', api.defaults.baseURL);
    
    if (USE_MOCK) {
      await delay(300);
      console.log('Available companies:', Object.keys(mockCompanies));
      const company = mockCompanies[id];
      console.log('Found company:', company);
      
      if (!company) {
        console.error('Company not found for id:', id);
        throw new Error('Empresa não encontrada');
      }
      return company;
    }
    
    try {
      console.log('Calling API:', `/companies/${id}`);
      console.log('Full URL:', `${api.defaults.baseURL}/companies/${id}`);
      const { data } = await api.get<Company>(`/companies/${id}`);
      console.log('API Response:', data);
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  getCompanyMachines: async (companyId: string): Promise<Machine[]> => {
    console.log('getCompanyMachines called with id:', companyId);
    console.log('USE_MOCK:', USE_MOCK);
    
    if (USE_MOCK) {
      await delay(300);
      // Filtrar máquinas do mock por ownerId
      const machines = mockMachines.filter(machine => machine.ownerId === companyId);
      console.log('Mock machines found:', machines);
      return machines;
    }
    
    try {
      // Tentar primeiro o endpoint específico da empresa
      console.log('Calling API:', `/companies/${companyId}/machines`);
      const { data } = await api.get(`/companies/${companyId}/machines`);
      console.log('API machines response:', data);
      return data;
    } catch (error: any) {
      console.error('API Error getting machines:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },
};