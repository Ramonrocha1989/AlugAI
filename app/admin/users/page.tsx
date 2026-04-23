'use client';

import { useState, useEffect } from 'react';
import { useAdminUsers, useBanUser, useVerifyUser, useUpdateUserPlan } from '@/hooks/use-admin';
import { PlanId } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Ban, CheckCircle, Shield, Save, Users, Calendar, LogIn, Building2, User } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import Link from 'next/link';

const PLAN_OPTIONS: { value: PlanId; label: string; badge: any }[] = [
  { value: 'free', label: 'Gratuito', badge: 'secondary' },
  { value: 'basico', label: 'Básico', badge: 'basico' },
  { value: 'profissional', label: 'Profissional', badge: 'profissional' },
  { value: 'premium', label: 'Premium', badge: 'planPremium' },
];

const DURATION_OPTIONS = [
  { value: '30', label: '30 dias' },
  { value: '60', label: '60 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '6 meses' },
  { value: '365', label: '1 ano' },
  { value: 'null', label: 'Sem expiração' },
];

function calcExpiresAt(days: string): string | null {
  if (days === 'null') return null;
  const date = new Date();
  date.setDate(date.getDate() + Number(days));
  return date.toISOString();
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
}

function timeAgo(date: string | null | undefined): string {
  if (!date) return 'Nunca';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d atrás`;
  return formatDate(date);
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserType, setFilterUserType] = useState('');
  const [planEdits, setPlanEdits] = useState<Record<string, { plan: PlanId; duration: string }>>({});
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'ban' | 'verify'; userId: string; label: string } | null>(null);

  const { data, isLoading } = useAdminUsers({
    page, limit: 20, search: debouncedSearch,
    plan: filterPlan || undefined,
    status: filterStatus || undefined,
    userType: filterUserType || undefined,
  });
  const banUser = useBanUser();
  const verifyUser = useVerifyUser();
  const updatePlan = useUpdateUserPlan();

  const users = Array.isArray(data) ? data : data?.data || [];
  const total = data?.total || users.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const resetFilters = () => {
    setSearch('');
    setFilterPlan('');
    setFilterStatus('');
    setFilterUserType('');
    setPage(1);
  };

  const hasFilters = search || filterPlan || filterStatus || filterUserType;

  const getPlanBadge = (plan: string) => {
    const option = PLAN_OPTIONS.find(p => p.value === plan);
    return option ? <Badge variant={option.badge}>{option.label}</Badge> : <Badge variant="secondary">Gratuito</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Users className="h-4 w-4 inline mr-1" />
            {total} usuário{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="text-sm border rounded px-3 py-2"
                value={filterPlan}
                onChange={(e) => { setFilterPlan(e.target.value); setPage(1); }}
              >
                <option value="">Todos os planos</option>
                {PLAN_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <select
                className="text-sm border rounded px-3 py-2"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="">Todos os status</option>
                <option value="ACTIVE">Ativos</option>
                <option value="BANNED">Banidos</option>
              </select>
              <select
                className="text-sm border rounded px-3 py-2"
                value={filterUserType}
                onChange={(e) => { setFilterUserType(e.target.value); setPage(1); }}
              >
                <option value="">Todos os tipos</option>
                <option value="INDIVIDUAL">Pessoa Física</option>
                <option value="COMPANY">Empresa</option>
              </select>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum usuário encontrado.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {users.map((user: any) => (
              <Card key={user.id} className={user.isBanned ? 'border-red-200 bg-red-50/30' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Nome + Badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{user.name || user.email}</h3>
                        {getPlanBadge(user.plan)}
                        {user.isVerifiedSeller && (
                          <Badge className="bg-green-500">
                            <Shield className="h-3 w-3 mr-1" /> Verificado
                          </Badge>
                        )}
                        {user.isBanned && <Badge variant="destructive">Banido</Badge>}
                        {user.role === 'ADMIN' && <Badge>Admin</Badge>}
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-3 text-sm text-muted-foreground">
                        <span>{user.email}</span>
                        <span>Tel: {user.phone || '—'}</span>
                        <span className="flex items-center gap-1">
                          {user.userType === 'COMPANY' ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {user.userType === 'COMPANY' ? user.company?.name || 'Empresa' : 'Pessoa Física'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Cadastro: {formatDate(user.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <LogIn className="h-3 w-3" /> Último acesso: {timeAgo(user.lastLoginAt)}
                        </span>
                        {user.planExpiresAt && (
                          <span className={`flex items-center gap-1 ${new Date(user.planExpiresAt) < new Date() ? 'text-red-500 font-medium' : ''}`}>
                            ⏳ Plano expira: {formatDate(user.planExpiresAt)}
                            {new Date(user.planExpiresAt) < new Date() && ' (expirado)'}
                          </span>
                        )}
                      </div>

                      {/* Contadores */}
                      <div className="flex gap-4 text-sm mb-3">
                        <span className="bg-muted px-2 py-0.5 rounded">{user._count?.machines || 0} máquinas</span>
                        <span className="bg-muted px-2 py-0.5 rounded">{user._count?.proposalsSent || 0} propostas</span>
                        <span className="bg-muted px-2 py-0.5 rounded">{user._count?.reviewsGiven || 0} avaliações</span>
                      </div>

                      {/* Edição de plano */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Plano:</span>
                        <select
                          className="text-sm border rounded px-2 py-1"
                          value={planEdits[user.id]?.plan ?? user.plan ?? 'free'}
                          onChange={(e) => setPlanEdits(prev => ({
                            ...prev,
                            [user.id]: { plan: e.target.value as PlanId, duration: prev[user.id]?.duration ?? '30' },
                          }))}
                          disabled={updatePlan.isPending}
                        >
                          {PLAN_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                        <select
                          className="text-sm border rounded px-2 py-1"
                          value={planEdits[user.id]?.duration ?? 'null'}
                          onChange={(e) => setPlanEdits(prev => ({
                            ...prev,
                            [user.id]: { plan: prev[user.id]?.plan ?? user.plan ?? 'free', duration: e.target.value },
                          }))}
                          disabled={updatePlan.isPending}
                        >
                          {DURATION_OPTIONS.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                        {planEdits[user.id] && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              disabled={updatePlan.isPending}
                              onClick={() => setConfirmUserId(user.id)}
                            >
                              {updatePlan.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3 mr-1" /> Aplicar</>}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatePlan.isPending}
                              onClick={() => setPlanEdits(prev => { const n = { ...prev }; delete n[user.id]; return n; })}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {confirmUserId === user.id && planEdits[user.id] && (
                          <ConfirmDialog
                            open={true}
                            onOpenChange={(open) => { if (!open) setConfirmUserId(null); }}
                            title="Alterar plano"
                            description={`Alterar ${user.name || user.email} para ${PLAN_OPTIONS.find(p => p.value === planEdits[user.id].plan)?.label} (${DURATION_OPTIONS.find(d => d.value === planEdits[user.id].duration)?.label})?`}
                            confirmLabel="Aplicar"
                            loading={updatePlan.isPending}
                            onConfirm={() => {
                              const edit = planEdits[user.id];
                              updatePlan.mutate(
                                { id: user.id, plan: edit.plan, expiresAt: calcExpiresAt(edit.duration) },
                                {
                                  onSuccess: () => {
                                    setConfirmUserId(null);
                                    setPlanEdits(prev => { const n = { ...prev }; delete n[user.id]; return n; });
                                  },
                                }
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    {user.role !== 'ADMIN' && (
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant={user.isVerifiedSeller ? 'outline' : 'default'}
                          onClick={() => setConfirmAction({
                            type: 'verify',
                            userId: user.id,
                            label: `${!user.isVerifiedSeller ? 'Verificar' : 'Remover verificação de'} ${user.name || user.email}?`,
                          })}
                          disabled={verifyUser.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {user.isVerifiedSeller ? 'Remover Verificação' : 'Verificar'}
                        </Button>
                        <Button
                          size="sm"
                          variant={user.isBanned ? 'outline' : 'destructive'}
                          onClick={() => setConfirmAction({
                            type: 'ban',
                            userId: user.id,
                            label: `${!user.isBanned ? 'Banir' : 'Desbanir'} ${user.name || user.email}?`,
                          })}
                          disabled={banUser.isPending}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {user.isBanned ? 'Desbanir' : 'Banir'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(data?.totalPages || 0) > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {data?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (data?.totalPages || 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {confirmAction && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
          title={confirmAction.type === 'ban' ? 'Banir usuário' : 'Verificar vendedor'}
          description={confirmAction.label}
          confirmLabel="Confirmar"
          variant={confirmAction.type === 'ban' ? 'destructive' : 'default'}
          loading={banUser.isPending || verifyUser.isPending}
          onConfirm={() => {
            const user = users.find((u: any) => u.id === confirmAction.userId);
            if (confirmAction.type === 'ban') {
              banUser.mutate({ id: confirmAction.userId, isBanned: !user?.isBanned }, { onSuccess: () => setConfirmAction(null) });
            } else {
              verifyUser.mutate({ id: confirmAction.userId, isVerifiedSeller: !user?.isVerifiedSeller }, { onSuccess: () => setConfirmAction(null) });
            }
          }}
        />
      )}
    </div>
  );
}
