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
    
    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL' as any,
      })),
    };
    
    console.log('📤 Dados da preferência:', JSON.stringify(preferenceData, null, 2));

    const result = await preference.create({
      body: preferenceData as any,
    });
    
    console.log('✅ Preferência criada com sucesso:', result.id);
    console.log('🔗 URL de teste direto:', result.init_point);

    return result;
  },
};
