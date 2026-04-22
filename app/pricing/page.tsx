'use client';

import { useQuery } from '@tanstack/react-query';
import { planService } from '@/services/machine-api';
import { useUser } from '@/hooks/use-user';
import { CheckoutButton } from '@/components/checkout-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Crown, Star, Zap, Shield } from 'lucide-react';
import { PlanId } from '@/types';

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free: null,
  basico: <Zap className="h-5 w-5 text-blue-500" />,
  profissional: <Star className="h-5 w-5 text-indigo-500" />,
  premium: <Crown className="h-5 w-5 text-amber-500" />,
};

const PLAN_COLORS: Record<PlanId, string> = {
  free: '',
  basico: 'border-blue-200',
  profissional: 'border-indigo-400 shadow-xl ring-2 ring-indigo-400',
  premium: 'border-amber-300 shadow-lg',
};

const PLAN_HEADER_COLORS: Record<PlanId, string> = {
  free: 'bg-gray-50',
  basico: 'bg-blue-50',
  profissional: 'bg-indigo-50',
  premium: 'bg-gradient-to-r from-amber-50 to-orange-50',
};

const PLAN_BADGE_VARIANT: Record<PlanId, any> = {
  free: 'secondary',
  basico: 'basico',
  profissional: 'profissional',
  premium: 'planPremium',
};

interface ComparisonRow {
  label: string;
  key: string;
  suffix?: string;
  type?: 'boolean' | 'analytics' | 'duration';
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: 'Anúncios ativos', key: 'maxAds' },
  { label: 'Fotos por anúncio', key: 'maxPhotos' },
  { label: 'Vídeos por anúncio', key: 'maxVideos' },
  { label: 'Duração do anúncio', key: 'adDuration', type: 'duration' },
  { label: 'Anúncios Premium', key: 'maxPremiumAds' },
  { label: 'Anúncios Destaque', key: 'maxFeaturedAds' },
  { label: 'Analytics', key: 'hasAnalytics', type: 'analytics' },
  { label: 'Prioridade nos resultados', key: 'hasPriority', type: 'boolean' },
  { label: 'Página da loja', key: 'hasStorePage', type: 'boolean' },
  { label: 'Badge verificado', key: 'hasVerifiedBadge', type: 'boolean' },
];

export default function PricingPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getAll,
  });

  const { data: currentUser } = useUser();
  const userPlan = (currentUser?.plan || 'free') as PlanId;

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
          Máquinas de alto valor merecem visibilidade de alto nível
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cancele quando quiser • Sem multa • Sem fidelidade
        </p>
      </div>

      {/* Cards dos planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
        {plans?.map((plan) => {
          const isCurrentPlan = plan.id === userPlan;
          const isProfissional = plan.id === 'profissional';
          const isPremium = plan.id === 'premium';
          const isFree = plan.id === 'free';

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${PLAN_COLORS[plan.id]}`}
            >
              {/* Badge "Mais Popular" */}
              {isProfissional && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge variant="profissional" className="px-4 py-1">
                    ⭐ Mais Popular
                  </Badge>
                </div>
              )}

              {/* Badge plano ativo */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4 z-10">
                  <Badge variant={PLAN_BADGE_VARIANT[plan.id]} className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Ativo
                  </Badge>
                </div>
              )}

              <CardHeader className={`rounded-t-lg ${PLAN_HEADER_COLORS[plan.id]}`}>
                <CardTitle className="text-xl flex items-center gap-2">
                  {PLAN_ICONS[plan.id]}
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-foreground">Grátis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">
                        R$ {plan.price}
                      </span>
                      <span className="text-muted-foreground">/mês</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    {isFree ? 'Plano Atual' : '✅ Plano Ativo'}
                  </Button>
                ) : isFree ? (
                  <Button className="w-full" variant="outline" disabled>
                    Plano Gratuito
                  </Button>
                ) : (
                  <CheckoutButton
                    planName={plan.name}
                    planPrice={plan.price}
                    planDescription={plan.features.join(', ')}
                    planType={plan.id}
                  />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Tabela comparativa */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Comparativo Completo</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Recurso</th>
                {plans?.map((plan) => (
                  <th key={plan.id} className="text-center py-3 px-4 font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.key} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm">{row.label}</td>
                  {plans?.map((plan) => {
                    const value = (plan as any)[row.key];
                    return (
                      <td key={plan.id} className="text-center py-3 px-4 text-sm">
                        {row.type === 'boolean' ? (
                          value ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300 mx-auto" />
                          )
                        ) : row.type === 'analytics' ? (
                          plan.analyticsLevel === 'none' ? (
                            <X className="h-4 w-4 text-gray-300 mx-auto" />
                          ) : (
                            <span className="capitalize">{plan.analyticsLevel === 'basic' ? 'Básico' : plan.analyticsLevel === 'full' ? 'Completo' : 'Premium'}</span>
                          )
                        ) : row.type === 'duration' ? (
                          <span>{value === -1 ? 'Enquanto pago' : `${value} dias`}</span>
                        ) : (
                          <span>{value === 0 ? <X className="h-4 w-4 text-gray-300 mx-auto" /> : `${value}${row.suffix || ''}`}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 text-sm">Suporte</td>
                <td className="text-center py-3 px-4 text-sm">Email (48h)</td>
                <td className="text-center py-3 px-4 text-sm">Email (24h)</td>
                <td className="text-center py-3 px-4 text-sm">WhatsApp (12h)</td>
                <td className="text-center py-3 px-4 text-sm">WhatsApp dedicado (4h)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-semibold">Preço</td>
                <td className="text-center py-3 px-4 font-bold">Grátis</td>
                <td className="text-center py-3 px-4 font-bold">R$ 89/mês</td>
                <td className="text-center py-3 px-4 font-bold text-indigo-600">R$ 179/mês</td>
                <td className="text-center py-3 px-4 font-bold text-amber-600">R$ 349/mês</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ rápido */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1">Posso trocar de plano a qualquer momento?</h3>
            <p className="text-sm text-muted-foreground">Sim! O upgrade é imediato e o valor é proporcional ao período restante.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1">O que acontece quando meu anúncio expira?</h3>
            <p className="text-sm text-muted-foreground">Ele fica inativo e sai dos resultados. Basta renovar ou fazer upgrade para reativá-lo.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1">O que são anúncios Premium e Destaque?</h3>
            <p className="text-sm text-muted-foreground">Premium aparece com selo especial e prioridade. Destaque fica fixo no topo dos resultados da categoria.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1">Tem multa pra cancelar?</h3>
            <p className="text-sm text-muted-foreground">Não! Cancele quando quiser. Seus anúncios ficam ativos até o fim do período pago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
