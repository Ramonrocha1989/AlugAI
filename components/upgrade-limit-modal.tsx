'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface UpgradeLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeLimitModal({ open, onOpenChange }: UpgradeLimitModalProps) {
  const router = useRouter();

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
            Você atingiu o limite de 3 anúncios do plano Gratuito.
            <br />
            <br />
            Faça upgrade para o plano <strong>Lojista</strong> e tenha:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Anúncios ilimitados</li>
              <li>Selo Vendedor Verificado</li>
              <li>Prioridade nas buscas</li>
              <li>15 fotos por anúncio</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpgrade}>
            Ver Planos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
