# ✅ Ajustes de Segurança no Frontend - CONCLUÍDO

## 📋 O que foi feito

### 1. ✅ Atualização da Interface User (types/index.ts)

**Antes (Inseguro):**
```typescript
export interface User {
  id: string;
  email: string;
  companyName: string;
  token?: string; // ❌ Token exposto
  plan?: 'free' | 'lojista';
  // ... campos incompletos
}
```

**Depois (Seguro):**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  planExpiresAt?: string | null;
  maxAds: number;
  maxPremiumAds: number;
  maxFeaturedAds: number;
  isVerifiedSeller: boolean;
  emailVerified: boolean;
  company: {
    id: string;
    name: string;
    // ❌ SEM document (CNPJ/CPF)
  };
  usage: {
    activeAds: number;
    premiumAds: number;
    featuredAds: number;
  };
}

// Interface separada para dados completos (apenas via API)
export interface UserProfile extends User {
  phone: string; // ✅ Só via API /auth/profile
  company: {
    id: string;
    name: string;
    document: string; // ✅ Só via API /auth/profile
  };
}
```

### 2. ✅ Atualização do authService (services/machine-api.ts)

**Login - Antes:**
```typescript
login: async (credentials: LoginCredentials): Promise<User> => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // ❌ Salvava tudo que vinha do backend
  localStorage.setItem('currentUser', JSON.stringify(data.user));
  return data.user;
}
```

**Login - Depois:**
```typescript
login: async (credentials: LoginCredentials): Promise<User> => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // ✅ Backend já retorna apenas dados não sensíveis
  // ✅ Token vai em cookie httpOnly (não acessível via JS)
  localStorage.setItem('currentUser', JSON.stringify(data.user));
  return data.user;
}
```

**Novos métodos:**
```typescript
// ✅ Buscar dados básicos (não sensíveis)
getMe: async (): Promise<User> => {
  const data = await apiRequest('/auth/me', { method: 'GET' });
  localStorage.setItem('currentUser', JSON.stringify(data));
  return data;
}

// ✅ Buscar perfil completo (incluindo dados sensíveis)
// Usar apenas quando realmente necessário (ex: página de perfil)
getProfile: async (): Promise<UserProfile> => {
  return await apiRequest('/auth/profile', { method: 'GET' });
}
```

### 3. ✅ Mock atualizado para refletir estrutura real

```typescript
const user: User = {
  id: '1',
  name: 'Agropecuária Exemplo',
  email: credentials.email,
  role: 'USER',
  plan: 'FREE',
  maxAds: 3,
  maxPremiumAds: 0,
  maxFeaturedAds: 0,
  isVerifiedSeller: false,
  emailVerified: true,
  company: {
    id: '1',
    name: 'Agropecuária Exemplo',
  },
  usage: {
    activeAds: 0,
    premiumAds: 0,
    featuredAds: 0,
  },
};
```

## 🔍 O que precisa ser ajustado manualmente

### 1. Componentes que usam `user.companyName`

Buscar e substituir por `user.company.name` ou `user.name`:

```bash
# Buscar no projeto
grep -r "companyName" --include="*.tsx" --include="*.ts"
```

**Exemplos de ajustes:**

```typescript
// ❌ Antes
<p>{user.companyName}</p>

// ✅ Depois
<p>{user.company.name}</p>
// ou
<p>{user.name}</p>
```

### 2. Componentes que acessam dados sensíveis

Se algum componente precisa de `phone` ou `company.document`:

```typescript
// ❌ Não fazer
const user = authService.getCurrentUser();
console.log(user.phone); // undefined

// ✅ Fazer
const profile = await authService.getProfile();
console.log(profile.phone); // Funciona
```

### 3. Página de Perfil

Criar/atualizar para buscar dados completos:

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/machine-api';

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Telefone: {profile.phone}</p> {/* ✅ Disponível aqui */}
      <p>CNPJ: {profile.company.document}</p> {/* ✅ Disponível aqui */}
    </div>
  );
}
```

## 📊 Comparação: Dados no localStorage

### ❌ Antes (Inseguro)
```json
{
  "id": "1",
  "email": "user@example.com",
  "companyName": "Empresa X",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "phone": "5551999887766",
  "company": {
    "document": "12.345.678/0001-90"
  }
}
```
☝️ Token, telefone e CNPJ expostos no localStorage

### ✅ Depois (Seguro)
```json
{
  "id": "1",
  "name": "Empresa X",
  "email": "user@example.com",
  "role": "USER",
  "plan": "FREE",
  "maxAds": 3,
  "isVerifiedSeller": false,
  "emailVerified": true,
  "company": {
    "id": "1",
    "name": "Empresa X"
  },
  "usage": {
    "activeAds": 0,
    "premiumAds": 0,
    "featuredAds": 0
  }
}
```
☝️ Apenas dados não sensíveis. Token em cookie httpOnly.

## 🎯 Benefícios

1. ✅ **LGPD Compliance** - Dados sensíveis não ficam expostos no localStorage
2. ✅ **Segurança XSS** - Token em cookie httpOnly não é acessível via JavaScript
3. ✅ **Menor superfície de ataque** - Menos dados = menos risco
4. ✅ **Privacidade** - Dados sensíveis só via API autenticada quando necessário
5. ✅ **Performance** - Menos dados para armazenar/transferir

## 🔧 Comandos úteis

```bash
# Buscar uso de companyName
grep -r "companyName" --include="*.tsx" --include="*.ts" app/ components/ hooks/

# Buscar uso de user.token
grep -r "user.token" --include="*.tsx" --include="*.ts" app/ components/ hooks/

# Buscar uso de phone no frontend
grep -r "\.phone" --include="*.tsx" --include="*.ts" app/ components/ hooks/
```

## ✅ Checklist Final

- [x] Interface User atualizada
- [x] authService.login atualizado
- [x] authService.register atualizado
- [x] authService.getMe criado
- [x] authService.getProfile criado
- [x] Mock atualizado
- [x] Header.tsx ajustado
- [ ] Buscar e substituir `companyName` por `company.name` em outros componentes
- [ ] Verificar se algum componente acessa `user.token` (remover)
- [ ] Criar/atualizar página de perfil para usar `getProfile()`
- [ ] Testar login e verificar localStorage
- [ ] Testar que dados sensíveis não aparecem no localStorage

## 🚀 Próximos Passos

1. Executar os comandos de busca acima
2. Ajustar componentes que usam `companyName`
3. Remover qualquer referência a `user.token`
4. Testar fluxo completo de login/logout
5. Verificar que localStorage só tem dados não sensíveis
