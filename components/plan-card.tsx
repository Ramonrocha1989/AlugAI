'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/components/toast-provider';
import { useCancelSubscription } from '@/hooks/use-subscription';
import { getPlanConfig } from '@/services/machine-api';
import { User, PlanId } from '@/types';
import Link from 'next/link';

const PLAN_COLORS: Record<string, string> = {
  basico: 'from-blue-50 to-sky-50 border-blue-200',
  profissional: 'from-indigo-50 to-blue-50 border-indigo-200',
  premium: 'from-amber-50 to-orange-50 border-amber-200',
};

const PLAN_BADGE: Record<string, any> = {
  basico: 'basico',
  profissional: 'profissional',
  premium: 'planPremium',
};

const PLAN_ICON: Record<string, string> = {
  basico: '⚡',
  profissional: '⭐',
  premium: '👑',
};

interface PlanCardProps {
  user: User;
}

export function PlanCard({ user }: PlanCardProps) {
  const { showToast } = useToast();
  const cancelSubscription = useCancelSubscription();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const planConfig = getPlanConfig(user.plan as PlanId);

  if (user.plan === 'free') {
    return (
      <Card className="mb-6 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📦 Plano Gratuito
            <Badge variant="secondary">Gratuito</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{user.usage?.activeAds || 0}/{user.maxAds}</div>
              <div className="text-sm text-muted-foreground">Anúncios Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{planConfig.maxPhotos}</div>
              <div className="text-sm text-muted-foreground">Fotos por Anúncio</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {planConfig.features.map((f, i) => (
              <span key={i}>✅ {f}{i < planConfig.features.length - 1 ? ' • ' : ''}</span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href="/planos">
              <Button size="sm" className="gap-1">
                Fazer upgrade <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCancel = async () => {
    try {
      await cancelSubscription.mutateAsync();
      showToast('Assinatura cancelada. Seu plano fica ativo até o fim do período.', 'success');
      setShowCancelDialog(false);
    } catch {
      showToast('Erro ao cancelar assinatura', 'error');
    }
  };

  return (
    <>
      <Card className={`mb-6 bg-gradient-to-r ${PLAN_COLORS[user.plan] || 'from-gray-50 to-gray-50 border-gray-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {PLAN_ICON[user.plan]} Plano {planConfig.name} Ativo
            <Badge variant={PLAN_BADGE[user.plan] || 'secondary'}>{planConfig.name}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{user.usage?.activeAds || 0}/{user.maxAds}</div>
              <div className="text-sm text-muted-foreground">Anúncios Ativos</div>
            </div>
            {planConfig.maxPremiumAds > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{user.usage?.premiumAds || 0}/{user.maxPremiumAds}</div>
                <div className="text-sm text-muted-foreground">Premium Ativos</div>
              </div>
            )}
            {planConfig.maxFeaturedAds > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.usage?.featuredAds || 0}/{user.maxFeaturedAds}</div>
                <div className="text-sm text-muted-foreground">Destaques Ativos</div>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {planConfig.features.slice(0, 4).map((f, i) => (
              <span key={i}>✅ {f}{i < 3 ? ' • ' : ''}</span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {user.planExpiresAt
                ? `Renova em ${new Date(user.planExpiresAt).toLocaleDateString('pt-BR')}`
                : 'Assinatura ativa'}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancelar assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancelar assinatura"
        description="Tem certeza que deseja cancelar sua assinatura? Seus anúncios ficarão ativos até o fim do período pago."
        confirmLabel="Sim, cancelar"
        variant="destructive"
        loading={cancelSubscription.isPending}
        onConfirm={handleCancel}
      />
    </>
  );
}
