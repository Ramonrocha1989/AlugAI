'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MessageCircle, Heart } from 'lucide-react';

interface FunnelStep {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface ConversionFunnelProps {
  views: number;
  contacts: number;
  favorites?: number;
}

export function ConversionFunnel({ views, contacts, favorites }: ConversionFunnelProps) {
  const steps: FunnelStep[] = [
    { label: 'Visualizações', value: views, icon: <Eye className="h-4 w-4" />, color: 'text-blue-600', bgColor: 'bg-blue-500' },
  ];

  if (favorites !== undefined) {
    steps.push({
      label: 'Favoritaram', value: favorites, icon: <Heart className="h-4 w-4" />, color: 'text-red-500', bgColor: 'bg-red-500',
    });
  }

  steps.push({
    label: 'Contatos (WhatsApp)', value: contacts, icon: <MessageCircle className="h-4 w-4" />, color: 'text-green-600', bgColor: 'bg-green-500',
  });

  const maxValue = Math.max(...steps.map(s => s.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, i) => {
          const width = maxValue > 0 ? Math.min(Math.max((step.value / maxValue) * 100, 8), 100) : 8;
          const prevValue = i > 0 ? steps[i - 1].value : null;
          const dropRate = prevValue && prevValue > 0
            ? ((1 - step.value / prevValue) * 100).toFixed(0)
            : null;

          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-1.5 text-sm font-medium ${step.color}`}>
                  {step.icon} {step.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{step.value.toLocaleString('pt-BR')}</span>
                  {dropRate && Number(dropRate) > 0 && (
                    <span className="text-xs text-muted-foreground">
                      (-{dropRate}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`${step.bgColor} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}

        {views > 0 && (
          <div className="pt-3 border-t text-center">
            <span className="text-xs text-muted-foreground">
              Conversão total: <span className="font-semibold">{((contacts / views) * 100).toFixed(1)}%</span> (visualização → contato)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
