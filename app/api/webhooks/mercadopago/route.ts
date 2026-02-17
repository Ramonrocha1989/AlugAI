import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook recebido:', body);

    // Mercado Pago envia notificações de diferentes tipos
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Buscar detalhes do pagamento
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      console.log('Pagamento:', paymentData);

      // Se pagamento aprovado, ativar plano
      if (paymentData.status === 'approved') {
        const externalReference = paymentData.external_reference;
        
        if (externalReference) {
          const [userId, planType] = externalReference.split('-');
          
          console.log(`Ativando plano ${planType} para usuário ${userId}`);
          
          // Atualizar usuário no banco de dados (Prisma)
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: planType,
              planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
            },
          });
          
          console.log('✅ Plano ativado com sucesso!');
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook', details: error.message },
      { status: 500 }
    );
  }
}

// Mercado Pago também envia GET para validar a URL
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
