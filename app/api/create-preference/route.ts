import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoService } from '@/services/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const { planName, planPrice, planDescription, planType } = await request.json();

    // Pegar usuário do token/session (simplificado)
    const userId = 'user-123'; // TODO: Pegar do token JWT

    const preference = await mercadoPagoService.createPreference(
      [
        {
          title: planName,
          quantity: 1,
          unit_price: planPrice,
          description: planDescription,
        },
      ],
      userId,
      planType
    );

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('Erro ao criar preferência:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pagamento', details: error.message },
      { status: 500 }
    );
  }
}
