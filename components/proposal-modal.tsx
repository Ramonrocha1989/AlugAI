'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProposal } from '@/hooks/use-proposals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const proposalSchema = z.object({
  proposedPrice: z.number().min(1, 'Preço deve ser maior que zero'),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres').max(1000),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineId: string;
  machineName: string;
  machinePrice: number;
}

export function ProposalModal({
  isOpen,
  onClose,
  machineId,
  machineName,
  machinePrice,
}: ProposalModalProps) {
  const router = useRouter();
  const createProposal = useCreateProposal();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      proposedPrice: machinePrice,
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    try {
      setError('');
      await createProposal.mutateAsync({
        machineId,
        proposedPrice: data.proposedPrice,
        message: data.message,
      });
      reset();
      onClose();
      router.push('/proposals?tab=sent');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar proposta');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Fazer Proposta</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Para: {machineName}</p>
          <p className="text-sm text-muted-foreground">
            Preço anunciado: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(machinePrice)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="proposedPrice">Valor da Proposta (R$)</Label>
            <Input
              id="proposedPrice"
              type="number"
              step="0.01"
              {...register('proposedPrice', { valueAsNumber: true })}
            />
            {errors.proposedPrice && (
              <p className="text-sm text-red-500 mt-1">{errors.proposedPrice.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Descreva sua proposta..."
              {...register('message')}
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={createProposal.isPending} className="flex-1">
              {createProposal.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Proposta'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
