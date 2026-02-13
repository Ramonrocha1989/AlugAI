export type NotificationType = 
  | 'NEW_REVIEW'
  | 'PRICE_DROP'
  | 'NEW_MESSAGE'
  | 'NEW_MACHINE'
  | 'MACHINE_SOLD';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}
