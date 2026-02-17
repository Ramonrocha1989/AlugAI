export default function TermosDeUsoPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
      
      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Sobre o Mercado Máquina</h2>
          <p className="text-muted-foreground">
            O Mercado Máquina é um marketplace que conecta compradores e vendedores de máquinas agrícolas e de construção. 
            Atuamos como <strong>intermediador</strong>, facilitando o contato entre as partes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Responsabilidades do Vendedor</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Garantir que as informações do anúncio são verdadeiras e precisas</li>
            <li>Possuir a posse legal da máquina anunciada</li>
            <li>Fornecer número de série/chassi correto</li>
            <li>Responder aos interessados de forma profissional</li>
            <li>Cumprir com as condições anunciadas (preço, estado, etc)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Responsabilidades do Comprador</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Inspecionar a máquina presencialmente antes de comprar</li>
            <li>Verificar documentação e procedência</li>
            <li>Negociar diretamente com o vendedor</li>
            <li>Não realizar pagamentos sem garantias adequadas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. O que o Mercado Máquina NÃO faz</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="font-semibold text-yellow-900 mb-2">⚠️ IMPORTANTE:</p>
            <ul className="list-disc pl-6 space-y-2 text-yellow-800">
              <li>NÃO somos proprietários das máquinas anunciadas</li>
              <li>NÃO realizamos vistoria técnica dos equipamentos</li>
              <li>NÃO garantimos o estado mecânico das máquinas</li>
              <li>NÃO intermediamos pagamentos</li>
              <li>NÃO nos responsabilizamos por vícios ocultos</li>
              <li>NÃO garantimos a entrega física</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Anúncios e Planos</h2>
          <p className="text-muted-foreground mb-4">
            <strong>Plano Gratuito:</strong> Até 3 anúncios ativos, 5 fotos por anúncio.
          </p>
          <p className="text-muted-foreground mb-4">
            <strong>Plano Lojista (R$ 299/mês):</strong> Anúncios ilimitados, 15 fotos, selo verificado, prioridade nas buscas.
          </p>
          <p className="text-muted-foreground">
            Anúncios que violem estes termos podem ser removidos sem aviso prévio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Proibições</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Anunciar máquinas roubadas ou com documentação irregular</li>
            <li>Fornecer informações falsas ou enganosas</li>
            <li>Usar o serviço para atividades ilegais</li>
            <li>Copiar anúncios de outros usuários</li>
            <li>Fazer spam ou assédio a outros usuários</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Cancelamento e Reembolso</h2>
          <p className="text-muted-foreground">
            Assinaturas podem ser canceladas a qualquer momento. O cancelamento terá efeito no próximo ciclo de cobrança. 
            Não há reembolso proporcional do período já pago.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
          <p className="text-muted-foreground">
            Dúvidas sobre estes termos: <strong>contato@mercadomaquina.com.br</strong>
          </p>
        </section>

        <div className="bg-muted p-6 rounded-lg mt-8">
          <p className="text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
