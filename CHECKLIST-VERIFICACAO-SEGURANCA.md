# ✅ Checklist de Verificação - Segurança de Dados

## 🔍 Como verificar se está tudo correto

### 1. Testar Login

```bash
# 1. Abrir o navegador em modo anônimo
# 2. Fazer login no sistema
# 3. Abrir DevTools (F12) > Application > Local Storage
# 4. Verificar o conteúdo de 'currentUser'
```

**✅ Deve conter:**
- `id`
- `name`
- `email`
- `role`
- `plan`
- `company.id`
- `company.name`
- `usage`

**❌ NÃO deve conter:**
- `token`
- `phone`
- `company.document`

### 2. Verificar Cookies

```bash
# DevTools (F12) > Application > Cookies
```

**✅ Deve ter:**
- Cookie `token` com:
  - `HttpOnly: true`
  - `Secure: true` (em produção)
  - `SameSite: Lax`

### 3. Testar API /auth/me

```bash
# DevTools (F12) > Console
fetch('http://localhost:3000/api/auth/me', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

**✅ Deve retornar:**
- Dados do usuário (não sensíveis)
- Status 200

**❌ NÃO deve retornar:**
- `phone`
- `company.document`

### 4. Testar API /auth/profile (se implementada)

```bash
# DevTools (F12) > Console
fetch('http://localhost:3000/api/auth/profile', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

**✅ Deve retornar:**
- Todos os dados do usuário
- Incluindo `phone` e `company.document`
- Status 200

### 5. Verificar Componentes

```bash
# Buscar uso de campos removidos
grep -r "user.token" --include="*.tsx" --include="*.ts" app/ components/
grep -r "user.phone" --include="*.tsx" --include="*.ts" app/ components/
grep -r "user.companyName" --include="*.tsx" --include="*.ts" app/ components/
```

**✅ Resultado esperado:**
- Nenhum resultado ou apenas em comentários

### 6. Testar Logout

```bash
# 1. Fazer logout
# 2. Verificar Local Storage (deve estar vazio)
# 3. Verificar Cookies (token deve ser removido)
# 4. Tentar acessar /dashboard (deve redirecionar para /login)
```

## 🧪 Testes Manuais

### Teste 1: Login e Verificação
- [ ] Fazer login
- [ ] Abrir DevTools > Application > Local Storage
- [ ] Verificar que não há `token`, `phone` ou `document`
- [ ] Verificar que há cookie `token` com `HttpOnly`

### Teste 2: Navegação
- [ ] Navegar para Dashboard
- [ ] Verificar que nome da empresa aparece corretamente
- [ ] Verificar que não há erros no console

### Teste 3: Logout
- [ ] Fazer logout
- [ ] Verificar que localStorage foi limpo
- [ ] Verificar que cookie foi removido
- [ ] Tentar acessar /dashboard (deve redirecionar)

### Teste 4: Registro
- [ ] Fazer novo cadastro
- [ ] Verificar que dados salvos no localStorage são seguros
- [ ] Verificar que não há dados sensíveis

## 🔒 Checklist de Segurança

### Backend
- [x] Endpoint `/auth/login` retorna apenas dados não sensíveis
- [x] Token enviado em cookie httpOnly
- [x] Cookie com flags de segurança (HttpOnly, Secure, SameSite)
- [ ] Endpoint `/auth/me` implementado (retorna dados básicos)
- [ ] Endpoint `/auth/profile` implementado (retorna dados completos)

### Frontend
- [x] Interface `User` atualizada (sem campos sensíveis)
- [x] Interface `UserProfile` criada (com campos sensíveis)
- [x] `authService.login()` não salva dados sensíveis
- [x] `authService.register()` não salva dados sensíveis
- [x] `authService.getMe()` implementado
- [x] `authService.getProfile()` implementado
- [x] Componentes não acessam `user.token`
- [x] Componentes não acessam `user.phone` diretamente
- [x] Componentes usam `user.company.name` ou `user.name`

### Testes
- [ ] Login funciona corretamente
- [ ] Logout funciona corretamente
- [ ] Registro funciona corretamente
- [ ] localStorage não contém dados sensíveis
- [ ] Cookie httpOnly está presente
- [ ] Navegação funciona sem erros

## 🚨 Problemas Comuns

### Problema: "user.companyName is undefined"
**Solução:** Substituir por `user.company?.name || user.name`

### Problema: "user.token is undefined"
**Solução:** Token agora está em cookie httpOnly, não precisa acessar

### Problema: "user.phone is undefined"
**Solução:** Usar `authService.getProfile()` para buscar dados completos

### Problema: "401 Unauthorized"
**Solução:** Verificar se cookie está sendo enviado (`credentials: 'include'`)

## 📊 Comandos Úteis

```bash
# Buscar uso de campos removidos
grep -r "\.token" --include="*.tsx" --include="*.ts" app/ components/ hooks/
grep -r "\.phone" --include="*.tsx" --include="*.ts" app/ components/ hooks/
grep -r "companyName" --include="*.tsx" --include="*.ts" app/ components/ hooks/

# Verificar estrutura do localStorage
# No console do navegador:
JSON.parse(localStorage.getItem('currentUser'))

# Verificar cookies
# No console do navegador:
document.cookie

# Limpar tudo e testar do zero
localStorage.clear()
# Depois fazer login novamente
```

## ✅ Tudo OK se:

1. ✅ localStorage não contém `token`, `phone` ou `document`
2. ✅ Cookie `token` existe e é `HttpOnly`
3. ✅ Login/Logout funcionam corretamente
4. ✅ Navegação funciona sem erros
5. ✅ Dados do usuário aparecem corretamente na UI
6. ✅ Não há erros no console relacionados a campos undefined

## 🎉 Pronto!

Se todos os itens acima estão OK, a implementação de segurança está completa e funcionando corretamente!
