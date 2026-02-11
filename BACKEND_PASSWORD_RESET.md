# Backend - Recuperação de Senha

## Endpoints Necessários

### 1. POST /api/auth/forgot-password
Solicita recuperação de senha e envia email com token.

**Request:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Email de recuperação enviado com sucesso"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Email não encontrado"
}
```

**Lógica do Backend:**
1. Verificar se email existe no banco
2. Gerar token único (UUID ou JWT com expiração de 1h)
3. Salvar token no banco associado ao usuário com timestamp de expiração
4. Enviar email com link: `https://seusite.com/reset-password?token={TOKEN}`
5. Retornar sucesso (mesmo se email não existir - segurança)

---

### 2. POST /api/auth/reset-password
Redefine a senha usando o token recebido por email.

**Request:**
```json
{
  "token": "abc123-token-uuid",
  "password": "novaSenha123"
}
```

**Response (200 OK):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Token inválido ou expirado"
}
```

**Lógica do Backend:**
1. Validar token no banco
2. Verificar se token não expirou (< 1 hora)
3. Hash da nova senha (bcrypt, argon2, etc)
4. Atualizar senha do usuário
5. Invalidar/deletar o token usado
6. Retornar sucesso

---

## Estrutura do Banco de Dados

### Tabela: password_reset_tokens
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP NULL
);

-- Índice para busca rápida
CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_expires ON password_reset_tokens(expires_at);
```

---

## Exemplo de Implementação (Node.js/Express)

### Controller: authController.js

```javascript
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../services/emailService');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    
    // Sempre retornar sucesso (segurança)
    if (!user) {
      return res.json({ message: 'Email de recuperação enviado com sucesso' });
    }
    
    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora
    
    // Salvar token no banco
    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt
    });
    
    // Enviar email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'Recuperação de Senha - EquipRent',
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou, ignore este email.</p>
      `
    });
    
    res.json({ message: 'Email de recuperação enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao solicitar recuperação:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Buscar token válido
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        expiresAt: { $gt: new Date() },
        usedAt: null
      },
      include: [{ model: User }]
    });
    
    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Atualizar senha do usuário
    await User.update(
      { password: hashedPassword },
      { where: { id: resetToken.userId } }
    );
    
    // Marcar token como usado
    await resetToken.update({ usedAt: new Date() });
    
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
};
```

### Routes: authRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
```

---

## Exemplo Python/Django

### views.py

```python
from django.core.mail import send_mail
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import secrets
from datetime import timedelta
from .models import User, PasswordResetToken

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    
    try:
        user = User.objects.get(email=email)
        
        # Gerar token
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=1)
        
        # Salvar token
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # Enviar email
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        send_mail(
            'Recuperação de Senha - EquipRent',
            f'Clique no link para redefinir sua senha: {reset_link}',
            'noreply@equiprent.com',
            [email],
            fail_silently=False,
        )
    except User.DoesNotExist:
        pass  # Não revelar se email existe
    
    return Response({'message': 'Email de recuperação enviado com sucesso'})

@api_view(['POST'])
def reset_password(request):
    token = request.data.get('token')
    password = request.data.get('password')
    
    try:
        reset_token = PasswordResetToken.objects.get(
            token=token,
            expires_at__gt=timezone.now(),
            used_at__isnull=True
        )
        
        # Atualizar senha
        user = reset_token.user
        user.password = make_password(password)
        user.save()
        
        # Marcar token como usado
        reset_token.used_at = timezone.now()
        reset_token.save()
        
        return Response({'message': 'Senha alterada com sucesso'})
    except PasswordResetToken.DoesNotExist:
        return Response(
            {'error': 'Token inválido ou expirado'},
            status=status.HTTP_400_BAD_REQUEST
        )
```

### models.py

```python
from django.db import models
from django.contrib.auth.models import User

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'password_reset_tokens'
```

---

## Configuração de Email

### Opção 1: Gmail (Desenvolvimento)

```javascript
// Node.js - nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // App Password
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};
```

### Opção 2: AWS SES (Produção)

```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.sendEmail = async ({ to, subject, html }) => {
  const params = {
    Source: 'noreply@equiprent.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } }
    }
  };
  
  await ses.sendEmail(params).promise();
};
```

### Opção 3: SendGrid

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
  await sgMail.send({
    to,
    from: 'noreply@equiprent.com',
    subject,
    html
  });
};
```

---

## Variáveis de Ambiente (.env)

```bash
# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (escolha uma opção)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app

# OU SendGrid
SENDGRID_API_KEY=SG.xxxxx

# OU AWS SES
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
```

---

## Segurança - Boas Práticas

1. ✅ **Token único e aleatório** (32+ bytes)
2. ✅ **Expiração curta** (1 hora máximo)
3. ✅ **Token de uso único** (marcar como usado)
4. ✅ **Não revelar se email existe** (sempre retornar sucesso)
5. ✅ **Rate limiting** (máximo 3 tentativas por hora)
6. ✅ **HTTPS obrigatório** em produção
7. ✅ **Hash de senha forte** (bcrypt, argon2)
8. ✅ **Limpar tokens expirados** (cron job diário)

---

## Limpeza de Tokens Expirados (Cron Job)

```javascript
// Node.js - executar diariamente
const cron = require('node-cron');

// Todo dia às 3h da manhã
cron.schedule('0 3 * * *', async () => {
  await PasswordResetToken.destroy({
    where: {
      expiresAt: { $lt: new Date() }
    }
  });
  console.log('Tokens expirados removidos');
});
```

```python
# Django - management/commands/cleanup_tokens.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from myapp.models import PasswordResetToken

class Command(BaseCommand):
    def handle(self, *args, **options):
        PasswordResetToken.objects.filter(
            expires_at__lt=timezone.now()
        ).delete()
        self.stdout.write('Tokens expirados removidos')
```

---

## Testando a Integração

1. Configure `NEXT_PUBLIC_USE_MOCK=false` no `.env.local`
2. Configure `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
3. Inicie o backend
4. Teste o fluxo completo no frontend

**Endpoints esperados pelo frontend:**
- `POST /api/auth/forgot-password` → { email }
- `POST /api/auth/reset-password` → { token, password }
