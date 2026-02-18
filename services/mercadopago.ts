import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
  description?: string;
}

export const mercadoPagoService = {
  createPreference: async (items: PaymentItem[], userId: string, planType: 'lojista') => {
    console.log('💳 Criando preferência Mercado Pago...');
    console.log('📊 Items:', items);
    console.log('👤 UserId:', userId);
    console.log('🎯 PlanType:', planType);
    
    const preference = new Preference(client);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    
    const preferenceData = {
      items: items.map(item => ({
        id: `item-${Date.now()}`,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL' as any,
        description: item.description,
      })),
      back_urls: {
        success: `${siteUrl}/payment/success`,
        failure: `${siteUrl}/payment/failure`,
        pending: `${siteUrl}/payment/pending`,
      },
      external_reference: `${userId}-${planType}`,
    };
    
    console.log('📤 Dados da preferência:', JSON.stringify(preferenceData, null, 2));

    const result = await preference.create({
      body: preferenceData as any,
    });
    
    console.log('✅ Preferência criada com sucesso:', result.id);

    return result;
  },
};
