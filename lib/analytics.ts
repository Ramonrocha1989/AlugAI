// Google Analytics Event Tracking

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const analytics = {
  // 1. Clique no WhatsApp
  trackWhatsAppClick: (machineName: string, price: number, sellerName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        machine_name: machineName,
        price: price,
        seller_name: sellerName,
      });
    }
  },

  // 2. Adicionar Favorito
  trackFavoriteAdd: (machineId: string, machineName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'favorite_add', {
        machine_id: machineId,
        machine_name: machineName,
      });
    }
  },

  // 3. Remover Favorito
  trackFavoriteRemove: (machineId: string, machineName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'favorite_remove', {
        machine_id: machineId,
        machine_name: machineName,
      });
    }
  },

  // 4. Criar Avaliação
  trackReviewCreate: (rating: number, hasComment: boolean) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'review_create', {
        rating: rating,
        has_comment: hasComment,
      });
    }
  },

  // 5. Uso de Filtros
  trackFilterUsed: (filterType: string, filterValue: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filter_used', {
        filter_type: filterType,
        filter_value: filterValue,
      });
    }
  },

  // 6. Busca
  trackSearch: (searchTerm: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
      });
    }
  },

  // 7. Visualização de Máquina
  trackMachineView: (machineId: string, machineName: string, category: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'machine_view', {
        machine_id: machineId,
        machine_name: machineName,
        category: category,
      });
    }
  },

  // 8. Cadastro de Máquina
  trackMachineCreate: (category: string, businessType: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'machine_create', {
        category: category,
        business_type: businessType,
      });
    }
  },

  // 9. Compra (e-commerce GA4)
  trackPurchase: (transactionId: string, planName: string, value: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'BRL',
        items: [{ item_name: planName, price: value, quantity: 1 }],
      });
    }
  },
};
