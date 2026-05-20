import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manutenção de Colheitadeira: Prepare-se para a Safra | BaitaBriq',
  description: 'Checklist completo de manutenção preventiva para colheitadeiras. Garanta máxima eficiência na colheita com dicas de especialistas. Case IH, John Deere, New Holland.',
  keywords: [
    'manutenção colheitadeira',
    'preparação safra',
    'colheitadeira Case IH',
    'colheitadeira John Deere',
    'manutenção preventiva',
    'checklist colheitadeira',
    'revisão colheitadeira',
    'safra 2024'
  ],
  openGraph: {
    title: 'Manutenção de Colheitadeira: Prepare-se para a Safra',
    description: 'Checklist completo para manter sua colheitadeira em perfeito estado.',
    images: [{ url: '/logo-og.jpeg', width: 500, height: 500 }]
  }
};

export default function ManutencaoColheitadeira() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao blog
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            10 de março, 2024
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            6 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Equipe BaitaBriq
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Manutenção de Colheitadeira: Prepare-se para a Safra
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Checklist completo de manutenção preventiva para colheitadeiras. 
          Garanta máxima eficiência na colheita e evite paradas custosas.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">⚡ Checklist Rápido - Pré-Safra</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ Verificar correntes e correias</li>
            <li>✅ Lubrificar pontos de graxa</li>
            <li>✅ Testar sistema hidráulico</li>
            <li>✅ Calibrar peneiras</li>
            <li>✅ Verificar facas e contra-facas</li>
            <li>✅ Testar sistema elétrico</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">1. Inspeção Geral da Máquina</h2>
        
        <p className="mb-4">
          Antes de iniciar a safra, faça uma inspeção visual completa da colheitadeira. 
          Procure por sinais de desgaste, vazamentos ou danos estruturais.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🔍 Pontos de Atenção:</h3>
          <ul className="space-y-1 text-sm">
            <li><strong>Chassi:</strong> Verificar soldas e estrutura</li>
            <li><strong>Pneus:</strong> Pressão e desgaste</li>
            <li><strong>Cabine:</strong> Vidros, ar condicionado, assentos</li>
            <li><strong>Capôs:</strong> Fechamento e vedação</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">2. Sistema de Corte</h2>
        
        <p className="mb-4">
          O sistema de corte é fundamental para uma colheita eficiente. Facas cegas podem 
          causar perdas significativas e sobrecarregar o motor.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🔪 Manutenção do Sistema de Corte:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Afiar ou substituir facas desgastadas</li>
            <li>• Verificar contra-facas e dedos</li>
            <li>• Ajustar folga entre facas</li>
            <li>• Lubrificar articulações</li>
            <li>• Testar movimento lateral</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">3. Sistema de Debulha</h2>
        
        <h3 className="text-lg font-semibold mb-3">Cilindro Debulhador</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Verificar desgaste das barras debulhadoras</li>
          <li>Ajustar folga do côncavo</li>
          <li>Verificar balanceamento do cilindro</li>
          <li>Lubrificar rolamentos</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Peneiras</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Limpar peneiras superiores e inferiores</li>
          <li>Verificar furos e rasgos</li>
          <li>Calibrar abertura conforme cultura</li>
          <li>Testar movimento de vaivém</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">4. Sistema Hidráulico</h2>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🔧 Checklist Hidráulico:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Verificar nível e qualidade do óleo</li>
            <li>• Inspecionar mangueiras e conexões</li>
            <li>• Testar cilindros hidráulicos</li>
            <li>• Verificar filtros hidráulicos</li>
            <li>• Testar bomba hidráulica</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">5. Motor e Transmissão</h2>
        
        <h3 className="text-lg font-semibold mb-3">Motor</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Trocar óleo e filtros</li>
          <li>Verificar sistema de arrefecimento</li>
          <li>Limpar radiador e intercooler</li>
          <li>Verificar correias e tensionamento</li>
          <li>Testar sistema de injeção</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Transmissão</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Verificar óleo da transmissão</li>
          <li>Testar todas as marchas</li>
          <li>Ajustar embreagem</li>
          <li>Verificar diferencial</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">6. Calibrações por Cultura</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🌾 Soja</h3>
            <ul className="text-sm space-y-1">
              <li>• Cilindro: 300-500 rpm</li>
              <li>• Côncavo: 8-15 mm</li>
              <li>• Peneira superior: 12-16 mm</li>
              <li>• Peneira inferior: 4-6 mm</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🌽 Milho</h3>
            <ul className="text-sm space-y-1">
              <li>• Cilindro: 200-400 rpm</li>
              <li>• Côncavo: 15-25 mm</li>
              <li>• Peneira superior: 18-22 mm</li>
              <li>• Peneira inferior: 8-12 mm</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">7. Cronograma de Manutenção</h2>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">📅 Quando Fazer:</h3>
          <ul className="space-y-1 text-sm">
            <li><strong>30 dias antes da safra:</strong> Manutenção completa</li>
            <li><strong>15 dias antes:</strong> Testes finais e calibrações</li>
            <li><strong>Durante a safra:</strong> Inspeções diárias</li>
            <li><strong>A cada 50 horas:</strong> Lubrificação geral</li>
            <li><strong>Pós-safra:</strong> Limpeza e armazenamento</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">8. Dicas por Marca</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Case IH</h3>
            <p className="text-sm text-muted-foreground">
              Atenção especial ao sistema Axial Flow. 
              Verificar rotor e côncavos.
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">John Deere</h3>
            <p className="text-sm text-muted-foreground">
              Sistema STS requer calibração precisa 
              das peneiras e ventilador.
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">New Holland</h3>
            <p className="text-sm text-muted-foreground">
              Sistema Twin Rotor necessita 
              balanceamento dos rotores.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Conclusão</h2>
        
        <p className="mb-4">
          Uma manutenção preventiva bem executada pode aumentar a eficiência da colheita 
          em até 15% e reduzir custos operacionais significativamente.
        </p>

        <div className="bg-primary/10 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-2">🌾 Encontre Colheitadeiras Usadas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No BaitaBriq você encontra colheitadeiras usadas de todas as marcas, 
            revisadas e com histórico de manutenção completo.
          </p>
          <Link href="/categoria/colheitadeiras">
            <Button>Ver Colheitadeiras Disponíveis</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}