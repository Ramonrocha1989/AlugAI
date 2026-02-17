'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Machine } from '@/types/machine';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, MessageCircle, CheckCircle, Target } from 'lucide-react';

interface DashboardAnalyticsProps {
  machines: Machine[];
}

export function DashboardAnalytics({ machines }: DashboardAnalyticsProps) {
  // Calcular totais
  const totalViews = machines.reduce((sum, m) => sum + (m.views || 0), 0);
  const totalClicks = machines.reduce((sum, m) => sum + (m.whatsappClicks || 0), 0);
  const totalLeads = machines.reduce((sum, m) => sum + (m.qualifiedLeads || 0), 0);
  
  // Taxa de conversão
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';
  const leadRate = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) : '0';

  // Dados para gráfico de barras (top 5 anúncios)
  const topMachines = [...machines]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(m => ({
      name: m.name.length > 20 ? m.name.substring(0, 20) + '...' : m.name,
      views: m.views || 0,
      clicks: m.whatsappClicks || 0,
      leads: m.qualifiedLeads || 0,
    }));

  // Dados para gráfico de pizza (distribuição de performance)
  const pieData = [
    { name: 'Visualizações', value: totalViews, color: '#3b82f6' },
    { name: 'Contatos', value: totalClicks, color: '#10b981' },
    { name: 'Leads', value: totalLeads, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Todos os seus anúncios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques WhatsApp</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Taxa: {clickRate}% das visualizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Taxa: {leadRate}% dos cliques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadRate}%</div>
            <p className="text-xs text-muted-foreground">
              Cliques → Leads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Anúncios */}
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

        {/* Distribuição de Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {totalViews > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ value }) => value}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
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
    </div>
  );
}
