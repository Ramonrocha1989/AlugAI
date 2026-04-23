'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CategoryBenchmarks } from '@/types/machine';

interface CategoryBenchmarkCardProps {
  data: CategoryBenchmarks;
}

function ComparisonIndicator({ ratio }: { ratio: number }) {
  if (ratio > 1.1) {
    return (
      <Badge className="bg-green-100 text-green-700 gap-1">
        <TrendingUp className="h-3 w-3" />
        {((ratio - 1) * 100).toFixed(0)}% acima
      </Badge>
    );
  }
  if (ratio < 0.9) {
    return (
      <Badge className="bg-red-100 text-red-700 gap-1">
        <TrendingDown className="h-3 w-3" />
        {((1 - ratio) * 100).toFixed(0)}% abaixo
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 text-gray-700 gap-1">
      <Minus className="h-3 w-3" />
      Na média
    </Badge>
  );
}

export function CategoryBenchmarkCard({ data }: CategoryBenchmarkCardProps) {
  const categoryName = data.category?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || data.category;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(price);

  const rows = [
    {
      label: 'Visualizações médias',
      yours: Math.round(data.userAverage.views),
      platform: Math.round(data.platformAverage.views),
      ratio: data.comparison.viewsVsPlatform,
    },
    {
      label: 'Taxa de cliques',
      yours: `${data.userAverage.clickRatePercent.toFixed(1)}%`,
      platform: `${data.platformAverage.clickRatePercent.toFixed(1)}%`,
      ratio: data.comparison.clickRateVsPlatform,
    },
    {
      label: 'Preço médio',
      yours: formatPrice(data.userAverage.averagePrice),
      platform: formatPrice(data.platformAverage.averagePrice),
      ratio: null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          📊 Seu desempenho vs mercado
          <Badge variant="secondary">{categoryName}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{row.label}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm">
                    Você: <span className="font-semibold">{row.yours}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">|</span>
                  <span className="text-sm text-muted-foreground">
                    Mercado: {row.platform}
                  </span>
                </div>
              </div>
              {row.ratio !== null && <ComparisonIndicator ratio={row.ratio} />}
            </div>
          ))}
        </div>

        {data.platformAverage.daysToSell > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              ⏱️ Tempo médio de venda na categoria: <span className="font-semibold">{data.platformAverage.daysToSell} dias</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
