# Webhook Mercado Pago - Configuração

## ✅ Webhook Implementado

O webhook está em: `/app/api/webhooks/mercadopago/route.ts`

## 🔧 Como Configurar no Mercado Pago

### 1. Acesse o painel:
https://www.mercadopago.com.br/developers

### 2. Vá em:
**Suas integrações > Mercado Maquina > Webhooks**

### 3. Configure:

**URL de produção:**
```
https://seudominio.com/api/webhooks/mercadopago
```

**URL de teste (local):**
Para testar localmente, use **ngrok** ou **localtunnel**:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3001
ngrok http 3001

# Copiar URL gerada (ex: https://abc123.ngrok.io)
# Adicionar no Mercado Pago: https://abc123.ngrok.io/api/webhooks/mercadopago
```

**Eventos para escutar:**
- ✅ `payment` (pagamento criado/atualizado)
- ✅ `merchant_order` (pedido criado/atualizado)

### 4. Salvar

## 🧪 Como Testar

### Opção 1: Usar ngrok (recomendado)

```bash
# Terminal 1: Rodar Next.js
npm run dev

# Terminal 2: Expor com ngrok
ngrok http 3001

# Copiar URL do ngrok e configurar no Mercado Pago
```

### Opção 2: Simular webhook manualmente

```bash
curl -X POST http://localhost:3001/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "123456789"
    }
  }'
```

## 📊 O que o Webhook Faz

1. **Recebe notificação** do Mercado Pago
2. **Busca detalhes** do pagamento
3. **Verifica status** (approved, rejected, pending)
4. **Extrai userId e planType** do `external_reference`
5. **Atualiza banco de dados** (TODO: implementar)

## 🔐 Segurança (TODO)

Para produção, adicione validação de assinatura:

```typescript
const signature = request.headers.get('x-signature');
const requestId = request.headers.get('x-request-id');

// Validar assinatura do Mercado Pago
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
```

## 📝 Próximos Passos

1. ✅ Webhook criado
2. ⏳ Configurar URL no Mercado Pago
3. ⏳ Implementar atualização no banco de dados
4. ⏳ Adicionar validação de assinatura
5. ⏳ Testar com pagamento real

## 🐛 Logs

O webhook loga tudo no console. Veja os logs em:
- **Local:** Terminal onde o Next.js está rodando
- **Produção:** Vercel/Railway logs

---

**Status:** ✅ Implementado (falta conectar com banco de dados)
