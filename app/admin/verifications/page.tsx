'use client';

import { useState } from 'react';
import { useAdminVerifications, useApproveVerification, useRejectVerification } from '@/hooks/use-admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/toast-provider';
import { getApiErrorMessage } from '@/lib/error-handler';
import { Loader2, CheckCircle, XCircle, Shield, FileText, Phone, Mail, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export default function AdminVerificationsPage() {
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('PENDING');
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useAdminVerifications({ page, limit: 20, status });
  const approve = useApproveVerification();
  const reject = useRejectVerification();

  const requests = data?.data || (Array.isArray(data) ? data : []);
  const total = data?.total || requests.length;
  const totalPages = data?.totalPages || 1;

  const handleApprove = () => {
    if (!confirmAction) return;
    approve.mutate(confirmAction.id, {
      onSuccess: () => {
        setConfirmAction(null);
        showToast('Vendedor verificado com sucesso!', 'success');
      },
      onError: (error) => showToast(getApiErrorMessage(error, 'Erro ao aprovar'), 'error'),
    });
  };

  const handleReject = () => {
    if (!confirmAction) return;
    reject.mutate({ id: confirmAction.id, reason: rejectReason || undefined }, {
      onSuccess: () => {
        setConfirmAction(null);
        setRejectReason('');
        showToast('Solicitação rejeitada', 'success');
      },
      onError: (error) => showToast(getApiErrorMessage(error, 'Erro ao rejeitar'), 'error'),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitações de Verificação</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Shield className="h-4 w-4 inline mr-1" />
            {total} solicitação{total !== 1 ? 'ões' : ''} encontrada{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <Button
            key={s}
            variant={status === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setStatus(s); setPage(1); }}
          >
            {STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma solicitação {STATUS_LABELS[status]?.toLowerCase()}.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {requests.map((req: any) => (
              <Card key={req.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{req.companyName}</h3>
                        <Badge className={STATUS_COLORS[req.status]}>{STATUS_LABELS[req.status]}</Badge>
                        <Badge variant="secondary">{req.documentType}</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {req.userName || req.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" /> {req.documentType}: {req.documentNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {req.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {req.email || req.userEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(req.createdAt)}
                        </span>
                      </div>

                      {req.reason && (
                        <div className="bg-muted p-3 rounded text-sm mb-3">
                          <span className="font-medium">Motivo:</span> {req.reason}
                        </div>
                      )}
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => setConfirmAction({ type: 'approve', id: req.id, name: req.companyName })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmAction({ type: 'reject', id: req.id, name: req.companyName })}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                Anterior
              </Button>
              <span className="flex items-center px-4">Página {page} de {totalPages}</span>
              <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {/* Dialog Aprovar */}
      {confirmAction?.type === 'approve' && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
          title="Aprovar verificação"
          description={`Aprovar "${confirmAction.name}" como vendedor verificado? O selo será ativado e todas as máquinas dele serão atualizadas.`}
          confirmLabel="Aprovar"
          loading={approve.isPending}
          onConfirm={handleApprove}
        />
      )}

      {/* Dialog Rejeitar */}
      {confirmAction?.type === 'reject' && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => { if (!open) { setConfirmAction(null); setRejectReason(''); } }}
          title="Rejeitar verificação"
          description={`Rejeitar a solicitação de "${confirmAction.name}"?`}
          confirmLabel="Rejeitar"
          variant="destructive"
          loading={reject.isPending}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
