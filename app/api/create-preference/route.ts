import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoService } from '@/services/mercadopago';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { planName, planPrice, planDescription, planType } = await request.json();
    
    console.log('📥 Dados recebidos na API:', { planName, planPrice, planDescription, planType });

    // Pegar usuário do token JWT
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
      
      console.log('👤 UserId extraído do token:', userId);
    } catch (error) {
      console.error('❌ Erro ao decodificar token:', error);
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
    
    console.log('✅ Preferência criada:', { id: preference.id, init_point: preference.init_point });

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar preferência:', error);
    console.error('❌ Detalhes do erro:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Erro ao criar pagamento', details: error.message },
      { status: 500 }
    );
  }
}
