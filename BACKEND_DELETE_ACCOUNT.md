# Backend - Exclusão de Conta

## Endpoints Necessários

### 1. POST /auth/request-delete
Solicita exclusão de conta (envia email com token)

**Request:**
```json
{
  "password": "senha123"
}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "message": "Email de confirmação enviado"
}
```

**Response Error (401):**
```json
{
  "message": "Senha incorreta"
}
```

**Lógica:**
1. Validar senha do usuário
2. Gerar token único (UUID ou JWT com expiração de 24h)
3. Salvar token no banco: `delete_tokens` table
4. Enviar email com link: `https://seusite.com/confirm-delete?token={token}`
5. Retornar sucesso

---

### 2. POST /auth/confirm-delete
Confirma exclusão via token do email

**Request:**
```json
{
  "token": "abc123xyz"
}
```

**Response Success (200):**
```json
{
  "message": "Conta marcada para exclusão"
}
```

**Response Error (400):**
```json
{
  "message": "Token inválido ou expirado"
}
```

**Lógica:**
1. Validar token (existe e não expirou)
2. Fazer SOFT DELETE do usuário:
   - `users.deleted_at = NOW()`
   - `users.status = 'DELETED'`
3. Invalidar todas as sessões do usuário
4. Deletar token usado
5. Enviar email de confirmação
6. Retornar sucesso

---

## Estrutura do Banco de Dados

### Tabela: delete_tokens
```sql
CREATE TABLE delete_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_token (token),
  INDEX idx_expires (expires_at)
);
```

### Tabela: users (adicionar campos)
```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';
-- status: 'ACTIVE', 'DELETED', 'SUSPENDED'
```

---

## Email Templates

### Email 1: Confirmação de Exclusão
**Assunto:** Confirme a exclusão da sua conta - EquipRent

**Corpo:**
```html
Olá {nome},

Recebemos uma solicitação para excluir sua conta no EquipRent.

⚠️ ATENÇÃO: Esta ação é irreversível!

O que será excluído:
• Seus equipamentos cadastrados
• Suas propostas e negociações
• Seu histórico de avaliações
• Todos os dados da sua conta

Para confirmar a exclusão, clique no link abaixo:
{link_confirmacao}

Este link expira em 24 horas.

Se você não solicitou esta exclusão, ignore este email e sua conta permanecerá ativa.

Após a confirmação, você terá 30 dias para recuperar sua conta entrando em contato com o suporte.

Atenciosamente,
Equipe EquipRent
```

### Email 2: Exclusão Confirmada
**Assunto:** Sua conta foi marcada para exclusão - EquipRent

**Corpo:**
```html
Olá {nome},

Sua conta foi marcada para exclusão e será removida permanentemente em 30 dias.

Data de exclusão definitiva: {data_exclusao}

Para recuperar sua conta antes desta data, entre em contato:
Email: suporte@equiprent.com
WhatsApp: (51) 99999-9999

Sentiremos sua falta!

Equipe EquipRent
```

---

## Cron Job / Scheduled Task

### Hard Delete (executar diariamente)
```javascript
// Exemplo em Node.js
async function deleteExpiredAccounts() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Buscar contas marcadas há mais de 30 dias
  const usersToDelete = await db.users.findMany({
    where: {
      deleted_at: {
        lte: thirtyDaysAgo
      },
      status: 'DELETED'
    }
  });

  for (const user of usersToDelete) {
    // 1. Deletar dados relacionados
    await db.machines.deleteMany({ where: { owner_id: user.id } });
    await db.proposals.deleteMany({ where: { user_id: user.id } });
    await db.reviews.deleteMany({ where: { user_id: user.id } });
    await db.favorites.deleteMany({ where: { user_id: user.id } });
    
    // 2. Deletar usuário
    await db.users.delete({ where: { id: user.id } });
    
    console.log(`Conta ${user.email} excluída permanentemente`);
  }
}

// Agendar para rodar todo dia às 3h da manhã
cron.schedule('0 3 * * *', deleteExpiredAccounts);
```

---

## Segurança

### Validações Importantes:
1. ✅ Verificar senha antes de enviar email
2. ✅ Token com expiração de 24h
3. ✅ Token de uso único (deletar após uso)
4. ✅ Invalidar todas as sessões após confirmação
5. ✅ Soft delete (período de graça de 30 dias)
6. ✅ Log de auditoria (quem deletou, quando)

### Rate Limiting:
```javascript
// Limitar tentativas de exclusão
// Máximo 3 solicitações por hora por usuário
app.post('/auth/request-delete', 
  rateLimit({ max: 3, windowMs: 60 * 60 * 1000 }),
  async (req, res) => {
    // ...
  }
);
```

---

## Conformidade LGPD

### Dados que DEVEM ser excluídos:
- ✅ Dados pessoais (nome, email, telefone)
- ✅ Dados de autenticação (senha hash)
- ✅ Conteúdo gerado (equipamentos, propostas)
- ✅ Histórico de atividades

### Dados que PODEM ser mantidos (anonimizados):
- ✅ Estatísticas agregadas (sem identificação)
- ✅ Logs de auditoria (com user_id anonimizado)
- ✅ Dados financeiros (obrigação legal - 5 anos)

---

## Exemplo Completo (Node.js + Express + Prisma)

```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../services/email');
const { authenticateToken } = require('../middleware/auth');

router.post('/request-delete', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    // 1. Buscar usuário
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // 2. Validar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // 3. Gerar token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 4. Salvar token
    await prisma.deleteToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    // 5. Enviar email
    const confirmLink = `${process.env.FRONTEND_URL}/confirm-delete?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Confirme a exclusão da sua conta',
      html: `<p>Clique no link para confirmar: <a href="${confirmLink}">Confirmar Exclusão</a></p>`
    });

    res.json({ message: 'Email de confirmação enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

router.post('/confirm-delete', async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Validar token
    const deleteToken = await prisma.deleteToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!deleteToken || deleteToken.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    // 2. Soft delete do usuário
    await prisma.user.update({
      where: { id: deleteToken.userId },
      data: {
        deletedAt: new Date(),
        status: 'DELETED'
      }
    });

    // 3. Invalidar sessões (deletar refresh tokens)
    await prisma.refreshToken.deleteMany({
      where: { userId: deleteToken.userId }
    });

    // 4. Deletar token usado
    await prisma.deleteToken.delete({ where: { id: deleteToken.id } });

    // 5. Enviar email de confirmação
    await sendEmail({
      to: deleteToken.user.email,
      subject: 'Sua conta foi marcada para exclusão',
      html: '<p>Sua conta será excluída em 30 dias.</p>'
    });

    res.json({ message: 'Conta marcada para exclusão' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar exclusão' });
  }
});

module.exports = router;
```

---

## Checklist de Implementação

### Backend:
- [ ] Criar tabela `delete_tokens`
- [ ] Adicionar campos `deleted_at` e `status` em `users`
- [ ] Implementar endpoint `POST /auth/request-delete`
- [ ] Implementar endpoint `POST /auth/confirm-delete`
- [ ] Configurar envio de emails
- [ ] Criar templates de email
- [ ] Implementar cron job para hard delete
- [ ] Adicionar rate limiting
- [ ] Adicionar logs de auditoria
- [ ] Testar fluxo completo

### Frontend (✅ Implementado):
- [x] Criar modal de confirmação com senha
- [x] Criar página de confirmação via token
- [x] Adicionar botão no perfil
- [x] Adicionar validação de formulário
- [x] Adicionar feedback visual

---

## Testes Recomendados

1. ✅ Solicitar exclusão com senha correta
2. ✅ Solicitar exclusão com senha incorreta
3. ✅ Confirmar exclusão com token válido
4. ✅ Confirmar exclusão com token expirado
5. ✅ Confirmar exclusão com token inválido
6. ✅ Verificar soft delete no banco
7. ✅ Verificar hard delete após 30 dias
8. ✅ Verificar envio de emails
9. ✅ Verificar invalidação de sessões
10. ✅ Verificar rate limiting
