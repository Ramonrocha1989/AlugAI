# 🔧 Correção: "invalid csrf token"

## ❌ Problema
```
ForbiddenError: invalid csrf token
```

Esse erro acontecia porque:
1. CSRF tokens expiram rapidamente por segurança
2. Token não estava sendo renovado quando expirava
3. Múltiplas requisições simultâneas criavam conflito

## ✅ Solução Implementada

### 1. Cache Inteligente de Token
```typescript
// lib/api.ts
let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

// Reutiliza token em cache se válido
// Evita múltiplas requisições simultâneas
```

### 2. Retry Automático
```typescript
// Se receber 403 (token inválido):
if (response.status === 403) {
  csrfToken = null; // Limpar token inválido
  const newToken = await getCsrfToken(); // Buscar novo
  // Tentar novamente com novo token
}
```

### 3. Pré-carregamento
```typescript
// components/csrf-initializer.tsx
// Busca token ao carregar a aplicação
useEffect(() => {
  fetch('/auth/csrf-token', { credentials: 'include' });
}, []);
```

## 🧪 Testar Novamente

```bash
# 1. Reiniciar frontend
npm run dev

# 2. Testar no navegador
# Abra: http://localhost:3001/login
# Faça login normalmente

# 3. Executar testes
./test-security.sh
```

## 🎯 Comportamento Esperado

### Login
1. Aplicação carrega → busca CSRF token
2. Usuário faz login → usa token em cache
3. Se token expirou → busca novo automaticamente
4. Login bem-sucedido → cookie httpOnly definido

### Criar Máquina
1. Usuário preenche formulário
2. Ao enviar → usa token em cache
3. Se 403 → busca novo token e tenta novamente
4. Sucesso → máquina criada

## 🔍 Debug

Se ainda der erro, verifique:

### Backend
```typescript
// main.ts - CSRF deve estar DEPOIS de cookieParser
app.use(cookieParser());
app.use(csurf({ cookie: true }));
```

### Frontend
```typescript
// Verificar se token está sendo enviado
// DevTools → Network → Headers
X-CSRF-Token: xxxxx
Cookie: token=xxxxx; _csrf=xxxxx
```

### Console do Navegador
```javascript
// Verificar se token está sendo obtido
localStorage.clear(); // Limpar cache
location.reload(); // Recarregar
// Fazer login novamente
```

## 📊 Melhorias Implementadas

| Antes | Depois |
|-------|--------|
| ❌ Token expirava sem renovar | ✅ Renova automaticamente |
| ❌ Múltiplas requisições simultâneas | ✅ Reutiliza promise |
| ❌ Erro 403 quebrava fluxo | ✅ Retry automático |
| ❌ Token buscado sob demanda | ✅ Pré-carregado |

## ✅ Resultado

- Token CSRF gerenciado automaticamente
- Retry transparente em caso de expiração
- Melhor experiência do usuário
- Sem erros 403 inesperados
