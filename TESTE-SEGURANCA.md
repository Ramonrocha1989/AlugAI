# 🧪 Guia de Testes de Segurança

## 🚀 Pré-requisitos

1. Backend rodando em `http://localhost:3000`
2. Frontend rodando em `http://localhost:3001`
3. `.env.local` com `NEXT_PUBLIC_USE_MOCK=false`

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## ✅ Teste 1: Cookie httpOnly (Proteção XSS)

### Passo a passo:
1. Abra o navegador em `http://localhost:3001/login`
2. Abra DevTools (F12) → Aba **Application** → **Cookies**
3. Faça login com qualquer email/senha
4. Verifique se apareceu cookie `token` com:
   - ✅ `HttpOnly`: ✓
   - ✅ `Secure`: ✓ (se HTTPS)
   - ✅ `SameSite`: Strict

### Teste de segurança:
```javascript
// No Console do navegador (F12), tente acessar o cookie:
document.cookie
// ❌ Não deve mostrar o token (httpOnly bloqueia JS)
```

**✅ Esperado**: Token não aparece no `document.cookie`

---

## ✅ Teste 2: CSRF Protection

### Passo a passo:
1. Abra DevTools → Aba **Network**
2. Faça login
3. Vá para `/dashboard/new-equipment`
4. Preencha e envie o formulário
5. Verifique a requisição POST `/api/machines`:
   - ✅ Header `X-CSRF-Token` presente
   - ✅ Cookie `token` enviado automaticamente

### Teste de ataque CSRF (deve falhar):
```bash
# Tente criar máquina SEM CSRF token
curl -X POST http://localhost:3000/api/machines \
  -H "Content-Type: application/json" \
  -d '{"name":"Hack","category":"TRATOR"}' \
  --cookie "token=SEU_TOKEN_AQUI"
```

**✅ Esperado**: Erro 403 Forbidden (CSRF token inválido)

---

## ✅ Teste 3: Rate Limiting (Proteção Brute Force)

### Passo a passo:
1. Abra `http://localhost:3001/login`
2. Tente fazer login 6 vezes seguidas com senha errada
3. Na 6ª tentativa, deve aparecer erro de rate limit

### Teste via curl:
```bash
# Fazer 6 requisições de login seguidas
for i in {1..6}; do
  echo "Tentativa $i:"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n\n"
done
```

**✅ Esperado**: 
- Tentativas 1-5: Status 401 (senha errada)
- Tentativa 6: Status 429 (Too Many Requests)

---

## ✅ Teste 4: Logout Seguro

### Passo a passo:
1. Faça login
2. Verifique cookie `token` em DevTools → Application → Cookies
3. Clique em "Sair" no header
4. Verifique que o cookie foi removido
5. Tente acessar `/dashboard` → deve redirecionar para `/login`

### Teste manual:
```javascript
// No Console, após logout:
document.cookie
// ❌ Não deve ter cookie 'token'
```

**✅ Esperado**: Cookie removido e redirecionamento para login

---

## ✅ Teste 5: Requisições Autenticadas

### Passo a passo:
1. Faça login
2. Vá para `/dashboard`
3. Abra DevTools → Network
4. Recarregue a página
5. Verifique requisição GET `/api/machines/my`:
   - ✅ Cookie `token` enviado automaticamente
   - ✅ Sem header `Authorization`

**✅ Esperado**: Requisição bem-sucedida usando apenas cookie

---

## ✅ Teste 6: Proteção contra Token no localStorage

### Passo a passo:
```javascript
// No Console do navegador (F12):
localStorage.getItem('token')
// ❌ Deve retornar null

localStorage.getItem('currentUser')
// ✅ Deve retornar apenas dados do usuário (sem token)
```

**✅ Esperado**: Token NÃO está no localStorage

---

## 🔍 Teste 7: Headers de Segurança (Helmet)

### Teste via curl:
```bash
curl -I http://localhost:3000/api/auth/csrf-token
```

**✅ Esperado**:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-XSS-Protection: 0
```

---

## 🎯 Checklist Final

- [ ] Cookie httpOnly definido no login
- [ ] Cookie não acessível via JavaScript
- [ ] CSRF token enviado em POST/PUT/DELETE
- [ ] Rate limiting bloqueia após 5 tentativas
- [ ] Logout remove cookie
- [ ] Token NÃO está no localStorage
- [ ] Headers de segurança presentes
- [ ] Requisições autenticadas funcionam

---

## 🐛 Problemas Comuns

### Erro: "CSRF token missing"
**Solução**: Limpe cookies e faça login novamente

### Erro: "CORS"
**Solução**: Verifique se backend tem:
```typescript
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
});
```

### Cookie não aparece
**Solução**: Verifique se frontend usa:
```typescript
withCredentials: true // axios
credentials: 'include' // fetch
```

---

## 📊 Resultado Esperado

✅ **Todas as proteções ativas**:
- XSS → Cookie httpOnly
- CSRF → Token obrigatório
- Brute Force → Rate limiting
- MITM → HTTPS + Secure cookies (produção)
