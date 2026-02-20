# 🔒 AÇÃO NECESSÁRIA: Remover Dados Sensíveis do Login

## O que fazer:

No endpoint de login, **NÃO retornar** dados sensíveis:

```typescript
// ❌ REMOVER do response de login:
return {
  user: {
    phone: user.phone, // ❌ REMOVER
    company: {
      document: user.company.document, // ❌ REMOVER
    }
  }
};

// ✅ Retornar apenas:
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    // ... outros dados NÃO sensíveis
  }
};
```

## Por quê?

- Dados sensíveis ficam expostos no localStorage do navegador
- Vulnerável a XSS e extensões maliciosas
- Não está em conformidade com LGPD/GDPR

## Solução:

Dados sensíveis devem vir apenas do endpoint `/auth/me` (já existe e está protegido).

Frontend já está preparado para buscar dados sensíveis quando necessário.
