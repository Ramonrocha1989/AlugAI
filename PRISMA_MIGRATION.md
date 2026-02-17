# Prisma - Adicionar Campos de Plano

## 📋 Schema do Prisma

Adicione estes campos no seu `schema.prisma`:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  // ... outros campos existentes
  
  // NOVOS CAMPOS PARA PLANOS
  plan          String    @default("free") // "free" ou "lojista"
  planExpiresAt DateTime? // Data de expiração do plano
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## 🚀 Rodar Migration

```bash
# Criar migration
npx prisma migrate dev --name add_plan_fields

# Ou se já estiver em produção
npx prisma db push
```

## ✅ Verificar

```bash
# Abrir Prisma Studio para ver os dados
npx prisma studio
```

---

**Depois de rodar a migration, o webhook vai funcionar!** 🎉
