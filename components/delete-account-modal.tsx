'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/machine-api';
import { deleteAccountSchema, DeleteAccountFormData } from '@/lib/validations';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const requestDelete = useMutation({
    mutationFn: (data: DeleteAccountFormData) => authService.requestDeleteAccount(data.password),
    onSuccess: () => {
      setStep('success');
      reset();
    },
    onError: () => {
      // Erro tratado pelo apiRequest com toast
    },
  });

  const handleClose = () => {
    setStep('confirm');
    reset();
    onClose();
  };

  const onSubmit = (data: DeleteAccountFormData) => {
    requestDelete.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Excluir Conta
              </DialogTitle>
              <DialogDescription>
                Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos após 30 dias.
              </DialogDescription>
            </DialogHeader>

            <Alert className="bg-destructive/10 border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div className="ml-2">
                <p className="text-sm font-medium text-destructive">O que será excluído:</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Seus equipamentos cadastrados</li>
                  <li>• Suas propostas e negociações</li>
                  <li>• Seu histórico de avaliações</li>
                  <li>• Todos os dados da sua conta</li>
                </ul>
              </div>
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="password">Digite sua senha para confirmar</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha atual"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="destructive" disabled={requestDelete.isPending}>
                  {requestDelete.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Solicitar Exclusão
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Email Enviado</DialogTitle>
              <DialogDescription>
                Enviamos um email de confirmação para você. Clique no link para confirmar a exclusão da sua conta.
              </DialogDescription>
            </DialogHeader>

            <Alert>
              <div className="space-y-2">
                <p className="text-sm font-medium">Próximos passos:</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Verifique sua caixa de entrada</li>
                  <li>2. Clique no link de confirmação</li>
                  <li>3. Sua conta será marcada para exclusão</li>
                  <li>4. Após 30 dias, todos os dados serão excluídos permanentemente</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Importante:</strong> Você tem 30 dias para recuperar sua conta entrando em contato com o suporte.
                </p>
              </div>
            </Alert>

            <DialogFooter>
              <Button onClick={handleClose}>Entendi</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
