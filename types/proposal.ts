export interface Proposal {
  id: string;
  machineId: string;
  senderId: string;
  receiverId: string;
  proposedPrice: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  counterPrice: number | null;
  counterMessage: string | null;
  createdAt: string;
  updatedAt: string;
  machine: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  sender: {
    id: string;
    name: string;
    phone?: string;
  };
  receiver: {
    id: string;
    name: string;
    phone?: string;
  };
  viewedByReceiver?: boolean;
  viewedBySender?: boolean;
}

export interface CreateProposalData {
  machineId: string;
  proposedPrice: number;
  message: string;
}

export interface CounterProposalData {
  counterPrice: number;
  counterMessage: string;
}
