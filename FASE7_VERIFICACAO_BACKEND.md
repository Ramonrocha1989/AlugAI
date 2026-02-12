# 🛡️ FASE 7 - Sistema de Verificação (Backend)

## 🎯 Status Atual
✅ Frontend implementado (mock)
❌ Backend pendente

---

## 📋 Endpoints Necessários

### 1. POST /api/verification/request
**Descrição:** Usuário solicita verificação

**Auth:** 🔒 Sim (Bearer Token)

**Body:**
```json
{
  "documentType": "CPF",
  "documentNumber": "000.000.000-00",
  "companyName": "João Silva",
  "phone": "(54) 99988-7766",
  "email": "joao@email.com",
  "reason": "Sou revendedor há 10 anos"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "status": "PENDING",
  "message": "Solicitação enviada com sucesso"
}
```

**Ações:**
1. Validar se usuário já tem solicitação PENDING
2. Salvar no banco (tabela `verification_requests`)
3. Enviar email para admin@mercadomaquina.com
4. Retornar sucesso

---

### 2. GET /api/admin/verification-requests
**Descrição:** Listar todas as solicitações (admin)

**Auth:** 🔒 Sim (Admin only)

**Query Params:**
- `status`: PENDING | APPROVED | REJECTED (opcional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userName": "João Silva",
      "userEmail": "joao@email.com",
      "documentType": "CPF",
      "documentNumber": "000.000.000-00",
      "companyName": "João Silva",
      "phone": "(54) 99988-7766",
      "reason": "Sou revendedor há 10 anos",
      "status": "PENDING",
      "createdAt": "2025-01-28T10:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 3. POST /api/admin/verification-requests/:id/approve
**Descrição:** Aprovar solicitação (admin)

**Auth:** 🔒 Sim (Admin only)

**Response 200:**
```json
{
  "message": "Vendedor verificado com sucesso"
}
```

**Ações:**
1. Atualizar `verification_requests.status = 'APPROVED'`
2. Atualizar `users.is_verified_seller = true`
3. Atualizar todas as máquinas do usuário: `machines.is_verified_seller = true`
4. Enviar email de confirmação para o vendedor
5. Retornar sucesso

---

### 4. POST /api/admin/verification-requests/:id/reject
**Descrição:** Rejeitar solicitação (admin)

**Auth:** 🔒 Sim (Admin only)

**Body (opcional):**
```json
{
  "reason": "Documentos inválidos"
}
```

**Response 200:**
```json
{
  "message": "Solicitação rejeitada"
}
```

**Ações:**
1. Atualizar `verification_requests.status = 'REJECTED'`
2. Enviar email para o vendedor com motivo
3. Retornar sucesso

---

## 🗄️ Nova Tabela no Banco

```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_type VARCHAR(10) NOT NULL,
  document_number VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_verification_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_status ON verification_requests(status);
```

---

## 📧 Emails a Enviar

### Email 1: Para Admin (nova solicitação)
```
Assunto: Nova Solicitação de Verificação

Nova solicitação de verificação recebida:

Nome: João Silva
Email: joao@email.com
Documento: CPF 000.000.000-00
Telefone: (54) 99988-7766
Motivo: Sou revendedor há 10 anos

Acesse o painel admin para aprovar/rejeitar.
```

### Email 2: Para Vendedor (aprovado)
```
Assunto: Parabéns! Você é um Vendedor Verificado

Olá João Silva,

Sua solicitação de verificação foi aprovada! 🎉

Agora você tem o selo "Vendedor Verificado" em todos os seus anúncios.

Benefícios:
✅ Seus anúncios aparecem em destaque
✅ Maior confiança dos compradores
✅ +40% mais visualizações

Acesse seu dashboard: https://mercadomaquina.com/dashboard
```

### Email 3: Para Vendedor (rejeitado)
```
Assunto: Solicitação de Verificação - Pendências

Olá João Silva,

Infelizmente não foi possível aprovar sua solicitação de verificação.

Motivo: Documentos inválidos

Você pode enviar uma nova solicitação após corrigir as pendências.
```

---

## ✅ Validações

### Documento:
- CPF: 11 dígitos
- CNPJ: 14 dígitos
- Validar formato

### Telefone:
- Formato brasileiro: (XX) XXXXX-XXXX

### Email:
- Validar formato válido

### Duplicidade:
- Não permitir múltiplas solicitações PENDING do mesmo usuário
- Retornar erro 400: "Você já tem uma solicitação pendente"

---

## 🔐 Permissões

**Rotas Admin:**
- `/api/admin/*` - Apenas usuários com `role = 'ADMIN'`
- Middleware de autenticação obrigatório
- Retornar 403 se não for admin

---

## 🎯 Prioridade

**Média** - Sistema funciona sem isso (admin atualiza manualmente no banco)

Implementar após ter alguns vendedores usando a plataforma.

---

## 📝 Notas de Implementação

1. Usar serviço de email (SendGrid, AWS SES, Resend)
2. Criar middleware `isAdmin` para proteger rotas
3. Adicionar logs de auditoria (quem aprovou/rejeitou)
4. Considerar adicionar campo `approved_by` e `approved_at`
