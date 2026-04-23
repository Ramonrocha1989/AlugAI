'use client';

import { useAdminStats, useAdminMachines } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, FileText, Star, Loader2, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminCharts } from '@/components/admin-charts';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats();
  const { data: pendingData } = useAdminMachines({ status: 'PENDING', limit: 1, page: 1 });
  const pendingCount = pendingData?.total ?? stats?.pendingMachines ?? 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          Erro ao carregar estatísticas. O painel continua funcionando.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/users"><Button className="w-full" size="lg">Gerenciar Usuários</Button></Link>
          <Link href="/admin/machines"><Button className="w-full" size="lg">Gerenciar Máquinas</Button></Link>
          <Link href="/admin/reviews"><Button className="w-full" size="lg">Moderar Avaliações</Button></Link>
          <Link href="/admin/settings"><Button className="w-full" size="lg">Configurações</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

      {pendingCount > 0 && (
        <Link href="/admin/machines">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between hover:bg-yellow-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                {pendingCount} anúncio{pendingCount !== 1 ? 's' : ''} aguardando aprovação
              </span>
            </div>
            <Badge className="bg-yellow-500 text-white">{pendingCount}</Badge>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersThisMonth || 0} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Máquinas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMachines || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newMachinesThisMonth || 0} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Propostas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProposals || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
          </CardContent>
        </Card>
      </div>

      <AdminCharts charts={stats?.charts} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/users">
          <Button className="w-full" size="lg">Gerenciar Usuários</Button>
        </Link>
        <Link href="/admin/machines">
          <Button className="w-full relative" size="lg">
            Gerenciar Máquinas
            {pendingCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white h-6 w-6 flex items-center justify-center p-0 text-xs rounded-full">
                {pendingCount}
              </Badge>
            )}
          </Button>
        </Link>
        <Link href="/admin/reviews">
          <Button className="w-full" size="lg">Moderar Avaliações</Button>
        </Link>
        <Link href="/admin/settings">
          <Button className="w-full" size="lg">Configurações</Button>
        </Link>
      </div>

      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{activity.userName}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
