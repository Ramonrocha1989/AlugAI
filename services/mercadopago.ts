import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export type PaidPlanType = 'basico' | 'profissional' | 'premium';

const PLAN_PRICES: Record<PaidPlanType, number> = {
  basico: 89,
  profissional: 179,
  premium: 349,
};

export const mercadoPagoService = {
  createSubscription: async (planName: string, planType: PaidPlanType, userId: string, payerEmail: string) => {
    const preapproval = new PreApproval(client);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br';
    const price = PLAN_PRICES[planType];

    const body = {
      reason: `BaitaBriq - Plano ${planName}`,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months' as const,
        transaction_amount: Number(price),
        currency_id: 'BRL' as const,
      },
      external_reference: `${userId}|${planType}|${price}`,
      back_url: `${siteUrl}/payment/success`,
      payer_email: payerEmail,
    };

    const result = await preapproval.create({ body });

    return result;
  },
};
