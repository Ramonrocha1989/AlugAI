import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoService } from '@/services/mercadopago';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { planName, planPrice, planDescription, planType } = await request.json();

    // Validar plano
    const validPlans = ['basico', 'profissional', 'premium'];
    if (!validPlans.includes(planType)) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;
    
    try {
      const decoded = jwt.decode(token) as { userId?: string; sub?: string } | null;
      userId = decoded?.userId || decoded?.sub || '';
      
      if (!userId) {
        throw new Error('UserId não encontrado no token');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

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
    return NextResponse.json(
      { error: 'Erro ao criar pagamento', details: error.message },
      { status: 500 }
    );
  }
}
