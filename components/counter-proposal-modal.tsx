'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCounterProposal } from '@/hooks/use-proposals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Proposal } from '@/types/proposal';
import { X, Loader2 } from 'lucide-react';

const counterSchema = z.object({
  counterPrice: z.number().min(1, 'Preço deve ser maior que zero'),
  counterMessage: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres').max(1000),
});

type CounterFormData = z.infer<typeof counterSchema>;

interface CounterProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
}

export function CounterProposalModal({ isOpen, onClose, proposal }: CounterProposalModalProps) {
  const counterProposal = useCounterProposal();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CounterFormData>({
    resolver: zodResolver(counterSchema),
    defaultValues: {
      counterPrice: proposal.proposedPrice,
    },
  });

  const onSubmit = async (data: CounterFormData) => {
    try {
      setError('');
      await counterProposal.mutateAsync({
        id: proposal.id,
        data: {
          counterPrice: data.counterPrice,
          counterMessage: data.counterMessage,
        },
      });
      reset();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar contra-proposta');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Contra-proposta</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 space-y-1">
          <p className="text-sm text-muted-foreground">Máquina: {proposal.machine.name}</p>
          <p className="text-sm text-muted-foreground">
            Proposta recebida: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(proposal.proposedPrice)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="counterPrice">Sua Contra-proposta (R$)</Label>
            <Input
              id="counterPrice"
              type="number"
              step="0.01"
              {...register('counterPrice', { valueAsNumber: true })}
            />
            {errors.counterPrice && (
              <p className="text-sm text-red-500 mt-1">{errors.counterPrice.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="counterMessage">Mensagem</Label>
            <Textarea
              id="counterMessage"
              rows={4}
              placeholder="Explique sua contra-proposta..."
              {...register('counterMessage')}
            />
            {errors.counterMessage && (
              <p className="text-sm text-red-500 mt-1">{errors.counterMessage.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={counterProposal.isPending} className="flex-1">
              {counterProposal.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
