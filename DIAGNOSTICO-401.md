# 🔍 Diagnóstico: Erro 401 após Login

## 🧪 Teste 1: Modo Mock (Frontend isolado)

```bash
# 1. Ativei NEXT_PUBLIC_USE_MOCK=true no .env.local
# 2. Reinicie o frontend:
npm run dev

# 3. Teste o login:
http://localhost:3001/login
# Email: qualquer@email.com
# Senha: 123456

# ✅ Se funcionar: Problema está no BACKEND
# ❌ Se não funcionar: Problema está no FRONTEND
```

## 🔍 Teste 2: Verificar Cookie no Backend

Se o modo mock funcionar, o problema é que o backend não está configurando o cookie corretamente.

### Verificar no Backend (NestJS):

```typescript
// src/auth/auth.controller.ts
@Post('login')
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.login(loginDto);
  
  // IMPORTANTE: Verificar estas configurações
  response.cookie('token', result.token, {
    httpOnly: true,
    secure: false, // ← DEVE SER FALSE em desenvolvimento (HTTP)
    sameSite: 'lax', // ← MUDAR DE 'strict' para 'lax'
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
    domain: undefined, // ← NÃO definir domain em localhost
  });
  
  return { user: result.user };
}
```

### Problema Comum: SameSite=Strict

`sameSite: 'strict'` bloqueia cookies em redirecionamentos!

**Solução:**
```typescript
sameSite: 'lax' // Permite cookies em navegação normal
```

## 🔍 Teste 3: Verificar CORS

```typescript
// src/main.ts
app.enableCors({
  origin: 'http://localhost:3001', // ← URL EXATA do frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
});
```

## 🔍 Teste 4: Verificar Cookie no Navegador

Após fazer login:

1. Abra DevTools (F12)
2. Aba **Application** → **Cookies** → `http://localhost:3001`
3. Procure cookie `token`

**Se cookie NÃO aparecer:**
- Backend não está definindo cookie
- Verificar configurações acima

**Se cookie aparecer:**
- Aba **Network** → Recarregar página
- Clicar em qualquer requisição para `/api/`
- Verificar **Headers** → **Request Headers**
- Deve ter: `Cookie: token=xxxxx`

**Se cookie não for enviado:**
- Problema no `withCredentials` ou `credentials: 'include'`

## ✅ Solução Rápida (Backend)

```typescript
// src/auth/auth.controller.ts
response.cookie('token', result.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false em dev
  sameSite: 'lax', // ← IMPORTANTE: lax, não strict
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});
```

## 🧪 Teste Final

Depois de ajustar o backend:

```bash
# 1. Voltar para modo real
# .env.local: NEXT_PUBLIC_USE_MOCK=false

# 2. Reiniciar frontend
npm run dev

# 3. Limpar tudo
# Console (F12):
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();

# 4. Fazer login novamente
```

## 📊 Checklist Backend

- [ ] `sameSite: 'lax'` (não 'strict')
- [ ] `secure: false` em desenvolvimento
- [ ] `domain` não definido (ou undefined)
- [ ] CORS com `credentials: true`
- [ ] CORS com `origin` correto
- [ ] Cookie definido com `@Res({ passthrough: true })`

## 🎯 Resultado Esperado

1. Login → Cookie definido
2. Redireciona para /dashboard
3. Dashboard faz requisição → Cookie enviado automaticamente
4. Backend valida cookie → Retorna dados
5. Dashboard carrega normalmente
