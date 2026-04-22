'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Machine } from '@/types/machine';
import { PlanId } from '@/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, MessageCircle, CheckCircle, Target, Lock } from 'lucide-react';
import Link from 'next/link';

interface DashboardAnalyticsProps {
  machines: Machine[];
  userPlan?: PlanId;
}

export function DashboardAnalytics({ machines, userPlan = 'free' }: DashboardAnalyticsProps) {
  const totalViews = machines.reduce((sum, m) => sum + (m.views || 0), 0);
  const totalClicks = machines.reduce((sum, m) => sum + (m.whatsappClicks || 0), 0);
  const totalLeads = machines.reduce((sum, m) => sum + (m.qualifiedLeads || 0), 0);
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';
  const leadRate = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) : '0';

  // Free: não mostra analytics
  if (userPlan === 'free') {
    return (
      <Card className="mb-8 border-dashed">
        <CardContent className="py-8 text-center">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Analytics disponível a partir do plano Básico</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Veja quantas pessoas visualizam seus anúncios, clicam no WhatsApp e se tornam leads.
          </p>
          <Link href="/pricing">
            <Button>Ver Planos</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const topMachines = [...machines]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(m => ({
      name: m.name.length > 20 ? m.name.substring(0, 20) + '...' : m.name,
      views: m.views || 0,
      clicks: m.whatsappClicks || 0,
      leads: m.qualifiedLeads || 0,
    }));

  const pieData = [
    { name: 'Visualizações', value: totalViews, color: '#3b82f6' },
    { name: 'Contatos', value: totalClicks, color: '#10b981' },
    { name: 'Leads', value: totalLeads, color: '#f59e0b' },
  ];

  // Básico: só cards de métricas (sem gráficos)
  // Profissional+: cards + gráficos + insights
  const showCharts = userPlan === 'profissional' || userPlan === 'premium';

  return (
    <div className="space-y-6 mb-8">
      {/* Cards de métricas - Básico+ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Todos os seus anúncios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques WhatsApp</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">Taxa: {clickRate}% das visualizações</p>
          </CardContent>
        </Card>

        {showCharts ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeads}</div>
                <p className="text-xs text-muted-foreground">Taxa: {leadRate}% dos cliques</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leadRate}%</div>
                <p className="text-xs text-muted-foreground">Cliques → Leads</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-dashed col-span-1 md:col-span-2">
              <CardContent className="py-6 text-center">
                <Lock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Leads, conversão e gráficos no plano Profissional
                </p>
                <Link href="/pricing">
                  <Button size="sm" variant="outline">Fazer Upgrade</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Gráficos - Profissional+ */}
      {showCharts && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top 5 Anúncios
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topMachines.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topMachines}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#3b82f6" name="Visualizações" />
                      <Bar dataKey="clicks" fill="#10b981" name="Cliques" />
                      <Bar dataKey="leads" fill="#f59e0b" name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {(totalViews + totalClicks + totalLeads) > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {pieData.filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <Eye className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">Ainda sem interações</p>
                    <p className="text-xs mt-1">Compartilhe seus anúncios para começar a receber dados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {totalViews === 0 && (
                <p className="text-sm text-muted-foreground">
                  • Seus anúncios ainda não receberam visualizações. Compartilhe nas redes sociais!
                </p>
              )}
              {totalViews > 0 && totalClicks === 0 && (
                <p className="text-sm text-muted-foreground">
                  • Você tem visualizações mas nenhum clique. Considere melhorar as fotos ou descrição.
                </p>
              )}
              {totalClicks > 0 && totalLeads === 0 && (
                <p className="text-sm text-muted-foreground">
                  • Você tem cliques mas nenhum lead qualificado. Lembre-se de marcar quando houver interesse real!
                </p>
              )}
              {parseFloat(clickRate) > 5 && (
                <p className="text-sm text-green-600">
                  • ✅ Ótima taxa de cliques ({clickRate}%)! Seus anúncios estão atraindo interesse.
                </p>
              )}
              {parseFloat(leadRate) > 10 && (
                <p className="text-sm text-green-600">
                  • ✅ Excelente taxa de conversão ({leadRate}%)! Seus leads são qualificados.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
