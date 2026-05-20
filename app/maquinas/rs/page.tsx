import { Metadata } from 'next';
import { machineService } from '@/services/machine-api';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

import { Machine } from '@/types/machine';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Máquinas Agrícolas Usadas no Rio Grande do Sul - RS | BaitaBriq',
  description: 'Máquinas agrícolas usadas no RS. Tratores, colheitadeiras e implementos em Pelotas, Porto Alegre, Santa Maria, Passo Fundo. Financiamento disponível para produtores gaúchos.',
  keywords: [
    'máquinas agrícolas RS',
    'tratores usados Rio Grande do Sul',
    'colheitadeiras RS',
    'máquinas Pelotas',
    'tratores Porto Alegre',
    'implementos Santa Maria',
    'máquinas Passo Fundo',
    'equipamentos agrícolas gaúcho'
  ],
  openGraph: {
    title: 'Máquinas Agrícolas Usadas no Rio Grande do Sul | BaitaBriq',
    description: 'Encontre máquinas agrícolas usadas no RS. Tratores, colheitadeiras e implementos com preços especiais.',
    images: [{ url: '/logo-og.jpeg', width: 500, height: 500 }]
  }
};

export default async function MaquinasRSPage() {
  let machines: Machine[] = [];
  
  try {
    machines = await machineService.getAll({ 
      state: 'RS',
      limit: 50 
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Erro ao carregar máquinas RS');
  }

  const cities = [
    'Pelotas', 'Porto Alegre', 'Santa Maria', 'Passo Fundo', 
    'Cruz Alta', 'Ijuí', 'Bagé', 'Uruguaiana'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </Link>
        
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-bold">Máquinas Agrícolas no Rio Grande do Sul</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          Encontre máquinas agrícolas usadas no RS. Atendemos produtores rurais em todo o estado 
          com tratores, colheitadeiras e implementos das melhores marcas.
        </p>
        
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">Por que escolher máquinas no RS?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Tradição Agrícola:</strong> Estado líder em tecnologia rural</li>
            <li>• <strong>Qualidade:</strong> Máquinas bem conservadas pelo clima</li>
            <li>• <strong>Variedade:</strong> Equipamentos para soja, milho, arroz e pecuária</li>
            <li>• <strong>Logística:</strong> Entrega facilitada em todo o estado</li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {machines.length} Máquinas Disponíveis no RS
        </h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Principais Cidades Atendidas:</h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <span key={city} className="bg-secondary px-3 py-1 rounded-full text-sm">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {machines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhuma máquina disponível no RS no momento.
          </p>
          <Link href="/">
            <Button className="mt-4">Ver todas as máquinas</Button>
          </Link>
        </div>
      )}

      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Agricultura no Rio Grande do Sul</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium">🌾 Principais Culturas</h3>
            <p className="text-muted-foreground">Soja, milho, arroz, trigo, fumo</p>
          </div>
          <div>
            <h3 className="font-medium">🐄 Pecuária</h3>
            <p className="text-muted-foreground">Gado de corte e leiteiro</p>
          </div>
          <div>
            <h3 className="font-medium">📍 Regiões</h3>
            <p className="text-muted-foreground">Fronteira Oeste, Serra, Missões</p>
          </div>
        </div>
      </div>
    </div>
  );
}