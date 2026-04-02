import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Financiamento de Máquinas Agrícolas em 2024 | BaitaBriq',
  description: 'Conheça as principais opções de financiamento para máquinas agrícolas. Pronaf, bancos privados, cooperativas e dicas para conseguir aprovação.',
  keywords: [
    'financiamento máquinas agrícolas',
    'Pronaf 2024',
    'crédito rural',
    'financiamento trator',
    'financiamento colheitadeira',
    'banco do brasil rural',
    'cooperativas crédito',
    'como financiar máquinas'
  ]
};

export default function FinanciamentoMaquinas() {
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
            5 de março, 2024
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            10 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Equipe BaitaBriq
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Financiamento de Máquinas Agrícolas em 2024
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Conheça as principais opções de financiamento para máquinas agrícolas. 
          Pronaf, bancos privados, cooperativas e dicas para conseguir aprovação.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3">⚠️ Importante</h2>
          <p className="text-sm">
            <strong>Taxas e condições variam constantemente.</strong> Sempre consulte diretamente 
            as instituições financeiras para obter informações atualizadas e condições específicas 
            para seu perfil.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">1. Pronaf - Programa Nacional de Fortalecimento da Agricultura Familiar</h2>
        
        <p className="mb-4">
          O Pronaf oferece as melhores condições para pequenos e médios produtores rurais, 
          com taxas subsidiadas pelo governo federal.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">📋 Requisitos Gerais Pronaf:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Enquadramento como agricultor familiar</li>
            <li>• Mão de obra familiar predominante</li>
            <li>• DAP (Declaração de Aptidão ao Pronaf) ativa</li>
            <li>• Residir na propriedade ou comunidade rural</li>
            <li>• Renda dentro dos limites estabelecidos</li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold mb-3">Principais Modalidades Pronaf</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pronaf Mais Alimentos</h4>
            <ul className="text-sm space-y-1">
              <li>• Foco em máquinas e equipamentos</li>
              <li>• Taxas subsidiadas</li>
              <li>• Prazos estendidos</li>
              <li>• Carência para pagamento</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pronaf Investimento</h4>
            <ul className="text-sm space-y-1">
              <li>• Modernização da propriedade</li>
              <li>• Condições especiais</li>
              <li>• Acompanhamento técnico</li>
              <li>• Flexibilidade de pagamento</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">2. Bancos Privados</h2>
        
        <p className="mb-4">
          Bancos privados oferecem maior agilidade e flexibilidade, sendo uma opção 
          para produtores que não se enquadram no Pronaf ou precisam de valores maiores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Grandes Bancos</h3>
            <ul className="text-sm space-y-1">
              <li>• Santander</li>
              <li>• Bradesco</li>
              <li>• Itaú</li>
              <li>• Banco do Brasil</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Vantagens</h3>
            <ul className="text-sm space-y-1">
              <li>• Agilidade na aprovação</li>
              <li>• Valores mais altos</li>
              <li>• Menos burocracia</li>
              <li>• Atendimento especializado</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Características</h3>
            <ul className="text-sm space-y-1">
              <li>• Taxas de mercado</li>
              <li>• Entrada exigida</li>
              <li>• Garantias necessárias</li>
              <li>• Análise de crédito rigorosa</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">3. Cooperativas de Crédito</h2>
        
        <p className="mb-4">
          Cooperativas oferecem excelente custo-benefício e relacionamento próximo com o produtor rural.
        </p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">🏆 Principais Cooperativas:</h3>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Sicredi:</strong> Forte presença no Sul do Brasil</li>
            <li>• <strong>Sicoob:</strong> Atuação nacional</li>
            <li>• <strong>Cresol:</strong> Foco na agricultura familiar</li>
            <li>• <strong>Unicred:</strong> Atende diversos perfis</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">4. Documentação Necessária</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📄 Documentos Pessoais</h3>
            <ul className="text-sm space-y-1">
              <li>• CPF e RG</li>
              <li>• Comprovante de residência</li>
              <li>• Certidão de casamento (se casado)</li>
              <li>• Declaração de Imposto de Renda</li>
              <li>• Comprovantes de renda</li>
            </ul>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🏡 Documentos da Propriedade</h3>
            <ul className="text-sm space-y-1">
              <li>• Escritura ou contrato de arrendamento</li>
              <li>• ITR (Imposto Territorial Rural)</li>
              <li>• CAR (Cadastro Ambiental Rural)</li>
              <li>• Licenças ambientais (se necessário)</li>
              <li>• CCIR (Certificado de Cadastro de Imóvel Rural)</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">5. Dicas para Aprovação</h2>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">✅ Como Aumentar suas Chances:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Mantenha CPF e CNPJ limpos (sem restrições)</li>
            <li>• Comprove renda estável e compatível</li>
            <li>• Tenha relacionamento bancário sólido</li>
            <li>• Apresente projeto técnico bem elaborado</li>
            <li>• Ofereça garantias adequadas</li>
            <li>• Negocie entrada maior para melhores condições</li>
            <li>• Busque orientação técnica especializada</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">6. Alternativas de Financiamento</h2>
        
        <h3 className="text-lg font-semibold mb-3">Leasing (Arrendamento Mercantil)</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Não compromete limite de crédito tradicional</li>
          <li>Possíveis benefícios fiscais</li>
          <li>Opção de compra ao final do contrato</li>
          <li>Processo de aprovação mais ágil</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Consórcio</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Sem incidência de juros</li>
          <li>Possibilidade de dar lances</li>
          <li>Prazos mais longos</li>
          <li>Taxa de administração fixa</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">7. Cuidados Importantes</h2>
        
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">⚠️ Atenção:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Sempre compare taxas e condições entre diferentes instituições</li>
            <li>• Leia atentamente todos os termos do contrato</li>
            <li>• Considere sua capacidade real de pagamento</li>
            <li>• Verifique se há seguros obrigatórios</li>
            <li>• Consulte um contador ou consultor rural</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-4">Conclusão</h2>
        
        <p className="mb-4">
          O financiamento de máquinas agrícolas oferece diversas opções para diferentes perfis 
          de produtores. A escolha da melhor alternativa depende do seu enquadramento, 
          necessidades e capacidade de pagamento.
        </p>

        <p className="mb-4">
          <strong>Recomendação:</strong> Sempre busque orientação profissional e compare 
          as condições oferecidas por diferentes instituições antes de tomar uma decisão.
        </p>

        <div className="bg-primary/10 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-2">🚜 Encontre sua Máquina Ideal</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No BaitaBriq você encontra máquinas de todas as faixas de preço. 
            Entre em contato com os vendedores para negociar condições de pagamento.
          </p>
          <Link href="/">
            <Button>Ver Máquinas Disponíveis</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}