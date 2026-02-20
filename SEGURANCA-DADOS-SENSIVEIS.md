# 🔒 SEGURANÇA: Dados Mínimos no localStorage

## 🎯 Objetivo

Manter apenas dados **essenciais** no localStorage para:
- ✅ Reduzir payload
- ✅ Melhorar performance
- ✅ Minimizar exposição desnecessária

## ✅ Dados Mínimos Necessários no localStorage

### Backend: src/auth/auth.controller.ts

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.login(loginDto);
  
  // Cookie httpOnly com token
  response.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  
  // Retornar APENAS dados necessários para UI
  return {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
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
      },
      usage: result.user.usage,
    },
  };
}
```

## 📋 Dados Necessários no localStorage:

✅ **Mínimo para funcionar:**
- `id` - Identificar usuário
- `name` - Exibir nome
- `email` - Exibir email
- `role` - Controle de acesso (ADMIN/USER)
- `plan` - Controlar features (FREE/lojista)
- `maxAds` - Validar limites
- `maxPremiumAds` - Validar limites Premium
- `maxFeaturedAds` - Validar limites Destaque
- `isVerifiedSeller` - Badge verificado
- `emailVerified` - Avisos de verificação
- `company.id` - ID da empresa
- `company.name` - Nome da empresa
- `usage` - Contadores de uso

## ⚠️ Dados Desnecessários (não retornar):

- `phone` - Buscar via API quando necessário
- `company.document` - Buscar via API quando necessário
- `address` - Buscar via API quando necessário
- `createdAt`, `updatedAt` - Não usado na UI
- Qualquer campo não usado diretamente

## 🔐 Buscar Dados Adicionais Quando Necessário

### Endpoint para perfil completo:

```typescript
// src/auth/auth.controller.ts
@Get('me')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req) {
  const user = await this.authService.findById(req.user.id);
  
  // Retornar dados completos
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    company: {
      id: user.company.id,
      name: user.company.name,
      document: user.company.document,
    },
    // ... outros dados
  };
}
```

## 🎯 Benefícios:

1. ✅ **Performance** - Menos dados = payload menor
2. ✅ **Manutenibilidade** - Apenas o necessário
3. ✅ **Segurança** - Minimizar exposição
4. ✅ **Flexibilidade** - Dados extras via API quando necessário

## 📊 Comparação:

### ❌ Antes (Desnecessário):
```json
{
  "phone": "5553984590461",
  "company": {
    "document": "DOC-1770836910477"
  },
  "createdAt": "2024-01-01",
  "updatedAt": "2024-01-02"
}
```
☝️ Dados extras não usados na UI

### ✅ Depois (Mínimo):
```json
{
  "id": "123",
  "name": "ramonrocha1989",
  "email": "ramonrocha1989@gmail.com",
  "role": "ADMIN",
  "plan": "lojista",
  "company": {
    "id": "456",
    "name": "Empresa XYZ"
  }
}
```
☝️ Apenas o necessário para UI

```typescript
// Buscar dados extras quando necessário
const profile = await api.get('/auth/me');
console.log(profile.phone); // ✅ Disponível via API
```

## ✅ Implementar:

1. Atualizar `auth.controller.ts` para retornar apenas dados necessários
2. Criar/atualizar endpoint `/auth/me` para perfil completo
3. Frontend busca dados extras via API quando necessário
