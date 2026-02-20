# 📚 Guia Prático: Como Usar os Dados do Usuário

## 🎯 Cenários Comuns

### 1. Exibir nome do usuário no Header

```typescript
// ✅ CORRETO
import { authService } from '@/services/machine-api';

const user = authService.getCurrentUser();
if (user) {
  console.log(user.name); // Nome do usuário
  console.log(user.company.name); // Nome da empresa
}
```

### 2. Verificar se usuário está autenticado

```typescript
// ✅ CORRETO
import { authService } from '@/services/machine-api';

const isAuthenticated = !!authService.getCurrentUser();

if (!isAuthenticated) {
  router.push('/login');
}
```

### 3. Verificar role do usuário

```typescript
// ✅ CORRETO
import { authService } from '@/services/machine-api';

const user = authService.getCurrentUser();
const isAdmin = user?.role === 'ADMIN';

if (isAdmin) {
  // Mostrar menu admin
}
```

### 4. Exibir informações do plano

```typescript
// ✅ CORRETO
import { authService } from '@/services/machine-api';

const user = authService.getCurrentUser();

return (
  <div>
    <p>Plano: {user.plan}</p>
    <p>Anúncios: {user.usage.activeAds} / {user.maxAds}</p>
    <p>Premium: {user.usage.premiumAds} / {user.maxPremiumAds}</p>
  </div>
);
```

### 5. Buscar dados completos do perfil (incluindo telefone)

```typescript
// ✅ CORRETO - Página de Perfil
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
      <h1>Meu Perfil</h1>
      <p>Nome: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Telefone: {profile.phone}</p> {/* ✅ Disponível aqui */}
      <p>CNPJ: {profile.company.document}</p> {/* ✅ Disponível aqui */}
    </div>
  );
}
```

### 6. Atualizar dados do usuário

```typescript
// ✅ CORRETO
import { authService } from '@/services/machine-api';

// Após login ou atualização
const updatedUser = await authService.getMe();
// localStorage é atualizado automaticamente
```

## ❌ O que NÃO fazer

### ❌ Tentar acessar token

```typescript
// ❌ ERRADO
const user = authService.getCurrentUser();
console.log(user.token); // undefined - token está em cookie httpOnly
```

**✅ Solução:** Token é enviado automaticamente nos cookies. Não precisa acessar.

### ❌ Tentar acessar telefone do localStorage

```typescript
// ❌ ERRADO
const user = authService.getCurrentUser();
console.log(user.phone); // undefined - não está no localStorage
```

**✅ Solução:** Use `authService.getProfile()` quando precisar de dados sensíveis.

### ❌ Usar companyName

```typescript
// ❌ ERRADO
const user = authService.getCurrentUser();
console.log(user.companyName); // undefined - campo não existe mais
```

**✅ Solução:** Use `user.company.name` ou `user.name`.

### ❌ Salvar dados sensíveis manualmente

```typescript
// ❌ ERRADO
const profile = await authService.getProfile();
localStorage.setItem('userProfile', JSON.stringify(profile)); // Expõe dados sensíveis
```

**✅ Solução:** Nunca salve dados sensíveis no localStorage. Use apenas via API.

## 🔐 Boas Práticas

### 1. Sempre use getCurrentUser() para dados básicos

```typescript
// ✅ BOM
const user = authService.getCurrentUser();
if (user) {
  // Usar dados não sensíveis
}
```

### 2. Use getProfile() apenas quando necessário

```typescript
// ✅ BOM - Apenas em páginas que realmente precisam
const profile = await authService.getProfile();
// Usar dados sensíveis temporariamente
```

### 3. Não armazene dados sensíveis em estado

```typescript
// ❌ EVITAR
const [userProfile, setUserProfile] = useState(null);

useEffect(() => {
  authService.getProfile().then(setUserProfile);
}, []);

// ✅ MELHOR - Usar React Query
const { data: profile } = useQuery({
  queryKey: ['profile'],
  queryFn: () => authService.getProfile(),
  staleTime: 5 * 60 * 1000, // Cache por 5 minutos
});
```

### 4. Verifique se dados existem antes de usar

```typescript
// ✅ BOM
const user = authService.getCurrentUser();
const companyName = user?.company?.name || user?.name || 'Usuário';
```

## 📝 Exemplos de Componentes

### Componente: UserInfo

```typescript
'use client';

import { authService } from '@/services/machine-api';
import { useEffect, useState } from 'react';

export function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  return (
    <div>
      <p>Olá, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Plano: {user.plan}</p>
    </div>
  );
}
```

### Componente: ProfileForm

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/machine-api';
import { Input } from '@/components/ui/input';

export function ProfileForm() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <form>
      <Input 
        label="Nome" 
        value={profile.name} 
        readOnly 
      />
      <Input 
        label="Email" 
        value={profile.email} 
        readOnly 
      />
      <Input 
        label="Telefone" 
        value={profile.phone} 
        readOnly 
      />
      <Input 
        label="CNPJ" 
        value={profile.company.document} 
        readOnly 
      />
    </form>
  );
}
```

### Hook: useCurrentUser

```typescript
// hooks/use-current-user.ts
import { useEffect, useState } from 'react';
import { authService } from '@/services/machine-api';
import { User } from '@/types';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return user;
}

// Uso:
// const user = useCurrentUser();
```

## 🎯 Resumo

### Dados Básicos (localStorage)
- ✅ Usar `authService.getCurrentUser()`
- ✅ Disponível: `id`, `name`, `email`, `role`, `plan`, `company.name`, `usage`
- ✅ Rápido e sempre disponível

### Dados Completos (API)
- ✅ Usar `authService.getProfile()`
- ✅ Disponível: Todos os dados + `phone` + `company.document`
- ✅ Usar apenas quando necessário (ex: página de perfil)

### Token
- ✅ Enviado automaticamente em cookies
- ✅ Não precisa acessar manualmente
- ✅ Protegido contra XSS (httpOnly)

## 🚀 Pronto para usar!

Agora você sabe como trabalhar com os dados do usuário de forma segura e eficiente!
