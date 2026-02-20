# 🚨 CORREÇÃO URGENTE: Backend ainda retorna dados sensíveis

## ❌ Problema Identificado

O backend está retornando dados sensíveis no login:

```json
{
  "phone": "5553984590461",  // ❌ EXPOSTO
  "company": {
    "document": "DOC-1770836910477"  // ❌ EXPOSTO
  }
}
```

## ✅ Correção Necessária

### Arquivo: `src/auth/auth.controller.ts`

Localizar o método `login` e modificar o retorno:

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.login(loginDto);
  
  // Cookie httpOnly (já está correto)
  response.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  
  // ✅ RETORNAR APENAS DADOS NÃO SENSÍVEIS
  return {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      // ❌ REMOVER: phone: result.user.phone,
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
        // ❌ REMOVER: document: result.user.company.document,
      },
      usage: result.user.usage,
    },
  };
}
```

## 🔍 Verificar também o método `register`

```typescript
@Post('register')
@HttpCode(HttpStatus.CREATED)
async register(
  @Body() registerDto: RegisterDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.register(registerDto);
  
  // Cookie httpOnly
  response.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  
  // ✅ RETORNAR APENAS DADOS NÃO SENSÍVEIS
  return {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      // ❌ REMOVER: phone: result.user.phone,
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
        // ❌ REMOVER: document: result.user.company.document,
      },
      usage: result.user.usage,
    },
  };
}
```

## 📝 Criar endpoint `/auth/me` para dados completos

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
async getMe(@Request() req) {
  const user = await this.authService.findById(req.user.id);
  
  // ✅ Aqui pode retornar dados completos (incluindo sensíveis)
  // Só acessível com autenticação via cookie
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone, // ✅ OK aqui
    role: user.role,
    plan: user.plan,
    planExpiresAt: user.planExpiresAt,
    maxAds: user.maxAds,
    maxPremiumAds: user.maxPremiumAds,
    maxFeaturedAds: user.maxFeaturedAds,
    isVerifiedSeller: user.isVerifiedSeller,
    emailVerified: user.emailVerified,
    company: {
      id: user.company.id,
      name: user.company.name,
      document: user.company.document, // ✅ OK aqui
    },
    usage: user.usage,
  };
}
```

## 🧪 Como testar após correção

1. Limpar localStorage:
```javascript
localStorage.clear()
```

2. Fazer login novamente

3. Verificar localStorage:
```javascript
JSON.parse(localStorage.getItem('currentUser'))
```

4. **✅ Resultado esperado:**
```json
{
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
```

**❌ NÃO deve conter:**
- `phone`
- `company.document`

## 🎯 Resumo da Correção

### Remover do retorno de `/auth/login` e `/auth/register`:
- ❌ `phone`
- ❌ `company.document`

### Criar endpoint `/auth/me` que retorna:
- ✅ Todos os dados (incluindo sensíveis)
- ✅ Protegido por autenticação
- ✅ Usado apenas quando necessário (ex: página de perfil)

## 🔒 Benefícios

1. ✅ **LGPD Compliance** - Dados sensíveis não ficam expostos no localStorage
2. ✅ **Segurança XSS** - Menos dados = menos risco
3. ✅ **Privacidade** - Dados sensíveis só via API autenticada
4. ✅ **Performance** - Menos dados para transferir/armazenar

## ⚡ Ação Imediata

Aplicar as correções acima no backend e testar novamente!
