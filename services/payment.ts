import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

interface CreateCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

interface SubscriptionResponse {
  id: string;
  plan: 'free' | 'lojista';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
}

export const paymentService = {
  /**
   * Cria sessão de checkout
   * 
   * INTEGRAÇÃO STRIPE:
   * - Instalar: npm install stripe @stripe/stripe-js
   * - Backend cria Stripe Checkout Session
   * - Retorna URL do checkout
   * 
   * INTEGRAÇÃO MERCADO PAGO:
   * - Instalar: npm install mercadopago
   * - Backend cria Preference
   * - Retorna init_point (URL do checkout)
   */
  createCheckout: async (
    plan: 'free' | 'lojista',
    paymentMethod: 'credit_card' | 'pix'
  ): Promise<CreateCheckoutResponse> => {
    const { data } = await api.post<CreateCheckoutResponse>('/subscriptions/checkout', {
      plan,
      paymentMethod,
      successUrl: `${window.location.origin}/dashboard?payment=success`,
      cancelUrl: `${window.location.origin}/pricing?payment=cancelled`,
    });
    return data;
  },

  /**
   * Busca assinatura ativa do usuário
   */
  getCurrentSubscription: async (): Promise<SubscriptionResponse | null> => {
    try {
      const { data } = await api.get<SubscriptionResponse>('/subscriptions/me');
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Cancela assinatura
   */
  cancelSubscription: async (subscriptionId: string): Promise<void> => {
    await api.put(`/subscriptions/${subscriptionId}/cancel`);
  },

  /**
   * Webhook handler (backend only)
   * 
   * STRIPE:
   * POST /api/webhooks/stripe
   * - Verifica signature
   * - Atualiza status da assinatura
   * 
   * MERCADO PAGO:
   * POST /api/webhooks/mercadopago
   * - Verifica IPN
   * - Atualiza status da assinatura
   */
};

/**
 * EXEMPLO DE INTEGRAÇÃO STRIPE (Backend - NestJS/Express)
 * 
 * ```typescript
 * import Stripe from 'stripe';
 * 
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 * 
 * // Criar checkout
 * const session = await stripe.checkout.sessions.create({
 *   customer_email: user.email,
 *   payment_method_types: ['card'],
 *   line_items: [{
 *     price_data: {
 *       currency: 'brl',
 *       product_data: { name: 'Plano Lojista' },
 *       recurring: { interval: 'month' },
 *       unit_amount: 29900, // R$ 299,00
 *     },
 *     quantity: 1,
 *   }],
 *   mode: 'subscription',
 *   success_url: successUrl,
 *   cancel_url: cancelUrl,
 * });
 * 
 * return { checkoutUrl: session.url, sessionId: session.id };
 * ```
 * 
 * WEBHOOK:
 * ```typescript
 * @Post('webhooks/stripe')
 * async handleStripeWebhook(@Req() req, @Headers('stripe-signature') sig) {
 *   const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
 *   
 *   if (event.type === 'checkout.session.completed') {
 *     const session = event.data.object;
 *     // Ativar assinatura no banco
 *     await this.subscriptionService.activate(session.customer_email, 'lojista');
 *   }
 * }
 * ```
 */

/**
 * EXEMPLO DE INTEGRAÇÃO MERCADO PAGO (Backend)
 * 
 * ```typescript
 * import mercadopago from 'mercadopago';
 * 
 * mercadopago.configure({
 *   access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
 * });
 * 
 * // Criar preferência
 * const preference = {
 *   items: [{
 *     title: 'Plano Lojista - Mensal',
 *     unit_price: 299.00,
 *     quantity: 1,
 *   }],
 *   back_urls: {
 *     success: successUrl,
 *     failure: cancelUrl,
 *   },
 *   auto_return: 'approved',
 * };
 * 
 * const response = await mercadopago.preferences.create(preference);
 * return { checkoutUrl: response.body.init_point, sessionId: response.body.id };
 * ```
 * 
 * WEBHOOK:
 * ```typescript
 * @Post('webhooks/mercadopago')
 * async handleMercadoPagoWebhook(@Body() body) {
 *   if (body.type === 'payment') {
 *     const payment = await mercadopago.payment.get(body.data.id);
 *     
 *     if (payment.body.status === 'approved') {
 *       // Ativar assinatura
 *       await this.subscriptionService.activate(payment.body.payer.email, 'lojista');
 *     }
 *   }
 * }
 * ```
 */
