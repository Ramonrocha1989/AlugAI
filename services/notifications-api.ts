import axios from 'axios';
import { Notification, NotificationsResponse } from '@/types/notification';

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

export const notificationsService = {
  // Listar notificações
  getAll: async (params?: { read?: boolean; limit?: number; offset?: number }): Promise<NotificationsResponse> => {
    if (USE_MOCK) {
      await delay(300);
      return {
        notifications: [],
        total: 0,
        unreadCount: 0,
      };
    }
    
    const { data } = await api.get<NotificationsResponse>('/notifications', { params });
    return data;
  },

  // Contador de não lidas
  getUnreadCount: async (): Promise<number> => {
    if (USE_MOCK) {
      await delay(100);
      return 0;
    }
    
    const { data } = await api.get<{ count: number }>('/notifications/unread-count');
    return data.count;
  },

  // Marcar como lida
  markAsRead: async (id: string): Promise<Notification> => {
    if (USE_MOCK) {
      await delay(200);
      return {} as Notification;
    }
    
    const { data } = await api.put<Notification>(`/notifications/${id}/read`);
    return data;
  },

  // Marcar todas como lidas
  markAllAsRead: async (): Promise<number> => {
    if (USE_MOCK) {
      await delay(300);
      return 0;
    }
    
    const { data } = await api.put<{ updated: number }>('/notifications/read-all');
    return data.updated;
  },

  // Deletar notificação
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      return;
    }
    
    await api.delete(`/notifications/${id}`);
  },
};
