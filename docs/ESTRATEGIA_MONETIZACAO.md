# BaitaBriq — Estratégia de Monetização e Planos

**Documento de Planejamento Estratégico**
**Data:** Junho 2025
**Versão:** 1.0

---

## 1. Modelo de Negócio

### Decisão: Cobrança fixa por plano (sem comissão)

**Por que não comissão?**
- Somos marketplace de **venda** de máquinas, não aluguel
- Máquinas de alto valor (R$ 200k - R$ 2M+) — comissão seria muito cara pro vendedor
- Risco de bypass: vendedor e comprador fechariam fora da plataforma
- Plano fixo = receita previsível e sustentável

**Vantagens do modelo fixo:**
- Previsibilidade total de receita
- Impossível "trabalhar de graça"
- Escalabilidade linear (mais usuários = mais receita)
- Upsell natural quando atingir limites

---

## 2. Estrutura de Planos

### Plano Gratuito — R$ 0/mês

**Público:** Quem quer testar a plataforma

| Recurso                    | Limite             |
|:---------------------------|:-------------------|
| Anúncios ativos            | 2                  |
| Fotos por anúncio          | 3                  |
| Vídeo                      | ❌                 |
| Duração do anúncio         | 30 dias (expira)   |
| Anúncios Premium           | ❌                 |
| Anúncios Destaque          | ❌                 |
| Analytics                  | ❌                 |
| Badge                      | ❌                 |
| Suporte                    | Email (48h)        |

---

### Plano Básico — R$ 89/mês

**Público:** Pessoa física que vende 1-3 máquinas por ano

| Recurso                    | Limite                              |
|:---------------------------|:------------------------------------|
| Anúncios ativos            | 8                                   |
| Fotos por anúncio          | 8                                   |
| Vídeo                      | ❌                                  |
| Duração do anúncio         | Ativo enquanto o plano estiver pago |
| Anúncios Premium           | ❌                                  |
| Anúncios Destaque          | ❌                                  |
| Analytics                  | Básico (views + cliques WhatsApp)   |
| Badge                      | "Anunciante"                        |
| Suporte                    | Email (24h)                         |

**Justificativa do preço:** R$ 89 é 0.01% de uma máquina de R$ 800k. Se vender UMA máquina, o plano se pagou por anos.

---

### Plano Profissional — R$ 179/mês ⭐ Mais Popular

**Público:** Pequenas lojas/revendas com estoque de 5-15 máquinas

| Recurso                    | Limite                                                    |
|:---------------------------|:----------------------------------------------------------|
| Anúncios ativos            | 20                                                        |
| Fotos por anúncio          | 15                                                        |
| Vídeo                      | 1 por anúncio                                             |
| Duração do anúncio         | Ativo enquanto o plano estiver pago                       |
| Anúncios Premium           | 3 simultâneos                                             |
| Anúncios Destaque          | 2 simultâneos                                             |
| Analytics                  | Completo (views + cliques + leads + gráficos + insights)  |
| Badge                      | "Vendedor Verificado"                                     |
| Prioridade nos resultados  | ✅                                                        |
| Suporte                    | WhatsApp (12h)                                            |

---

### Plano Premium — R$ 349/mês

**Público:** Concessionárias e grandes revendas

| Recurso                        | Limite                              |
|:-------------------------------|:------------------------------------|
| Anúncios ativos                | 50                                  |
| Fotos por anúncio              | 25                                  |
| Vídeo                          | 3 por anúncio                       |
| Duração do anúncio             | Ativo enquanto o plano estiver pago |
| Anúncios Premium               | 8 simultâneos                       |
| Anúncios Destaque              | 5 simultâneos                       |
| Analytics                      | Premium + relatório de mercado      |
| Badge                          | "Loja Premium"                      |
| Prioridade nos resultados      | ✅ Máxima                           |
| Página da loja personalizada   | ✅                                  |
| Selo de confiança              | ✅                                  |
| Suporte                        | WhatsApp dedicado (4h)              |

---

## 3. Comparativo Geral dos Planos

| Recurso                        | Gratuito           | Básico R$89        | Profissional R$179              | Premium R$349                   |
|:-------------------------------|:-------------------|:-------------------|:--------------------------------|:--------------------------------|
| Anúncios ativos                | 2                  | 8                  | 20                              | 50                              |
| Fotos por anúncio              | 3                  | 8                  | 15                              | 25                              |
| Vídeos por anúncio             | ❌                 | ❌                 | 1                               | 3                               |
| Duração do anúncio             | 30 dias            | Enquanto pago      | Enquanto pago                   | Enquanto pago                   |
| Anúncios Premium               | ❌                 | ❌                 | 3                               | 8                               |
| Anúncios Destaque              | ❌                 | ❌                 | 2                               | 5                               |
| Analytics                      | ❌                 | Básico             | Completo                        | Premium                         |
| Prioridade nos resultados      | ❌                 | ❌                 | ✅                              | ✅ Máxima                       |
| Página da loja                 | ❌                 | ❌                 | ❌                              | ✅                              |
| Badge                          | ❌                 | Anunciante         | Vendedor Verificado             | Loja Premium                    |
| Suporte                        | Email (48h)        | Email (24h)        | WhatsApp (12h)                  | WhatsApp dedicado (4h)          |

---

## 4. Duração dos Anúncios

| Plano                              | Duração                                                |
|:------------------------------------|:-------------------------------------------------------|
| Gratuito                            | 30 dias (expira automaticamente pra forçar upgrade)    |
| Básico / Profissional / Premium     | Ativo enquanto o plano estiver pago                    |

**Quando o plano é cancelado:**
- Anúncios que excedem o limite do Gratuito (2) ficam inativos
- Os 2 mais recentes ficam ativos com expiração de 30 dias
- Usuário volta pro plano Gratuito

---

## 5. Gatilhos de Upgrade

| De → Para                  | O que faz o usuário querer subir                                                  |
|:---------------------------|:----------------------------------------------------------------------------------|
| Free → Básico              | "Seu anúncio expirou em 30 dias e você não sabe quantas pessoas viram"            |
| Básico → Profissional      | "Seus anúncios ficam abaixo dos Premium nos resultados" + sem gráficos            |
| Profissional → Premium     | "Você tem 20 máquinas mas só pode anunciar 20" + sem página da loja               |

---

## 6. Pacotes de Anúncios Extras (Receita Adicional)

Para usuários que atingem o limite do plano e não querem fazer upgrade completo:

| Pacote            | Preço    | Anúncios extras   | Desconto |
|:------------------|:---------|:-------------------|:---------|
| +5 anúncios       | R$ 49    | 5 por 30 dias      | —        |
| +15 anúncios      | R$ 119   | 15 por 30 dias     | 20%      |
| +30 anúncios      | R$ 199   | 30 por 30 dias     | 33%      |

**Exemplo prático:**
- Concessionária no Premium (50 anúncios) precisa de mais 20
- Paga R$ 349 (plano) + R$ 119 (pacote +15) + R$ 49 (pacote +5) = R$ 517/mês
- Ou negocia Plano Enterprise

**Plano Enterprise (80+ máquinas):**
- Sob consulta, preço negociado (R$ 500-1000/mês)
- Account manager dedicado
- API para integração com ERP
- Relatórios customizados

---

## 7. Estratégia de Lançamento (3 Fases)

### Fase 1: Tração Gratuita (Meses 1-6)
- **Tudo gratuito** para todos os usuários
- Foco em volume: 200 vendedores, 800 máquinas, 50 vendas
- Construir cases de sucesso e depoimentos
- Prospecção ativa: concessionárias, cooperativas, feiras

### Fase 2: Transição (Meses 7-12)
- **Early adopters (fundadores):** R$ 89/mês com recursos do Premium
  - Preço congelado por 3 anos
  - Badge exclusivo "Membro Fundador"
  - 74% de desconto vs preço normal do Premium (R$ 349)
- **Novos usuários:** Planos normais com 7 dias grátis do Profissional

### Fase 3: Monetização Completa (Ano 2+)
- Preços finais: R$ 0 / R$ 89 / R$ 179 / R$ 349
- Fundadores mantêm R$ 89 vitalício
- Introduzir pacotes extras e Enterprise

---

## 8. Benefício de Fundador (Early Adopters)

Usuários que se cadastrarem nos primeiros 6 meses:

| Benefício            | Detalhe                              |
|:---------------------|:-------------------------------------|
| Preço                | R$ 89/mês (vs R$ 349 do Premium)    |
| Desconto             | 74% vitalício                        |
| Recursos             | Todos do plano Premium               |
| Preço congelado      | 3 anos sem aumento                   |
| Badge exclusivo      | "Membro Fundador"                    |
| Economia em 3 anos   | R$ 9.360                             |

**Comunicação (Mês 5):**
> "Graças a vocês, provamos que nossa plataforma funciona! Como agradecimento, vocês terão o plano Premium por apenas R$ 89/mês — preço congelado por 3 anos."

---

## 9. Estratégia Financeira — Regra 70-20-10

Do lucro líquido mensal:
- **70%** reinvestir na empresa (marketing, equipe, tecnologia)
- **20%** reserva de emergência
- **10%** retirada dos sócios

---

## 10. Projeções Financeiras (5 Anos)

### Receita e Lucro por Ano

| Ano | Receita Total | Custos     | Lucro Empresa | Lucro por Sócio | Mensal por Sócio |
|:----|:--------------|:-----------|:--------------|:----------------|:-----------------|
| 1   | R$ 90k        | R$ 156k    | -R$ 66k       | -R$ 23k         | -R$ 1.932        |
| 2   | R$ 553k       | R$ 372k    | R$ 181k       | R$ 63k          | R$ 5.278         |
| 3   | R$ 1.420k     | R$ 720k    | R$ 700k       | R$ 245k         | R$ 20.412        |
| 4   | R$ 3.532k     | R$ 1.308k  | R$ 2.224k     | R$ 778k         | R$ 64.862        |
| 5   | R$ 6.220k     | R$ 2.364k  | R$ 3.856k     | R$ 1.350k       | R$ 112.462       |

*Considerando 70% de equity dos sócios (30% investidor anjo)*

### Distribuição de Usuários Pagos (Ano 2)

| Plano          | Usuários | Preço    | Receita Mensal     |
|:---------------|:---------|:---------|:-------------------|
| Fundadores     | 140      | R$ 89    | R$ 12.460          |
| Básico         | 120      | R$ 89    | R$ 10.680          |
| Profissional   | 100      | R$ 179   | R$ 17.900          |
| Premium        | 40       | R$ 349   | R$ 13.960          |
| **Total**      | **400**  | —        | **R$ 55.000/mês**  |

### Marcos Financeiros

| Marco                                        | Quando  |
|:---------------------------------------------|:--------|
| Break-even                                   | Mês 15  |
| Primeiro salário bom (R$ 5k/mês cada)        | Ano 2   |
| Salário executivo (R$ 20k/mês cada)          | Ano 3   |
| Independência financeira (R$ 65k/mês cada)   | Ano 4   |
| Riqueza (R$ 112k/mês cada)                   | Ano 5   |

### Cenários

| Cenário                | Lucro Ano 5 por Sócio | Patrimônio Total |
|:-----------------------|:-----------------------|:-----------------|
| Conservador (-30%)     | R$ 78k/mês             | R$ 13.9M         |
| **Base (provável)**    | **R$ 112k/mês**        | **R$ 19.8M**     |
| Otimista (+40%)        | R$ 157k/mês            | R$ 27.7M         |

### Valor da Empresa (Exit)

| Ano | Valuation (8x receita) | Valor por Sócio (70%) |
|:----|:-----------------------|:----------------------|
| 3   | R$ 11.4M               | R$ 4M                 |
| 5   | R$ 49.8M               | R$ 17.4M              |

---

## 11. Projeções 10 Anos

| Ano | Receita      | Lucro Empresa | Mensal por Sócio |
|:----|:-------------|:--------------|:-----------------|
| 6   | R$ 11.1M     | R$ 7.2M       | R$ 208.810       |
| 7   | R$ 22.2M     | R$ 15.7M      | R$ 458.500       |
| 8   | R$ 39.6M     | R$ 26.9M      | R$ 784.000       |
| 9   | R$ 55.8M     | R$ 37.9M      | R$ 1.106.000     |
| 10  | R$ 100.8M    | R$ 70.2M      | R$ 2.047.000     |

**Valuation Ano 10:** R$ 1.21 BILHÃO (12x receita)
**Patrimônio por sócio:** R$ 481M

---

## 12. Custos Operacionais Estimados

### Ano 1

| Item                                     | Mensal            |
|:-----------------------------------------|:------------------|
| Hosting (Vercel/AWS)                     | R$ 500            |
| Marketing (Google Ads + eventos)         | R$ 3.000          |
| Operacional (contabilidade, jurídico)    | R$ 1.500          |
| Equipe (1 dev + 1 comercial)            | R$ 8.000          |
| **Total**                                | **R$ 13.000/mês** |

### Investimento Inicial Necessário

| Fonte                              | Valor                    |
|:-----------------------------------|:-------------------------|
| Aporte dos sócios                  | R$ 75k (R$ 37.5k cada)  |
| Investidor anjo (30% equity)       | R$ 75k                   |
| **Total**                          | **R$ 150k**              |

---

## 13. Expansão Geográfica

| Período  | Foco                              |
|:---------|:----------------------------------|
| Ano 1    | RS, SC, PR (Sul)                  |
| Ano 2    | MT, MS, GO (Centro-Oeste)         |
| Ano 3+   | SP, MG, BA (Nacional)             |
| Ano 5+   | Argentina, Uruguai (LATAM)        |

---

## 14. Status de Implementação

### ✅ Frontend (Pronto)
- 4 planos com valores e limites corretos
- Página de pricing com cards + tabela comparativa + FAQ
- Limites dinâmicos de fotos/vídeos no formulário
- Dashboard com analytics diferenciado por plano
- Header com badge dinâmico do plano
- Perfil com seção do plano
- Modal de upgrade dinâmico
- Checkout Mercado Pago aceita os 3 planos pagos
- Badge do plano do vendedor no card da máquina
- Página da loja diferenciada (Premium = completa)

### ✅ Backend (Pronto)
- 4 planos na tabela com limites, features e adDuration corretos
- Validação de limite de anúncios, fotos e vídeos por plano na criação/edição
- expiresAt = null para planos pagos (anúncios sem expiração)
- expiresAt = 30 dias para plano free
- Cron job expirando anúncios automaticamente
- activatePlan busca limites direto da tabela Plan (dinâmico)
- Remove expiração das máquinas ao ativar plano pago
- onPlanCancelled com downgrade completo (desativa excedentes, reaplica expiração)
- Webhook de cancelamento de assinatura do Mercado Pago
- Endpoint GET /api/plans retorna tudo pro front renderizar
- Badge/plan do owner exposto nos endpoints de máquinas

---

## 15. Próximos Passos

### Curto Prazo (Próximas semanas)
- [x] Backend atualizar tabela de planos ✅
- [x] Backend implementar lógica de cancelamento ✅
- [x] Testar fluxo completo de pagamento ✅
- [x] Deploy em produção ✅

### Médio Prazo (Meses 1-6)
- [ ] Lançamento soft (tudo gratuito)
- [ ] Prospecção de 200 vendedores
- [ ] 800 máquinas no catálogo
- [ ] 50 vendas facilitadas

### Longo Prazo (Mês 7+)
- [ ] Implementar cobrança (transição fundadores)
- [ ] Pacotes de anúncios extras
- [ ] Upload de vídeo (S3 + compressão)
- [ ] Chat entre usuários
- [ ] Plano Enterprise

---

*Documento gerado com base no planejamento estratégico realizado em Junho/2025.*
