export default function PoliticaPrivacidadePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Dados que Coletamos</h2>
          <p className="text-muted-foreground mb-4">Coletamos os seguintes dados:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Cadastro:</strong> Nome da empresa, email, telefone (WhatsApp)</li>
            <li><strong>Anúncios:</strong> Informações das máquinas, fotos, localização</li>
            <li><strong>Uso:</strong> Páginas visitadas, cliques, tempo no site (Google Analytics)</li>
            <li><strong>Pagamento:</strong> Dados processados por Stripe/Mercado Pago (não armazenamos cartões)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Como Usamos seus Dados</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Conectar compradores e vendedores</li>
            <li>Processar pagamentos de assinaturas</li>
            <li>Enviar notificações sobre propostas e mensagens</li>
            <li>Melhorar a experiência do usuário</li>
            <li>Prevenir fraudes e abusos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Dados</h2>
          <p className="text-muted-foreground mb-4">Seus dados são compartilhados apenas com:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Outros usuários:</strong> Nome da empresa, telefone e localização (apenas em anúncios públicos)</li>
            <li><strong>Processadores de pagamento:</strong> Stripe ou Mercado Pago</li>
            <li><strong>Serviços de analytics:</strong> Google Analytics (dados anônimos)</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            <strong>NÃO vendemos seus dados para terceiros.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Seus Direitos (LGPD)</h2>
          <p className="text-muted-foreground mb-4">Você tem direito a:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Acessar:</strong> Ver quais dados temos sobre você</li>
            <li><strong>Corrigir:</strong> Atualizar dados incorretos</li>
            <li><strong>Excluir:</strong> Solicitar remoção de sua conta e dados</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato legível</li>
            <li><strong>Revogar consentimento:</strong> Cancelar permissões a qualquer momento</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Para exercer seus direitos, entre em contato: <strong>privacidade@mercadomaquina.com.br</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Senhas criptografadas (bcrypt)</li>
            <li>Conexão HTTPS (SSL/TLS)</li>
            <li>Tokens JWT com expiração</li>
            <li>Rate limiting contra ataques</li>
            <li>Backups regulares</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
          <p className="text-muted-foreground">
            Usamos cookies para manter você logado e melhorar a experiência. 
            Cookies de terceiros (Google Analytics) podem ser desabilitados nas configurações do navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
          <p className="text-muted-foreground">
            Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, 
            dados são removidos em até 30 dias, exceto quando exigido por lei.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Menores de Idade</h2>
          <p className="text-muted-foreground">
            Nosso serviço é destinado a empresas e maiores de 18 anos. 
            Não coletamos intencionalmente dados de menores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
          <p className="text-muted-foreground">
            Podemos atualizar esta política periodicamente. Mudanças significativas serão notificadas por email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contato - Encarregado de Dados (DPO)</h2>
          <p className="text-muted-foreground">
            Email: <strong>privacidade@mercadomaquina.com.br</strong><br/>
            Resposta em até 15 dias úteis.
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
