'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { planService } from '@/services/machine-api';
import { CheckoutButton } from '@/components/checkout-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getAll,
  });

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

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans?.map((plan) => (
          <Card key={plan.id} className={plan.id === 'lojista' ? 'border-primary shadow-lg' : ''}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
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
              {plan.id === 'free' ? (
                <Button className="w-full" variant="outline" disabled>
                  Plano Atual
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
        ))}
      </div>
    </div>
  );
}
