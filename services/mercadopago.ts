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
    const preference = new Preference(client);
    
    const externalReference = `${userId}-${planType}`;
    
    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL' as any,
      })),
      external_reference: externalReference,
    };

    const result = await preference.create({
      body: preferenceData as any,
    });

    return result;
  },
};
