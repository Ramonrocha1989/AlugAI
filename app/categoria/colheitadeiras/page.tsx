import { Metadata } from 'next';
import { machineService } from '@/services/machine-api';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Machine } from '@/types/machine';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Colheitadeiras Usadas - RS, SC, PR | BaitaBriq',
  description: 'Colheitadeiras usadas no Sul do Brasil. Case IH, John Deere, New Holland. Ideais para soja, milho, arroz e trigo. Veja ofertas com financiamento disponível.',
  keywords: [
    'colheitadeiras usadas',
    'Case IH Axial Flow',
    'John Deere STS',
    'New Holland CR',
    'colheitadeiras soja',
    'colheitadeiras milho',
    'colheitadeiras arroz',
    'colheitadeiras RS',
    'colheitadeiras SC',
    'colheitadeiras PR'
  ],
  openGraph: {
    title: 'Colheitadeiras Usadas no Sul do Brasil | BaitaBriq',
    description: 'Colheitadeiras para todas as culturas. Case IH, John Deere, New Holland com preços competitivos.',
    images: [{ url: '/logo-og.jpeg', width: 500, height: 500 }]
  }
};

export default async function ColheitadeirasPage() {
  let machines: Machine[] = [];
  
  try {
    machines = await machineService.getAll({ 
      category: 'colheitadeiras',
      limit: 50 
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Erro ao carregar colheitadeiras');
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
        
        <h1 className="text-4xl font-bold mb-4">Colheitadeiras Usadas no Sul do Brasil</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Colheitadeiras para soja, milho, arroz e trigo. Marcas líderes: Case IH, John Deere, 
          New Holland com tecnologia avançada e preços competitivos.
        </p>
        
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">Colheitadeiras por Cultura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">🌾 Soja e Milho</h3>
              <p className="text-muted-foreground">Case IH Axial Flow, John Deere STS, New Holland CR</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">🌾 Arroz</h3>
              <p className="text-muted-foreground">Modelos especiais para lavouras alagadas</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">🌾 Trigo</h3>
              <p className="text-muted-foreground">Sistemas de debulha otimizados</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">💰 Financiamento</h3>
              <p className="text-muted-foreground">Condições especiais para produtores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {machines.length} Colheitadeiras Disponíveis
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
            Nenhuma colheitadeira disponível no momento.
          </p>
          <Link href="/">
            <Button className="mt-4">Ver todas as máquinas</Button>
          </Link>
        </div>
      )}

      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Principais Modelos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium">Case IH</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• Axial Flow 2388</li>
              <li>• Axial Flow 2588</li>
              <li>• Axial Flow 7120</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">John Deere</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• STS 9600</li>
              <li>• STS 9650</li>
              <li>• S670</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">New Holland</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• CR 5080</li>
              <li>• CR 6080</li>
              <li>• CR 7080</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}