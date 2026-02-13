import axios from 'axios';
import { Review, UserRating, CreateReviewData, UpdateReviewData } from '@/types/review';

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
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewsService = {
  // Criar avaliação
  create: async (data: CreateReviewData): Promise<Review> => {
    if (USE_MOCK) {
      await delay(500);
      return {
        id: Date.now().toString(),
        reviewerId: 'mock-user',
        reviewedUserId: data.reviewedUserId,
        machineId: data.machineId,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    const { data: review } = await api.post<Review>('/reviews', data);
    return review;
  },

  // Listar avaliações de um usuário
  getUserReviews: async (userId: string): Promise<{ reviews: Review[]; stats: any }> => {
    if (USE_MOCK) {
      await delay(300);
      return {
        reviews: [],
        stats: {
          totalReviews: 0,
          averageRating: 0,
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStar: 0,
        },
      };
    }
    
    const { data } = await api.get(`/reviews/user/${userId}`);
    return data;
  },

  // Listar avaliações de uma máquina
  getMachineReviews: async (machineId: string): Promise<Review[]> => {
    if (USE_MOCK) {
      await delay(300);
      return [];
    }
    
    const { data } = await api.get<Review[]>(`/reviews/machine/${machineId}`);
    return data;
  },

  // Obter rating de um usuário
  getUserRating: async (userId: string): Promise<UserRating> => {
    if (USE_MOCK) {
      await delay(200);
      return {
        userId,
        totalReviews: 0,
        averageRating: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    
    // Usa a rota de reviews que já existe e extrai o rating
    const { data } = await api.get(`/reviews/user/${userId}`);
    return {
      userId,
      totalReviews: data.stats?.totalReviews || 0,
      averageRating: data.stats?.averageRating || 0,
      distribution: {
        5: data.stats?.fiveStars || 0,
        4: data.stats?.fourStars || 0,
        3: data.stats?.threeStars || 0,
        2: data.stats?.twoStars || 0,
        1: data.stats?.oneStar || 0,
      },
    };
  },

  // Editar avaliação
  update: async (id: string, data: UpdateReviewData): Promise<Review> => {
    if (USE_MOCK) {
      await delay(500);
      return {
        id,
        reviewerId: 'mock-user',
        reviewedUserId: 'mock-reviewed',
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    const { data: review } = await api.put<Review>(`/reviews/${id}`, data);
    return review;
  },

  // Deletar avaliação
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      return;
    }
    
    await api.delete(`/reviews/${id}`);
  },
};
