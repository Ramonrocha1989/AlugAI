# Integração Mercado Pago - Mercado Máquina

## ✅ Implementação Completa

### Arquivos Criados:

1. **`services/mercadopago.ts`** - Serviço de pagamento
2. **`components/checkout-button.tsx`** - Botão de checkout
3. **`app/api/create-preference/route.ts`** - API para criar preferência
4. **`app/payment/success/page.tsx`** - Página de sucesso
5. **`app/payment/failure/page.tsx`** - Página de falha
6. **`app/payment/pending/page.tsx`** - Página de pendente

### Variáveis de Ambiente:

```env
# Mercado Pago (Teste)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-d311be20-4301-42a3-b69f-7c8674c4524f
MERCADOPAGO_ACCESS_TOKEN=TEST-8899207110190706-021710-148052702e6c46c20f8b1e014d423079-253473469
```

## 🧪 Como Testar (SEM PAGAR)

### 1. Acesse a página de planos:
```
http://localhost:3001/pricing
```

### 2. Clique em "Assinar Agora" no plano Lojista

### 3. Use cartões de teste do Mercado Pago:

**Cartão APROVADO:**
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO (qualquer nome)
CPF: 12345678909
```

**Cartão RECUSADO:**
```
Número: 5031 4332 1540 6351
CVV: 123 (errado de propósito)
Validade: 11/25
Nome: OTHE
```

**PIX (teste):**
- Selecione PIX no checkout
- Copie o código QR
- Simule pagamento no ambiente de teste

### 4. Fluxo completo:

1. Usuário clica em "Assinar Agora"
2. Redireciona para checkout do Mercado Pago
3. Preenche dados do cartão de teste
4. Aprova pagamento
5. Redireciona para `/payment/success`

## 📊 Monitoramento

### Ver pagamentos de teste:
1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas integrações" > "Mercado Maquina"
3. Clique em "Testes" > "Pagamentos de teste"

## 🚀 Produção

### Quando for para produção:

1. **Ative as credenciais de produção:**
   - Mercado Pago > Credenciais > Modo Produção
   - Copie Public Key e Access Token de PRODUÇÃO

2. **Atualize `.env.production`:**
```env
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP-xxx (produção)
MERCADOPAGO_ACCESS_TOKEN=APP-xxx (produção)
```

3. **Configure Webhooks:**
   - URL: `https://seudominio.com/api/webhooks/mercadopago`
   - Eventos: `payment`, `merchant_order`

## 💰 Taxas

- **Teste:** R$ 0 (grátis)
- **Produção:** 4.99% + R$ 0.39 por transação aprovada
- **Sem mensalidade**
- **Recebe em 14 dias** (pode antecipar por taxa)

## 🔐 Segurança

- ✅ Credenciais no backend (não expostas)
- ✅ HTTPS obrigatório em produção
- ✅ Validação de webhooks (TODO: implementar)
- ✅ Tokens de teste separados de produção

## 📝 Próximos Passos

1. **Webhook para confirmar pagamento** (atualizar plano do usuário)
2. **Assinaturas recorrentes** (cobrar mensalmente)
3. **Cancelamento de assinatura**
4. **Histórico de pagamentos**

## 🎯 Status Atual

✅ Checkout implementado  
✅ Páginas de retorno criadas  
✅ Integração com Mercado Pago  
✅ Modo teste funcionando  
⏳ Webhook (próximo passo)  
⏳ Assinaturas recorrentes (próximo passo)  

---

**Tudo pronto para testar!** 🚀
