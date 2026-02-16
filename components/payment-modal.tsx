'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: 'free' | 'lojista';
  planName: string;
  planPrice: number;
}

export function PaymentModal({ open, onOpenChange, planId, planName, planPrice }: PaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');

  const handlePayment = async () => {
    setLoading(true);

    // SIMULAÇÃO DE PAGAMENTO (MVP)
    // Quando integrar Stripe/Mercado Pago, substituir por:
    // const response = await paymentService.createCheckout(planId, paymentMethod);
    // window.location.href = response.checkoutUrl;

    try {
      // Simula delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Chamar API real
      // await fetch('/api/subscriptions', {
      //   method: 'POST',
      //   body: JSON.stringify({ plan: planId, paymentMethod })
      // });

      alert(`✅ Pagamento simulado com sucesso!\n\nPlano: ${planName}\nValor: R$ ${planPrice}\n\nEm produção, aqui será redirecionado para o checkout do Stripe/Mercado Pago.`);
      
      onOpenChange(false);
      router.push('/dashboard');
    } catch (error) {
      alert('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Assinatura</DialogTitle>
          <DialogDescription>
            Plano: <strong>{planName}</strong> - R$ {planPrice}/mês
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('credit_card')}
                className="w-full"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Cartão
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('pix')}
                className="w-full"
              >
                PIX
              </Button>
            </div>
          </div>

          {paymentMethod === 'credit_card' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" disabled />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="expiry">Validade</Label>
                  <Input id="expiry" placeholder="MM/AA" disabled />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" disabled />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Modo simulado. Em produção, será redirecionado para checkout seguro.
              </p>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">
                💡 Modo simulado. Em produção, será gerado QR Code PIX.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handlePayment} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Processando...' : `Pagar R$ ${planPrice}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
