'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Machine, MachineCategory } from '@/types/machine';
import { PlanId } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalyticsSummary, useCategoryBenchmarks } from '@/hooks/use-analytics';
import { ConversionFunnel } from '@/components/conversion-funnel';
import { CategoryBenchmarkCard } from '@/components/category-benchmark-card';
import { TrendingUp, Eye, MessageCircle, Target, Lock, Clock, FileText, Heart } from 'lucide-react';
import Link from 'next/link';

interface DashboardAnalyticsProps {
  machines: Machine[];
  userPlan?: PlanId;
}

export function DashboardAnalytics({ machines, userPlan = 'free' }: DashboardAnalyticsProps) {
  const totalViews = machines.reduce((sum, m) => sum + (m.views || 0), 0);
  const totalContacts = machines.reduce((sum, m) => sum + (m.whatsappClicks || 0), 0);
  const contactRate = totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(1) : '0';

  const showCharts = userPlan === 'profissional' || userPlan === 'premium';
  const showPremiumData = userPlan === 'premium';

  // Dados do summary (Profissional+)
  const { data: summary } = useAnalyticsSummary();

  // Categoria mais comum pra buscar benchmarks (Premium)
  const categoryCounts = machines.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MachineCategory | undefined;
  const { data: benchmarks } = useCategoryBenchmarks(showPremiumData ? topCategory : undefined);

  // Totais de favoritos e propostas (Premium)
  const totalFavorites = machines.reduce((sum, m) => sum + (m.favoritesCount || 0), 0);
  const totalProposalsPending = machines.reduce((sum, m) => sum + (m.proposalsCount?.pending || 0), 0);

  // Free: não mostra analytics
  if (userPlan === 'free') {
    return (
      <Card className="mb-8 border-dashed">
        <CardContent className="py-8 text-center">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Analytics disponível a partir do plano Básico</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Veja quantas pessoas visualizam seus anúncios e entram em contato pelo WhatsApp.
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
      contatos: m.whatsappClicks || 0,
    }));

  return (
    <div className="space-y-6 mb-8">
      {/* Cards de métricas — Básico+ */}
      <div className={`grid grid-cols-1 gap-4 ${showPremiumData ? 'md:grid-cols-3 lg:grid-cols-6' : showCharts ? 'md:grid-cols-4' : 'md:grid-cols-2'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Todos os anúncios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatos</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">Via WhatsApp</p>
          </CardContent>
        </Card>

        {showCharts ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactRate}%</div>
              <p className="text-xs text-muted-foreground">Visualização → Contato</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed col-span-1 md:col-span-2">
            <CardContent className="py-6 text-center">
              <Lock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Conversão, funil e gráficos no plano Profissional
              </p>
              <Link href="/pricing">
                <Button size="sm" variant="outline">Fazer Upgrade</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Cards exclusivos Premium */}
        {showPremiumData && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritaram</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFavorites}</div>
                <p className="text-xs text-muted-foreground">Interesse latente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propostas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalProposalsPending > 0 && (
                    <span className="text-amber-600">{totalProposalsPending} </span>
                  )}
                  <span className="text-base text-muted-foreground font-normal">
                    {totalProposalsPending > 0 ? 'pendente' + (totalProposalsPending > 1 ? 's' : '') : 'Nenhuma pendente'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.totals.proposals
                    ? `${summary.totals.proposals.accepted} aceita${summary.totals.proposals.accepted !== 1 ? 's' : ''} no total`
                    : ''}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tempo médio para contato — Profissional+ (do summary) */}
      {showCharts && summary?.averages.daysToFirstContact !== undefined && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Tempo médio para primeiro contato</p>
                  <p className="text-xs text-muted-foreground">Desde a publicação até o primeiro clique no WhatsApp</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {summary.averages.daysToFirstContact < 1
                  ? 'Menos de 1 dia'
                  : `${summary.averages.daysToFirstContact.toFixed(1)} dias`
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funil + Gráficos — Profissional+ */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConversionFunnel
            views={totalViews}
            contacts={totalContacts}
            favorites={showPremiumData ? totalFavorites : undefined}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5" />
                Top 5 Anúncios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topMachines.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topMachines}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3b82f6" name="Visualizações" />
                    <Bar dataKey="contatos" fill="#10b981" name="Contatos" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Benchmarks — Premium */}
      {showPremiumData && benchmarks && (
        <CategoryBenchmarkCard data={benchmarks} />
      )}

      {/* Upsell benchmarks pra Profissional */}
      {userPlan === 'profissional' && (
        <Card className="border-dashed">
          <CardContent className="py-6 text-center">
            <Lock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Compare seu desempenho com o mercado, veja favoritos e propostas por máquina
            </p>
            <p className="text-xs text-muted-foreground mb-3">Disponível no plano Premium</p>
            <Link href="/pricing">
              <Button size="sm" variant="outline">Ver plano Premium</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Insights — Profissional+ */}
      {showCharts && (
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
            {totalViews > 0 && totalContacts === 0 && (
              <p className="text-sm text-muted-foreground">
                • Você tem visualizações mas nenhum contato. Considere melhorar as fotos ou descrição.
              </p>
            )}
            {parseFloat(contactRate) > 5 && (
              <p className="text-sm text-green-600">
                • ✅ Ótima taxa de contatos ({contactRate}%)! Seus anúncios estão atraindo interesse.
              </p>
            )}
            {showPremiumData && totalFavorites > 0 && totalContacts === 0 && (
              <p className="text-sm text-blue-600">
                • 💡 {totalFavorites} pessoas favoritaram mas ninguém entrou em contato. Considere ativar Destaque.
              </p>
            )}
            {showPremiumData && benchmarks && benchmarks.comparison.viewsVsPlatform < 0.8 && (
              <p className="text-sm text-amber-600">
                • ⚠️ Suas views estão {((1 - benchmarks.comparison.viewsVsPlatform) * 100).toFixed(0)}% abaixo da média do mercado. Ative Premium pra ganhar visibilidade.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
