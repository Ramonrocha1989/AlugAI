'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Users, Package, DollarSign } from 'lucide-react';

interface ChartData {
  month: string;
  count?: number;
  amount?: number;
}

interface AdminChartsProps {
  charts?: {
    users: ChartData[];
    machines: ChartData[];
    revenue: ChartData[];
  };
}

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(m) - 1]}/${year.slice(2)}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
}

export function AdminCharts({ charts }: AdminChartsProps) {
  const [tab, setTab] = useState('users');

  if (!charts) return null;

  const usersData = charts.users.map(d => ({ ...d, label: formatMonth(d.month) }));
  const machinesData = charts.machines.map(d => ({ ...d, label: formatMonth(d.month) }));
  const revenueData = charts.revenue.map(d => ({ ...d, label: formatMonth(d.month) }));

  const totalRevenue = charts.revenue.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalNewUsers = charts.users.reduce((sum, d) => sum + (d.count || 0), 0);
  const totalNewMachines = charts.machines.reduce((sum, d) => sum + (d.count || 0), 0);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Evolução (últimos 6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1" /> Usuários ({totalNewUsers})
            </TabsTrigger>
            <TabsTrigger value="machines">
              <Package className="h-4 w-4 mr-1" /> Máquinas ({totalNewMachines})
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <DollarSign className="h-4 w-4 mr-1" /> Receita ({formatCurrency(totalRevenue)})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} usuário${value !== 1 ? 's' : ''}`, 'Novos']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="machines">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={machinesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} máquina${value !== 1 ? 's' : ''}`, 'Novas']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="revenue">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area type="monotone" dataKey="amount" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
