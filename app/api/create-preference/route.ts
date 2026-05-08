import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoService } from '@/services/mercadopago';

function getBackendApiBase(): string {
  const explicitApi = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicitApi) return explicitApi.replace(/\/$/, '');

  const backendUrl = process.env.BACKEND_URL?.trim();
  if (backendUrl) return `${backendUrl.replace(/\/$/, '')}/api`;

  return 'http://localhost:8000/api';
}

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
    const backendApiBase = getBackendApiBase();
    const meResponse = await fetch(`${backendApiBase}/auth/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const me = await meResponse.json();
    const userId = me?.id || me?.userId || me?.sub || '';
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário inválido no token' },
        { status: 401 }
      );
    }

    const email = payerEmail || me?.email || '';

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
