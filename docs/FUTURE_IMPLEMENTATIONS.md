# 📋 Implementações Futuras

Funcionalidades planejadas para implementar quando a plataforma tiver volume suficiente de dados.

---

## 📊 Analytics Avançado (quando tiver 50+ máquinas ativas)

### 1. Histórico Temporal — Gráfico de linha por semana

**Por que esperar:** Com poucos dados, o gráfico fica vazio e confuso pro vendedor.

**Backend:** GET `/api/analytics/history`

Retorna views e contatos agrupados por dia dos últimos 30 dias.

```json
{
  "data": [
    { "date": "2026-04-15", "views": 12, "contacts": 3 },
    { "date": "2026-04-16", "views": 8, "contacts": 1 }
  ]
}
```

**Query:**
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE type = 'VIEW') as views,
  COUNT(*) FILTER (WHERE type = 'WHATSAPP_CLICK') as contacts
FROM machine_events
WHERE machine_id IN (SELECT id FROM machines WHERE owner_id = :userId)
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date ASC;
```

**Frontend:** LineChart com Recharts (já instalado). Plano mínimo: Profissional.

---

### 2. Horários de Pico — Quando seus anúncios recebem mais contatos

**Por que esperar:** Precisa de volume estatístico relevante pra ser útil.

**Backend:** GET `/api/analytics/peak-hours`

```json
{
  "byHour": [
    { "hour": 0, "count": 1 },
    { "hour": 8, "count": 5 },
    { "hour": 14, "count": 18 }
  ],
  "byDayOfWeek": [
    { "day": 0, "label": "Domingo", "count": 3 },
    { "day": 1, "label": "Segunda", "count": 15 },
    { "day": 2, "label": "Terça", "count": 22 }
  ],
  "peakHour": 14,
  "peakDay": "Terça"
}
```

**Query:**
```sql
-- Por hora
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as count
FROM machine_events
WHERE type = 'WHATSAPP_CLICK'
  AND machine_id IN (SELECT id FROM machines WHERE owner_id = :userId)
GROUP BY hour ORDER BY hour;

-- Por dia da semana
SELECT 
  EXTRACT(DOW FROM created_at) as day,
  COUNT(*) as count
FROM machine_events
WHERE type = 'WHATSAPP_CLICK'
  AND machine_id IN (SELECT id FROM machines WHERE owner_id = :userId)
GROUP BY day ORDER BY day;
```

**Frontend:** BarChart por hora + por dia da semana. Plano mínimo: Premium.

---

### Pré-requisito para ambos

Criar tabela `machine_events` (se não existir):

```sql
CREATE TABLE machine_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'VIEW' | 'WHATSAPP_CLICK'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_machine_events_machine_id ON machine_events(machine_id);
CREATE INDEX idx_machine_events_created_at ON machine_events(created_at);
CREATE INDEX idx_machine_events_type ON machine_events(type);
```

Os endpoints `POST /machines/:id/view` e `POST /machines/:id/track-whatsapp` precisam gravar nessa tabela.

---

## 🔮 Outras ideias futuras

- **Origem do tráfego (UTM)** — depende do vendedor compartilhar links com UTM, baixa prioridade
- **Paginação no dashboard** — quando vendedores tiverem 20+ máquinas
- **Exportar relatório PDF** — pra vendedores Premium
- **Notificação semanal por email** — resumo de performance da semana
- **Comparativo mensal** — "este mês vs mês passado"
