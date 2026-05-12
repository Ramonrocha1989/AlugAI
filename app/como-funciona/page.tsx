import { Metadata } from 'next';
import Link from 'next/link';
import { PLANS_CONFIG } from '@/services/machine-api';
import type { Plan } from '@/types';

const DEFAULT_WHATSAPP_E164 = '5553984590461';
const DEFAULT_PHONE_DISPLAY = '(53) 98459-0461';
const SUPPORT_EMAIL = 'contato@baitabriq.com.br';

export const metadata: Metadata = {
  title: 'Como Funciona - BaitaBriq | Marketplace de Máquinas Agrícolas',
  description:
    'Saiba como comprar e vender máquinas agrícolas no BaitaBriq. Planos Gratuito, Básico, Profissional e Premium. Negociação direta; assinaturas via Mercado Pago.',
  keywords: [
    'como funciona BaitaBriq',
    'vender máquinas agrícolas',
    'comprar tratores usados',
    'marketplace máquinas sul brasil',
    'plano básico profissional premium',
    'vendedor verificado',
    'segurança compra máquinas',
    'como vender trator',
    'como comprar colheitadeira',
  ],
  openGraph: {
    title: 'Como Funciona o BaitaBriq - Marketplace de Máquinas Agrícolas',
    description: 'Conectamos vendedores e compradores de máquinas agrícolas no Sul do Brasil',
    type: 'website',
    images: [{ url: '/logo.jpeg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/como-funciona',
  },
};

function formatPlanPrice(plan: Plan) {
  if (plan.price === 0) return 'R$ 0';
  return `R$ ${plan.price}/mês`;
}

function planCardClass(plan: Plan) {
  if (plan.id === 'profissional') {
    return 'border-2 border-primary rounded-lg p-4 bg-primary/5 ring-2 ring-primary/20 relative';
  }
  return 'border rounded-lg p-4';
}

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
                Preencha as informações: fotos, preço, ano, horas de uso, número de chassi. Quanto mais completo,
                mais confiança você passa!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">3️⃣ Receba Propostas no WhatsApp</h3>
              <p className="text-blue-800 text-sm">
                Compradores interessados entram em contato direto pelo seu WhatsApp. Você negocia diretamente, sem
                intermediários na venda da máquina.
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
                Use filtros por categoria, preço, ano, localização e cultura (arroz, soja, milho e outras culturas do
                Sul).
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">2️⃣ Veja Detalhes Completos</h3>
              <p className="text-green-800 text-sm">
                Fotos, especificações técnicas, horas de uso, número de chassi e avaliações na ficha do anúncio.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">3️⃣ Entre em Contato</h3>
              <p className="text-green-800 text-sm">
                Clique em <strong>Falar no WhatsApp</strong> e negocie direto com o vendedor. Tire dúvidas, agende
                visita, faça proposta.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">4️⃣ Inspecione Antes de Comprar</h3>
              <p className="text-green-800 text-sm">
                <strong>IMPORTANTE:</strong> Sempre veja a máquina pessoalmente, teste, verifique documentação e número
                de chassi antes de pagar.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">💎 Planos Disponíveis</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Limites e preços seguem a configuração da plataforma. Os valores das assinaturas pagas são cobrados mensalmente
            via <strong>Mercado Pago</strong>. Para comparar todos os recursos, use a{' '}
            <Link href="/pricing" className="text-primary font-medium hover:underline">
              página de preços
            </Link>
            .
          </p>

          <div className="grid sm:grid-cols-2 gap-4 not-prose">
            {PLANS_CONFIG.map((plan) => (
              <div key={plan.id} className={planCardClass(plan)}>
                {plan.id === 'profissional' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Mais popular
                  </span>
                )}
                <h3 className="font-semibold mb-2 mt-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{formatPlanPrice(plan)}</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {plan.features.slice(0, 5).map((line) => (
                    <li key={line}>✓ {line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">🛡️ Segurança e Confiança</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong>Número de chassi obrigatório:</strong> Reduz fraudes e aumenta confiança
            </li>
            <li>
              <strong>Avaliações:</strong> Feedback registrado na plataforma sobre negócios e anúncios
            </li>
            <li>
              <strong>Badges e selos:</strong> Planos pagos exibem identificação de anunciante ou vendedor verificado,
              conforme o plano
            </li>
            <li>
              <strong>Moderação:</strong> Anúncios podem ser revisados pela equipe para manter a qualidade do marketplace
            </li>
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
                O pagamento da máquina é combinado diretamente entre comprador e vendedor. A plataforma cobra apenas as
                assinaturas dos planos pagos (Básico, Profissional e Premium), processadas pelo Mercado Pago.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Posso cancelar minha assinatura?</h3>
              <p className="text-sm text-muted-foreground">
                Sim, a qualquer momento. O cancelamento vale a partir do próximo ciclo de cobrança.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary/10 p-6 rounded-lg not-prose">
          <h2 className="text-2xl font-semibold mb-4">📞 Precisa de Ajuda?</h2>
          <p className="text-muted-foreground mb-2">
            Email:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p className="text-muted-foreground">
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${DEFAULT_WHATSAPP_E164}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              {DEFAULT_PHONE_DISPLAY}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
