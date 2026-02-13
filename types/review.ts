export interface Review {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  machineId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  reviewer?: {
    id: string;
    name: string;
  };
  machine?: {
    id: string;
    name: string;
  };
}

export interface UserRating {
  userId: string;
  totalReviews: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewData {
  reviewedUserId: string;
  machineId?: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating: number;
  comment?: string;
}
