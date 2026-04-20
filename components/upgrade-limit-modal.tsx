'use client';

import { useRouter } from 'next/navigation';
import { PlanId } from '@/types';
import { getPlanConfig, PLANS_CONFIG } from '@/services/machine-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowUp } from 'lucide-react';

interface UpgradeLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: PlanId;
}

export function UpgradeLimitModal({ open, onOpenChange, currentPlan = 'free' }: UpgradeLimitModalProps) {
  const router = useRouter();
  const current = getPlanConfig(currentPlan);

  // Próximo plano disponível
  const planOrder: PlanId[] = ['free', 'basico', 'profissional', 'premium'];
  const currentIndex = planOrder.indexOf(currentPlan);
  const nextPlanId = currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null;
  const nextPlan = nextPlanId ? getPlanConfig(nextPlanId) : null;

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-6 w-6" />
            <DialogTitle>Limite de Anúncios Atingido</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Você atingiu o limite de <strong>{current.maxAds} anúncios</strong> do plano <strong>{current.name}</strong>.
            {nextPlan && (
              <>
                <br /><br />
                Faça upgrade para o plano <strong>{nextPlan.name}</strong> (R$ {nextPlan.price}/mês) e tenha:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{nextPlan.maxAds} anúncios ativos</li>
                  <li>{nextPlan.maxPhotos} fotos por anúncio</li>
                  {nextPlan.maxVideos > 0 && <li>{nextPlan.maxVideos} vídeo(s) por anúncio</li>}
                  {nextPlan.maxPremiumAds > 0 && <li>{nextPlan.maxPremiumAds} anúncios Premium</li>}
                  {nextPlan.maxFeaturedAds > 0 && <li>{nextPlan.maxFeaturedAds} anúncios Destaque</li>}
                  {nextPlan.hasAnalytics && <li>Analytics {nextPlan.analyticsLevel === 'basic' ? 'básico' : 'completo'}</li>}
                </ul>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpgrade}>
            <ArrowUp className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
