import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Como Escolher o Trator Usado Ideal para sua Propriedade | BaitaBriq',
  description: 'Guia completo para escolher trator usado. Potência necessária, horas de motor, marcas confiáveis, inspeção técnica e dicas de negociação. Economize na compra certa.',
  keywords: [
    'como escolher trator usado',
    'comprar trator usado',
    'trator usado dicas',
    'potência trator',
    'horas motor trator',
    'inspeção trator usado',
    'John Deere usado',
    'Case IH usado'
  ],
  openGraph: {
    title: 'Como Escolher o Trator Usado Ideal - Guia Completo',
    description: 'Tudo que você precisa saber antes de comprar um trator usado. Dicas de especialistas.',
    images: [{ url: '/logo-og.jpeg', width: 500, height: 500 }]
  }
};

export default function ComoEscolherTratorUsado() {
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
            15 de março, 2024
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            8 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Equipe BaitaBriq
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Como Escolher o Trator Usado Ideal para sua Propriedade
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Guia completo com tudo que você precisa saber antes de comprar um trator usado. 
          Potência, horas de uso, manutenção e muito mais.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">📋 Checklist Rápido</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ Definir potência necessária (cv)</li>
            <li>✅ Verificar horas de motor</li>
            <li>✅ Inspecionar sistema hidráulico</li>
            <li>✅ Testar transmissão</li>
            <li>✅ Analisar histórico de manutenção</li>
            <li>✅ Negociar preço e condições</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">1. Determine a Potência Necessária</h2>
        
        <p className="mb-4">
          A potência do trator é medida em cavalos (cv) e deve ser adequada ao tamanho da sua propriedade 
          e aos implementos que você pretende usar.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Guia de Potência por Propriedade:</h3>
          <ul className="space-y-1 text-sm">
            <li><strong>Até 50 hectares:</strong> 75-100 cv</li>
            <li><strong>50-100 hectares:</strong> 100-140 cv</li>
            <li><strong>100-200 hectares:</strong> 140-180 cv</li>
            <li><strong>Acima de 200 hectares:</strong> 180+ cv</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">2. Analise as Horas de Motor</h2>
        
        <p className="mb-4">
          As horas de motor são como a quilometragem de um carro. Quanto menos horas, melhor o estado da máquina.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Classificação por Horas:</h3>
          <ul className="space-y-1 text-sm">
            <li><strong>0-2.000 horas:</strong> Excelente estado</li>
            <li><strong>2.000-4.000 horas:</strong> Bom estado</li>
            <li><strong>4.000-6.000 horas:</strong> Estado regular</li>
            <li><strong>Acima de 6.000 horas:</strong> Requer inspeção detalhada</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">3. Principais Marcas e Modelos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🟢 John Deere</h3>
            <p className="text-sm text-muted-foreground">
              Série 5000, 6000, 7000. Conhecida pela durabilidade e revenda.
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🔴 Case IH</h3>
            <p className="text-sm text-muted-foreground">
              Farmall, Puma, Magnum. Excelente custo-benefício.
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🔵 New Holland</h3>
            <p className="text-sm text-muted-foreground">
              Série T6, T7, T8. Tecnologia avançada e conforto.
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🟡 Massey Ferguson</h3>
            <p className="text-sm text-muted-foreground">
              4200, 6700, 8700. Tradição e robustez.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">4. Inspeção Técnica</h2>
        
        <h3 className="text-lg font-semibold mb-3">Motor</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Verifique se não há vazamentos de óleo</li>
          <li>Observe a cor da fumaça do escapamento</li>
          <li>Teste a partida a frio</li>
          <li>Analise ruídos anormais</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Sistema Hidráulico</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Teste o levante hidráulico</li>
          <li>Verifique vazamentos nas mangueiras</li>
          <li>Analise a resposta dos comandos</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Transmissão</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Teste todas as marchas</li>
          <li>Verifique se não há trancos</li>
          <li>Analise o funcionamento da embreagem</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">5. Documentação e Histórico</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">⚠️ Documentos Essenciais:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Nota fiscal de compra</li>
            <li>• Histórico de manutenções</li>
            <li>• Manual do proprietário</li>
            <li>• Certificado de origem (se importado)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">6. Negociação e Financiamento</h2>
        
        <p className="mb-4">
          Pesquise o preço de mercado antes de negociar. Use sites como BaitaBriq para comparar valores.
        </p>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">💰 Opções de Financiamento:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Pronaf (até 2,75% ao ano)</li>
            <li>• Bancos privados (5-8% ao ano)</li>
            <li>• Cooperativas de crédito</li>
            <li>• Financiamento direto com o vendedor</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">Conclusão</h2>
        
        <p className="mb-4">
          Escolher um trator usado requer atenção aos detalhes e conhecimento técnico. 
          Não tenha pressa na decisão e sempre faça uma inspeção completa antes da compra.
        </p>

        <div className="bg-primary/10 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-2">🚜 Encontre seu Trator Ideal</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No BaitaBriq você encontra tratores usados de todas as marcas e modelos, 
            com histórico completo e preços competitivos.
          </p>
          <Link href="/categoria/tratores">
            <Button>Ver Tratores Disponíveis</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}