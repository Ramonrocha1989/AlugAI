import { Metadata } from 'next';
import { machineService } from '@/services/machine-api';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Machine } from '@/types/machine';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tratores Usados - RS, SC, PR | BaitaBriq',
  description: 'Tratores agrícolas usados no Sul do Brasil. John Deere, Case IH, New Holland, Massey Ferguson. Veja ofertas em Pelotas, Porto Alegre, Chapecó, Cascavel. Financiamento disponível.',
  keywords: [
    'tratores usados',
    'John Deere usado',
    'Case IH usado',
    'New Holland usado',
    'Massey Ferguson usado',
    'tratores RS',
    'tratores SC',
    'tratores PR',
    'tratores Pelotas',
    'tratores Porto Alegre',
    'tratores Chapecó',
    'tratores Cascavel'
  ],
  openGraph: {
    title: 'Tratores Usados no Sul do Brasil | BaitaBriq',
    description: 'Encontre o trator ideal para sua propriedade. Marcas líderes, preços competitivos e financiamento disponível.',
    images: [{ url: '/logo-og.jpeg', width: 500, height: 500 }]
  }
};

export default async function TratoresPage() {
  let machines: Machine[] = [];
  
  try {
    machines = await machineService.getAll({ 
      category: 'tratores',
      limit: 50 
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Erro ao carregar tratores');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Tratores Usados no Sul do Brasil</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Encontre o trator ideal para sua propriedade rural. Temos as melhores marcas: 
          John Deere, Case IH, New Holland, Massey Ferguson e muito mais.
        </p>
        
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">Por que escolher tratores usados?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Economia:</strong> Até 50% mais barato que máquinas novas</li>
            <li>• <strong>Variedade:</strong> Modelos de todas as potências e anos</li>
            <li>• <strong>Qualidade:</strong> Máquinas revisadas e com histórico</li>
            <li>• <strong>Financiamento:</strong> Condições especiais para produtores rurais</li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {machines.length} Tratores Disponíveis
        </h2>
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
            Nenhum trator disponível no momento.
          </p>
          <Link href="/">
            <Button className="mt-4">Ver todas as máquinas</Button>
          </Link>
        </div>
      )}

      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Principais Marcas de Tratores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="font-medium">John Deere</h3>
            <p className="text-muted-foreground">Série 5000, 6000, 7000</p>
          </div>
          <div>
            <h3 className="font-medium">Case IH</h3>
            <p className="text-muted-foreground">Farmall, Puma, Magnum</p>
          </div>
          <div>
            <h3 className="font-medium">New Holland</h3>
            <p className="text-muted-foreground">T6, T7, T8</p>
          </div>
          <div>
            <h3 className="font-medium">Massey Ferguson</h3>
            <p className="text-muted-foreground">4200, 6700, 8700</p>
          </div>
        </div>
      </div>
    </div>
  );
}