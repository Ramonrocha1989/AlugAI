# 🚨 AÇÃO NECESSÁRIA: Corrigir Backend

## ❌ Problema Confirmado

O backend **AINDA** está retornando dados sensíveis no login:

```json
{
  "phone": "5553984590461",           // ❌ EXPOSTO
  "company": {
    "document": "DOC-1770836910477"   // ❌ EXPOSTO
  }
}
```

## ✅ Solução: 3 Passos Simples

### Passo 1: Editar `src/auth/auth.controller.ts`

Localizar o método `login` e **REMOVER** estas linhas:

```typescript
// ❌ REMOVER ESTA LINHA:
phone: result.user.phone,

// ❌ REMOVER ESTA LINHA:
document: result.user.company.document,
```

**Código correto:**

```typescript
return {
  user: {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    // phone: result.user.phone,  ❌ REMOVER
    role: result.user.role,
    plan: result.user.plan,
    planExpiresAt: result.user.planExpiresAt,
    maxAds: result.user.maxAds,
    maxPremiumAds: result.user.maxPremiumAds,
    maxFeaturedAds: result.user.maxFeaturedAds,
    isVerifiedSeller: result.user.isVerifiedSeller,
    emailVerified: result.user.emailVerified,
    company: {
      id: result.user.company.id,
      name: result.user.company.name,
      // document: result.user.company.document,  ❌ REMOVER
    },
    usage: result.user.usage,
  },
};
```

### Passo 2: Fazer o mesmo no método `register`

Aplicar a mesma correção no método `register` do mesmo arquivo.

### Passo 3: Criar endpoint `/auth/me` (opcional mas recomendado)

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
async getMe(@Request() req) {
  const user = await this.authService.findById(req.user.id);
  
  // Aqui pode retornar TUDO (incluindo sensíveis)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,  // ✅ OK aqui
    role: user.role,
    plan: user.plan,
    company: {
      id: user.company.id,
      name: user.company.name,
      document: user.company.document,  // ✅ OK aqui
    },
    // ... resto dos dados
  };
}
```

## 🧪 Como Testar

### Opção 1: Script automático

```bash
./test-security-data.sh
```

### Opção 2: Manual

1. Limpar localStorage:
```javascript
localStorage.clear()
```

2. Fazer login novamente

3. Verificar localStorage:
```javascript
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Phone:', user.phone);  // Deve ser undefined
console.log('Document:', user.company.document);  // Deve ser undefined
```

## ✅ Resultado Esperado

Após a correção, o localStorage deve conter:

```json
{
  "id": "...",
  "name": "ramonrocha1989",
  "email": "ramonrocha1989@gmail.com",
  "role": "ADMIN",
  "plan": "lojista",
  "company": {
    "id": "...",
    "name": "pessoal"
    // ✅ SEM "document"
  }
  // ✅ SEM "phone"
}
```

## 📚 Arquivos de Referência

- `CORRECAO-BACKEND-URGENTE.md` - Detalhes completos da correção
- `test-security-data.sh` - Script de teste automático
- `CHECKLIST-VERIFICACAO-SEGURANCA.md` - Checklist completo

## 🎯 Prioridade

**ALTA** - Esta correção é essencial para:
- ✅ Compliance com LGPD
- ✅ Segurança contra XSS
- ✅ Proteção de dados pessoais

## ⏱️ Tempo Estimado

- **5 minutos** para aplicar a correção
- **2 minutos** para testar

## 🚀 Próximos Passos

1. [ ] Aplicar correção no backend
2. [ ] Reiniciar servidor backend
3. [ ] Limpar localStorage no navegador
4. [ ] Fazer login novamente
5. [ ] Verificar que dados sensíveis não aparecem
6. [ ] ✅ Pronto!
