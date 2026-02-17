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

    const siteUrl = 'http://localhost:3001'; // TODO: usar variável de ambiente

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
          description: item.description,
        })),
        back_urls: {
          success: `${siteUrl}/payment/success`,
          failure: `${siteUrl}/payment/failure`,
          pending: `${siteUrl}/payment/pending`,
        },
        external_reference: `${userId}-${planType}`,
      },
    });

    return result;
  },
};
