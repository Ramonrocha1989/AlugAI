'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { planService } from '@/services/machine-api';
import { useUser } from '@/hooks/use-user';
import { CheckoutButton } from '@/components/checkout-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';

export default function PricingPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getAll,
  });

  // Verificar plano atual do usuário usando hook
  const { data: currentUser } = useUser();
  const userPlan = currentUser?.plan || 'free';

  const [selectedPlan, setSelectedPlan] = useState<{ id: 'free' | 'lojista'; name: string; price: number } | null>(null);

  const handleSelectPlan = (plan: { id: 'free' | 'lojista'; name: string; price: number }) => {
    if (plan.id === 'free') return;
    setSelectedPlan(plan);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Carregando planos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
        <p className="text-xl text-muted-foreground">
          Comece grátis ou turbine suas vendas com o plano Lojista
        </p>
      </div>

      {/* Mensagem para usuário com plano Lojista ativo */}
      {userPlan === 'lojista' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant="lojista" className="text-base px-4 py-2">
                👑 Plano Lojista Ativo
              </Badge>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Seu plano está ativo!</h2>
              <p className="text-muted-foreground">
                Você já tem acesso a todos os recursos premium do plano Lojista.
                Aproveite anúncios ilimitados, recursos Premium e Destaque!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans?.map((plan) => {
          const isCurrentPlan = plan.id === userPlan;
          const isLojista = plan.id === 'lojista';
          
          return (
            <Card key={plan.id} className={isLojista ? 'border-primary shadow-lg relative' : ''}>
              {isCurrentPlan && isLojista && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="lojista" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Plano Ativo
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {plan.name}
                  {isCurrentPlan && isLojista && <Crown className="h-5 w-5 text-purple-600" />}
                </CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">
                    R$ {plan.price}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    {isLojista ? '👑 Plano Ativo' : 'Plano Atual'}
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button className="w-full" variant="outline" disabled>
                    Plano Gratuito
                  </Button>
                ) : (
                  <CheckoutButton
                    planName={plan.name}
                    planPrice={plan.price}
                    planDescription={plan.features.join(', ')}
                    planType="lojista"
                  />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
