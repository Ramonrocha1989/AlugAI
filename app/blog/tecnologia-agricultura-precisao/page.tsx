import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tecnologia na Agricultura: GPS e Agricultura de Precisão | BaitaBriq',
  description: 'Como a tecnologia está revolucionando a agricultura. GPS, sensores, agricultura de precisão, drones e IoT explicados de forma simples para produtores rurais.',
  keywords: [
    'agricultura de precisão',
    'GPS agricultura',
    'tecnologia rural',
    'sensores agricultura',
    'drones agricultura',
    'IoT rural',
    'agricultura 4.0',
    'precisão plantio'
  ]
};

export default function TecnologiaAgricultura() {
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
            28 de fevereiro, 2024
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            7 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Equipe BaitaBriq
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Tecnologia na Agricultura: GPS e Agricultura de Precisão
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Como a tecnologia está revolucionando a agricultura. GPS, sensores e 
          agricultura de precisão explicados de forma simples.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">🚀 Benefícios da Agricultura de Precisão</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ <strong>Economia:</strong> Redução significativa no uso de insumos</li>
            <li>✅ <strong>Produtividade:</strong> Aumento na eficiência da colheita</li>
            <li>✅ <strong>Sustentabilidade:</strong> Menor impacto ambiental</li>
            <li>✅ <strong>Precisão:</strong> Aplicação exata de fertilizantes e defensivos</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">1. O que é Agricultura de Precisão?</h2>
        
        <p className="mb-4">
          A agricultura de precisão é um sistema de manejo que usa tecnologia para 
          observar, medir e responder à variabilidade dos campos de cultivo, 
          otimizando retornos e preservando recursos.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🎯 Princípios Básicos:</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Variabilidade:</strong> Reconhecer que cada área do campo é única</li>
            <li>• <strong>Coleta de dados:</strong> Sensores e GPS coletam informações precisas</li>
            <li>• <strong>Análise:</strong> Software especializado processa os dados</li>
            <li>• <strong>Aplicação:</strong> Tratamento específico para cada zona</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">2. GPS na Agricultura</h2>
        
        <p className="mb-4">
          O GPS (Sistema de Posicionamento Global) é a base da agricultura de precisão, 
          permitindo localização exata e navegação automática das máquinas.
        </p>

        <h3 className="text-lg font-semibold mb-3">Tipos de GPS Agrícola</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="font-semibold mb-2">GPS Básico</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Precisão:</strong> 3-5 metros</li>
              <li>• <strong>Uso:</strong> Mapeamento básico</li>
              <li>• <strong>Ideal para:</strong> Iniciantes</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="font-semibold mb-2">GPS DGPS</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Precisão:</strong> 30cm - 1 metro</li>
              <li>• <strong>Uso:</strong> Aplicação variável</li>
              <li>• <strong>Ideal para:</strong> Médios produtores</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="font-semibold mb-2">GPS RTK</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Precisão:</strong> 2-5 centímetros</li>
              <li>• <strong>Uso:</strong> Piloto automático</li>
              <li>• <strong>Ideal para:</strong> Grandes produtores</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">3. Sensores na Agricultura</h2>
        
        <h3 className="text-lg font-semibold mb-3">Sensores de Solo</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>pH:</strong> Mede acidez do solo em tempo real</li>
          <li><strong>Umidade:</strong> Monitora necessidade de irrigação</li>
          <li><strong>Nutrientes:</strong> Detecta deficiências nutricionais</li>
          <li><strong>Compactação:</strong> Identifica áreas que precisam de descompactação</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Sensores de Cultura</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><strong>NDVI:</strong> Índice de vegetação (saúde das plantas)</li>
          <li><strong>Clorofila:</strong> Indica necessidade de nitrogênio</li>
          <li><strong>Biomassa:</strong> Monitora desenvolvimento da cultura</li>
          <li><strong>Estresse hídrico:</strong> Detecta necessidade de água</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">4. Aplicação Variável de Insumos</h2>
        
        <p className="mb-4">
          A aplicação variável permite usar diferentes quantidades de insumos 
          conforme a necessidade específica de cada área do campo.
        </p>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">💡 Exemplos Práticos:</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Sementes:</strong> Densidade variável conforme potencial da área</li>
            <li>• <strong>Fertilizantes:</strong> Aplicação baseada em análise de solo</li>
            <li>• <strong>Defensivos:</strong> Aplicação apenas onde há pragas/doenças</li>
            <li>• <strong>Calcário:</strong> Correção específica por zona de manejo</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">5. Drones na Agricultura</h2>
        
        <p className="mb-4">
          Drones oferecem monitoramento aéreo de baixo custo e alta resolução, 
          complementando os dados coletados por satélites e sensores terrestres.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📸 Monitoramento</h3>
            <ul className="text-sm space-y-1">
              <li>• Mapeamento de pragas e doenças</li>
              <li>• Contagem de plantas</li>
              <li>• Análise de estande</li>
              <li>• Detecção precoce de problemas</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🚁 Aplicação</h3>
            <ul className="text-sm space-y-1">
              <li>• Pulverização localizada</li>
              <li>• Liberação de inimigos naturais</li>
              <li>• Semeadura em áreas específicas</li>
              <li>• Aplicação de fertilizantes</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">6. Internet das Coisas (IoT) Rural</h2>
        
        <p className="mb-4">
          A IoT conecta equipamentos, sensores e sistemas, permitindo monitoramento 
          e controle remoto de toda a operação agrícola.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🌐 Aplicações IoT:</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Estações meteorológicas:</strong> Dados climáticos em tempo real</li>
            <li>• <strong>Irrigação inteligente:</strong> Acionamento automático baseado em sensores</li>
            <li>• <strong>Monitoramento de gado:</strong> Localização e saúde animal</li>
            <li>• <strong>Silos inteligentes:</strong> Controle de temperatura e umidade</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">7. Investimento e Retorno</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">💰 Considerações sobre Investimento:</h3>
          <ul className="space-y-1 text-sm">
            <li>• O investimento varia conforme o nível de tecnologia escolhido</li>
            <li>• Retorno depende do tamanho da propriedade e culturas</li>
            <li>• Economia de insumos pode ser significativa</li>
            <li>• Aumento de produtividade é comum</li>
            <li>• Payback geralmente ocorre em poucos anos</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">8. Como Começar</h2>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🚀 Passos Recomendados:</h3>
          <ol className="space-y-1 text-sm list-decimal list-inside">
            <li>Faça análise de solo georreferenciada da propriedade</li>
            <li>Instale GPS básico no trator principal</li>
            <li>Comece com aplicação variável de calcário</li>
            <li>Implemente monitoramento de produtividade</li>
            <li>Expanda gradualmente para outras tecnologias</li>
            <li>Busque capacitação técnica adequada</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mb-4">9. Tendências Futuras</h2>
        
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><strong>Inteligência Artificial:</strong> Análise preditiva de dados agrícolas</li>
          <li><strong>Robôs agrícolas:</strong> Automação de operações de campo</li>
          <li><strong>Blockchain:</strong> Rastreabilidade da produção</li>
          <li><strong>Conectividade:</strong> Melhor acesso à internet no campo</li>
          <li><strong>Biotecnologia:</strong> Integração com melhoramento genético</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Conclusão</h2>
        
        <p className="mb-4">
          A tecnologia na agricultura não é mais um luxo, mas uma ferramenta essencial 
          para manter competitividade e sustentabilidade. O importante é começar 
          gradualmente e escolher tecnologias adequadas ao seu perfil.
        </p>

        <div className="bg-primary/10 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-2">🚜 Máquinas com Tecnologia</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No BaitaBriq você encontra tratores e colheitadeiras já equipados 
            com sistemas de GPS e agricultura de precisão.
          </p>
          <Link href="/categoria/tratores">
            <Button>Ver Tratores com Tecnologia</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}