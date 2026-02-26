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
│   ├── forgot-password/        # Recuperação de senha
│   ├── reset-password/         # Reset de senha com token
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
- **Recuperação de senha (Esqueci minha senha)**
- **Reset de senha com token**
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


---

# 📚 DOCUMENTAÇÃO COMPLETA

## 🔧 Integração com Backend

### Configuração

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_MOCK=false  # false = backend real, true = mock
```

### Endpoints Esperados

#### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register` - Cadastro
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Recuperação de senha
- `POST /auth/reset-password` - Reset de senha
- `POST /auth/request-delete` - Solicitar exclusão de conta
- `POST /auth/confirm-delete` - Confirmar exclusão

#### Equipamentos/Máquinas
- `GET /equipments` ou `/machines` - Listar
- `GET /equipments/:id` - Detalhes
- `POST /equipments` - Criar
- `PUT /machines/:id` - Editar
- `DELETE /machines/:id` - Deletar
- `GET /equipments/my` - Minhas máquinas

#### Favoritos
- `POST /api/favorites` - Adicionar
- `DELETE /api/favorites/:machineId` - Remover
- `GET /api/favorites` - Listar
- `GET /api/favorites/check/:machineId` - Verificar

#### Avaliações
- `POST /api/reviews` - Criar avaliação
- `GET /api/reviews/user/:userId` - Listar avaliações
- `GET /api/reviews/machine/:machineId` - Avaliações da máquina
- `PUT /api/reviews/:id` - Editar (até 7 dias)
- `DELETE /api/reviews/:id` - Deletar

#### Verificação de Vendedor
- `POST /api/verification/request` - Solicitar verificação
- `GET /api/admin/verification-requests` - Listar (admin)
- `POST /api/admin/verification-requests/:id/approve` - Aprovar (admin)
- `POST /api/admin/verification-requests/:id/reject` - Rejeitar (admin)

---

## 💳 Integração Mercado Pago

### Configuração

```env
# Teste
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-d311be20-4301-42a3-b69f-7c8674c4524f
MERCADOPAGO_ACCESS_TOKEN=TEST-8899207110190706-021710-148052702e6c46c20f8b1e014d423079-253473469
```

### Cartões de Teste

**Aprovado:**
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO
CPF: 12345678909
```

### Webhook

**URL:** `https://seudominio.com/api/webhooks/mercadopago`

**Teste local com ngrok:**
```bash
ngrok http 3001
```

---

## 🗄️ Banco de Dados

### Tabelas Necessárias

#### verification_requests
```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_type VARCHAR(10) NOT NULL,
  document_number VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### favorites
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, machine_id)
);
```

#### reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machine_id UUID REFERENCES machines(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_review UNIQUE(reviewer_id, reviewed_user_id, machine_id)
);
```

#### password_reset_tokens
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Segurança

### Frontend

✅ **Sanitização HTML** - `isomorphic-dompurify`
```typescript
import { sanitizeHTML } from '@/lib/sanitize';
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
```

✅ **Security Headers** - `next.config.js`
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

✅ **Validação CPF/CNPJ**
```bash
npm install cpf-cnpj-validator
```

### Backend (Esperado)

✅ Helmet (Security Headers)
✅ Rate Limiting (100 req/min)
✅ Sanitização HTML
✅ Hash bcrypt + JWT
✅ CSRF Protection

---

## 📱 Responsividade

### Breakpoints
```css
sm: 640px   /* Tablets pequenos */
md: 768px   /* Tablets */
lg: 1024px  /* Notebooks */
xl: 1280px  /* Desktops */
```

✅ Header com menu mobile
✅ Filtros adaptáveis
✅ Grid responsivo (1/2/3 colunas)
✅ Cards otimizados

---

## ⚡ Performance

### Infinite Scroll
```typescript
import { useInfiniteMachines } from '@/hooks/use-infinite-machines';
const { data, fetchNextPage, hasNextPage } = useInfiniteMachines(filters);
```

### Skeleton Loading
```typescript
import { MachineSkeleton } from '@/components/machine-skeleton';
{isLoading && <MachineSkeleton count={6} />}
```

### PWA
- Instalável como app
- `public/manifest.json`
- `public/icon-192.png` e `icon-512.png`

---

## 🔍 SEO

### Metadata Dinâmica
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const machine = await machineService.getById(params.id);
  return {
    title: `${machine.name} - ${machine.price}`,
    description: machine.description,
  };
}
```

### Sitemap Dinâmico
**URL:** `/sitemap.xml` - Atualizado a cada 1 hora

### Robots.txt
**URL:** `/robots.txt`

---

## 📧 Emails

### Templates Necessários

1. **Recuperação de Senha** - Link expira em 1 hora
2. **Exclusão de Conta** - Link expira em 24 horas
3. **Vendedor Verificado** - Confirmação de aprovação

### Configuração (SendGrid/AWS SES)
```env
SENDGRID_API_KEY=xxx
# ou
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Variáveis de Ambiente
```
NEXT_PUBLIC_API_URL=https://api.mercadomaquina.com
NEXT_PUBLIC_SITE_URL=https://mercadomaquina.com
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP-xxx
MERCADOPAGO_ACCESS_TOKEN=APP-xxx
```

### Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Credenciais de produção (Mercado Pago)
- [ ] HTTPS ativado
- [ ] Webhook configurado
- [ ] Google Search Console
- [ ] Sitemap enviado
- [ ] Performance > 90 (Lighthouse)

---

## 📊 Monitoramento

### Google Analytics
Já implementado em `app/layout.tsx`

### Métricas
- Usuários ativos
- Páginas mais visitadas
- Taxa de conversão
- Core Web Vitals

---

## 🐛 Troubleshooting

### CORS Error
Configurar backend para aceitar origem do frontend.

### Token não enviado
```javascript
const user = localStorage.getItem('currentUser');
console.log(user);
```

### Erro 401
- Verificar token válido
- Verificar formato: `Bearer <token>`

---

## 📝 Roadmap

### Fase 1 - MVP ✅
- [x] Autenticação
- [x] CRUD de máquinas
- [x] Filtros e busca
- [x] Dashboard
- [x] Responsividade

### Fase 2 - Melhorias ✅
- [x] Favoritos
- [x] Avaliações
- [x] Verificação de vendedor
- [x] Recuperação de senha
- [x] SEO avançado
- [x] Performance (infinite scroll, PWA)

### Fase 3 - Pagamentos ✅
- [x] Integração Mercado Pago
- [x] Planos (Free/Lojista)
- [x] Webhook
- [ ] Assinaturas recorrentes

### Fase 4 - Futuro
- [ ] Chat entre usuários
- [ ] Notificações push
- [ ] Sistema de propostas
- [ ] App mobile nativo

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📞 Suporte

- Email: suporte@mercadomaquina.com
- WhatsApp: (51) 99999-9999

---

## 🎓 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Mercado Pago Docs](https://www.mercadopago.com.br/developers)
