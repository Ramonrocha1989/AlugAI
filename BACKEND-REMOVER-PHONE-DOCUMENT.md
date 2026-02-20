# 🔧 BACKEND: Remover phone e company.document do Login

## ❌ Problema Atual

O backend está retornando no login:
```json
{
  "phone": "5553984590461",           // ❌ REMOVER
  "company": {
    "document": "DOC-1770836910477"   // ❌ REMOVER
  }
}
```

## ✅ Solução: Atualizar auth.controller.ts

### Localização: `src/auth/auth.controller.ts`

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.login(loginDto);
  
  // Cookie httpOnly
  response.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  
  // ✅ RETORNAR APENAS DADOS NECESSÁRIOS
  return {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      // phone: result.user.phone,  ❌ REMOVER ESTA LINHA
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
        // document: result.user.company.document,  ❌ REMOVER ESTA LINHA
      },
      usage: result.user.usage,
    },
  };
}
```

## ✅ Resultado Esperado

Após a correção, o login deve retornar:

```json
{
  "user": {
    "id": "0aec23d7-f7f2-44a0-ab15-fb4448de658b",
    "name": "ramonrocha1989",
    "email": "ramonrocha1989@gmail.com",
    "role": "ADMIN",
    "plan": "lojista",
    "planExpiresAt": null,
    "maxAds": 3,
    "maxPremiumAds": 3,
    "maxFeaturedAds": 5,
    "isVerifiedSeller": false,
    "emailVerified": true,
    "company": {
      "id": "6c9eeb76-fd1c-4e9b-abda-28121c3a32ce",
      "name": "pessoal"
    },
    "usage": {
      "activeAds": 3,
      "premiumAds": 1,
      "featuredAds": 2
    }
  }
}
```

## 🧪 Testar

```bash
# Limpar cookies e fazer login
curl -s -c /tmp/cookies.txt http://localhost:3000/api/auth/csrf-token > /tmp/csrf.json && \
CSRF=$(cat /tmp/csrf.json | jq -r '.csrfToken') && \
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -b /tmp/cookies.txt -c /tmp/cookies.txt \
  -d '{"email":"ramonrocha1989@gmail.com","password":"senha123"}'
```

**Verificar que NÃO aparecem:**
- ❌ `phone`
- ❌ `company.document`

## 📝 Também Atualizar

### 1. Register (src/auth/auth.controller.ts)

```typescript
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  const result = await this.authService.register(registerDto);
  
  return {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      // phone: result.user.phone,  ❌ REMOVER
      role: result.user.role,
      plan: result.user.plan,
      // ... resto igual ao login
      company: {
        id: result.user.company.id,
        name: result.user.company.name,
        // document: result.user.company.document,  ❌ REMOVER
      },
    },
  };
}
```

### 2. GET /auth/me (manter dados mínimos)

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
async getMe(@Request() req) {
  const user = await this.authService.findById(req.user.id);
  
  // Retornar mesmos dados do login (sem phone/document)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // phone: user.phone,  ❌ REMOVER
    role: user.role,
    plan: user.plan,
    // ...
    company: {
      id: user.company.id,
      name: user.company.name,
      // document: user.company.document,  ❌ REMOVER
    },
  };
}
```

### 3. Criar endpoint para dados completos (quando necessário)

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req) {
  const user = await this.authService.findById(req.user.id);
  
  // ✅ Aqui pode retornar phone e document
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,  // ✅ OK aqui
    role: user.role,
    company: {
      id: user.company.id,
      name: user.company.name,
      document: user.company.document,  // ✅ OK aqui
    },
  };
}
```

## ✅ Checklist

- [ ] Remover `phone` do login
- [ ] Remover `company.document` do login
- [ ] Remover `phone` do register
- [ ] Remover `company.document` do register
- [ ] Atualizar GET /auth/me (sem phone/document)
- [ ] Criar GET /auth/profile (com phone/document)
- [ ] Testar com curl
- [ ] Limpar localStorage no frontend
- [ ] Fazer novo login
- [ ] Verificar que localStorage não tem phone/document
