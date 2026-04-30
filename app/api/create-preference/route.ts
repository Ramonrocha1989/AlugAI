import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoService } from '@/services/mercadopago';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { planName, planType, payerEmail } = await request.json();

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
    let decoded: JwtPayload;

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET não configurado');
      decoded = jwt.verify(token, secret) as JwtPayload;
      userId = decoded.userId || decoded.sub || '';
      if (!userId) throw new Error('UserId não encontrado no token');
    } catch {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const email = payerEmail || decoded.email || '';

    const subscription = await mercadoPagoService.createSubscription(
      planName,
      planType,
      userId,
      email
    );

    return NextResponse.json({
      id: subscription.id,
      init_point: subscription.init_point,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao criar assinatura', details: error.message },
      { status: 500 }
    );
  }
}
