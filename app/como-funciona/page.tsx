import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Funciona - BaitaBriq | Marketplace de Máquinas Agrícolas',
  description: 'Saiba como comprar e vender máquinas agrícolas no BaitaBriq. Guia completo para vendedores e compradores. Planos gratuito e lojista disponíveis.',
  keywords: [
    'como funciona BaitaBriq',
    'vender máquinas agrícolas',
    'comprar tratores usados',
    'marketplace máquinas sul brasil',
    'plano lojista',
    'vendedor verificado',
    'segurança compra máquinas',
    'como vender trator',
    'como comprar colheitadeira'
  ],
  openGraph: {
    title: 'Como Funciona o BaitaBriq - Marketplace de Máquinas Agrícolas',
    description: 'Conectamos vendedores e compradores de máquinas agrícolas no Sul do Brasil',
    type: 'website',
    images: [{ url: '/logo.jpeg', width: 1200, height: 630 }]
  },
  alternates: {
    canonical: '/como-funciona'
  }
};

export default function ComoFuncionaPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Como Funciona</h1>
      
      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">🚜 O que é o BaitaBriq?</h2>
          <p className="text-muted-foreground">
            Somos um marketplace especializado em máquinas agrícolas e de construção no Sul do Brasil. 
            Conectamos vendedores e compradores de forma rápida e segura.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">📱 Para Vendedores</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">1️⃣ Cadastre-se Grátis</h3>
              <p className="text-blue-800 text-sm">
                Crie sua conta com email e WhatsApp. É rápido e gratuito!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">2️⃣ Anuncie sua Máquina</h3>
              <p className="text-blue-800 text-sm">
                Preencha as informações: fotos, preço, ano, horas de uso, número de chassi. 
                Quanto mais completo, mais confiança você passa!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">3️⃣ Receba Propostas no WhatsApp</h3>
              <p className="text-blue-800 text-sm">
                Compradores interessados entram em contato direto pelo seu WhatsApp. 
                Você negocia diretamente, sem intermediários.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">4️⃣ Feche o Negócio</h3>
              <p className="text-blue-800 text-sm">
                Combine visita, teste, documentação e pagamento diretamente com o comprador.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">🔍 Para Compradores</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">1️⃣ Busque a Máquina Ideal</h3>
              <p className="text-green-800 text-sm">
                Use filtros por categoria, preço, ano, localização e até por cultura (arroz, soja, milho).
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">2️⃣ Veja Detalhes Completos</h3>
              <p className="text-green-800 text-sm">
                Fotos, especificações técnicas, horas de uso, número de chassi, avaliações do vendedor.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">3️⃣ Entre em Contato</h3>
              <p className="text-green-800 text-sm">
                Clique em &quot;Falar no WhatsApp&quot; e negocie direto com o vendedor. 
                Tire dúvidas, agende visita, faça proposta.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">4️⃣ Inspecione Antes de Comprar</h3>
              <p className="text-green-800 text-sm">
                <strong>IMPORTANTE:</strong> Sempre veja a máquina pessoalmente, teste, 
                verifique documentação e número de chassi antes de pagar.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">💎 Planos Disponíveis</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Gratuito</h3>
              <p className="text-2xl font-bold text-primary mb-2">R$ 0</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Até 3 anúncios ativos</li>
                <li>✓ 5 fotos por anúncio</li>
                <li>✓ Suporte por email</li>
              </ul>
            </div>

            <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
              <h3 className="font-semibold mb-2">Lojista</h3>
              <p className="text-2xl font-bold text-primary mb-2">R$ 299/mês</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Anúncios ilimitados</li>
                <li>✓ 15 fotos por anúncio</li>
                <li>✓ Selo Vendedor Verificado</li>
                <li>✓ Prioridade nas buscas</li>
                <li>✓ Dashboard com gráficos</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">🛡️ Segurança e Confiança</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Número de chassi obrigatório:</strong> Reduz fraudes e aumenta confiança</li>
            <li><strong>Avaliações:</strong> Veja o histórico do vendedor</li>
            <li><strong>Selo Verificado:</strong> Vendedores com plano Lojista</li>
            <li><strong>Denúncias:</strong> Reporte anúncios suspeitos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">❓ Dúvidas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">O BaitaBriq vende as máquinas?</h3>
              <p className="text-sm text-muted-foreground">
                Não. Somos apenas um intermediador. A negociação é direta entre comprador e vendedor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Vocês fazem vistoria das máquinas?</h3>
              <p className="text-sm text-muted-foreground">
                Não. É responsabilidade do comprador inspecionar a máquina antes de comprar.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Como funciona o pagamento?</h3>
              <p className="text-sm text-muted-foreground">
                O pagamento da máquina é combinado diretamente entre comprador e vendedor. 
                Cobramos apenas a assinatura do plano Lojista (R$ 299/mês).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Posso cancelar minha assinatura?</h3>
              <p className="text-sm text-muted-foreground">
                Sim, a qualquer momento. O cancelamento vale a partir do próximo ciclo.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary/10 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">📞 Precisa de Ajuda?</h2>
          <p className="text-muted-foreground mb-2">
            Email: <strong>contato@baitabriq.com.br</strong>
          </p>
          <p className="text-muted-foreground">
            WhatsApp: <strong>(51) 99999-9999</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
