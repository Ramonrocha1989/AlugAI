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

export type PaidPlanType = 'basico' | 'profissional' | 'premium';

export const mercadoPagoService = {
  createPreference: async (items: PaymentItem[], userId: string, planType: PaidPlanType) => {
    const preference = new Preference(client);
    
    const externalReference = `${userId}-${planType}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    
    const result = await preference.create({
      body: {
        items: items.map((item, index) => ({
          id: `item-${index}`,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
        })),
        external_reference: externalReference,
        back_urls: {
          success: `${siteUrl}/payment/success`,
          failure: `${siteUrl}/payment/failure`,
          pending: `${siteUrl}/payment/pending`,
        },
        notification_url: `${siteUrl}/api/webhook/mercadopago`,
      },
    });

    return result;
  },
};
