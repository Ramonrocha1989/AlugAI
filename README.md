# EquipRent - Marketplace de Aluguel de Equipamentos

MVP de marketplace B2B para aluguel de equipamentos de construção, desenvolvido com Next.js 14 e tecnologias modernas.

## 🚀 Stack Tecnológica

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes)
- **TanStack Query** (React Query)
- **Zod** (validação)
- **Axios** (HTTP client)
- **React Hook Form** (formulários)

## 📁 Estrutura do Projeto

```
├── app/                          # App Router do Next.js
│   ├── dashboard/               # Dashboard do usuário
│   │   ├── new-equipment/      # Cadastro de equipamento
│   │   └── page.tsx            # Lista de equipamentos do usuário
│   ├── equipment/[id]/         # Detalhes do equipamento
│   ├── login/                  # Login e cadastro
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Página inicial
│   └── globals.css             # Estilos globais
├── components/                  # Componentes React
│   ├── ui/                     # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── equipment-card.tsx      # Card de equipamento
│   ├── header.tsx              # Header global
│   └── providers.tsx           # Provider do React Query
├── hooks/                       # Hooks customizados
│   └── use-api.ts              # Hooks com React Query
├── lib/                         # Utilitários
│   ├── mock-data.ts            # Dados mockados
│   ├── utils.ts                # Funções utilitárias
│   └── validations.ts          # Schemas Zod
├── services/                    # Serviços de API
│   └── api.ts                  # Cliente Axios e serviços
└── types/                       # Tipos TypeScript
    └── index.ts                # Interfaces do domínio
```

## 🎯 Funcionalidades Implementadas

### 1. Página Inicial
- Lista de equipamentos disponíveis
- Filtros por nome e localização
- Cards com foto, nome, preço e localização
- Navegação para detalhes

### 2. Detalhes do Equipamento
- Galeria de imagens
- Informações completas (descrição, preço, localização)
- Disponibilidade (placeholder)
- Botão "Solicitar aluguel"

### 3. Autenticação
- Formulário de login
- Formulário de cadastro
- Validação com Zod
- Persistência em localStorage (mock)

### 4. Dashboard do Usuário
- Lista de equipamentos cadastrados pelo usuário
- Botão para cadastrar novo equipamento
- Estado vazio com call-to-action

### 5. Cadastro de Equipamento
- Formulário completo com validação
- Campos: nome, descrição, categoria, preço, localização
- Upload de imagens (URLs - mock)
- Feedback de sucesso/erro

## 🏗️ Arquitetura

### Camada de Dados (Mock)
- **services/api.ts**: Simula chamadas HTTP com delays
- **lib/mock-data.ts**: Dados estáticos de equipamentos
- **localStorage**: Persistência de usuário e equipamentos criados

### Camada de Estado
- **TanStack Query**: Cache e sincronização de dados
- **hooks/use-api.ts**: Hooks customizados para queries e mutations
- Invalidação automática de cache após mutations

### Camada de Apresentação
- **Componentes reutilizáveis**: Button, Card, Input, etc.
- **Componentes de domínio**: EquipmentCard, Header
- **Páginas**: Organização por funcionalidade

### Validação
- **Zod schemas**: Validação tipada de formulários
- **React Hook Form**: Gerenciamento de estado de formulários
- **@hookform/resolvers**: Integração Zod + React Hook Form

## 🚦 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

Acesse: http://localhost:3000

## 🔐 Autenticação (Mock)

O sistema aceita qualquer email/senha para login. Os dados são salvos em localStorage.

**Usuário de teste:**
- Email: qualquer@email.com
- Senha: qualquer (mínimo 6 caracteres)

## 📝 Próximos Passos (Integração Real)

### Backend Integration
1. Substituir `services/api.ts` por chamadas reais
2. Implementar autenticação JWT
3. Conectar com API REST ou GraphQL

### Exemplo de integração:
```typescript
// services/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Adicionar interceptor para token
api.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
```

### Upload de Imagens
1. Integrar com S3, Cloudinary ou similar
2. Implementar componente de upload real
3. Adicionar preview de imagens

### Melhorias Futuras
- Paginação de equipamentos
- Filtros avançados (categoria, faixa de preço)
- Sistema de avaliações
- Chat entre locador e locatário
- Calendário de disponibilidade real
- Sistema de pagamento
- Notificações

## 🎨 Design System

O projeto utiliza o design system do shadcn/ui com tema customizável via CSS variables.

**Cores principais:**
- Primary: Azul escuro profissional
- Secondary: Cinza claro
- Accent: Azul claro
- Destructive: Vermelho

**Responsividade:**
- Mobile-first
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 📦 Componentes Reutilizáveis

- **Button**: Variantes (default, outline, ghost, link)
- **Card**: Container com header, content e footer
- **Input**: Campo de texto com validação
- **Label**: Label acessível
- **Textarea**: Campo de texto multilinha

## 🔍 Boas Práticas Implementadas

- ✅ Tipagem forte com TypeScript
- ✅ Validação de formulários com Zod
- ✅ Gerenciamento de estado com React Query
- ✅ Componentes reutilizáveis
- ✅ Separação de responsabilidades
- ✅ Code splitting automático (Next.js)
- ✅ Otimização de imagens (next/image)
- ✅ SEO-friendly (metadata)
- ✅ Acessibilidade (Radix UI)

## 📄 Licença

MIT
