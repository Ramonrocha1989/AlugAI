# FASE 16 - Sistema de Avaliações - Backend

## 1. Criar Tabelas no Banco de Dados

```sql
-- Tabela de avaliações
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machine_id UUID REFERENCES machines(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_review UNIQUE(reviewer_id, reviewed_user_id, machine_id)
);

CREATE INDEX idx_reviews_reviewed_user ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_machine ON reviews(machine_id);

-- View para calcular estatísticas de avaliações
CREATE VIEW user_ratings AS
SELECT 
  reviewed_user_id as user_id,
  COUNT(*) as total_reviews,
  ROUND(AVG(rating), 1) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_stars,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_stars,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_stars,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_stars,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
FROM reviews
GROUP BY reviewed_user_id;
```

## 2. Endpoints Necessários

### POST /api/reviews
**Criar avaliação**

Request:
```json
{
  "reviewedUserId": "uuid-do-vendedor",
  "machineId": "uuid-da-maquina",
  "rating": 5,
  "comment": "Ótimo vendedor, máquina conforme anunciado!"
}
```

Response (201):
```json
{
  "id": "uuid-da-avaliacao",
  "reviewerId": "uuid-do-avaliador",
  "reviewedUserId": "uuid-do-vendedor",
  "machineId": "uuid-da-maquina",
  "rating": 5,
  "comment": "Ótimo vendedor...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### GET /api/reviews/user/:userId
**Listar avaliações recebidas por um usuário**

Response (200):
```json
{
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Ótimo vendedor!",
      "createdAt": "2024-01-15T10:30:00Z",
      "reviewer": {
        "id": "uuid",
        "name": "João Silva"
      },
      "machine": {
        "id": "uuid",
        "name": "Trator John Deere"
      }
    }
  ],
  "stats": {
    "totalReviews": 15,
    "averageRating": 4.7,
    "fiveStars": 10,
    "fourStars": 3,
    "threeStars": 2,
    "twoStars": 0,
    "oneStar": 0
  }
}
```

### GET /api/reviews/machine/:machineId
**Listar avaliações de uma máquina específica**

Response (200):
```json
[
  {
    "id": "uuid",
    "rating": 5,
    "comment": "Máquina em ótimo estado!",
    "createdAt": "2024-01-15T10:30:00Z",
    "reviewer": {
      "id": "uuid",
      "name": "Maria Santos"
    }
  }
]
```

### PUT /api/reviews/:id
**Editar avaliação (até 7 dias após criação)**

Request:
```json
{
  "rating": 4,
  "comment": "Comentário atualizado"
}
```

Response (200):
```json
{
  "id": "uuid",
  "rating": 4,
  "comment": "Comentário atualizado",
  "updatedAt": "2024-01-16T10:30:00Z"
}
```

### DELETE /api/reviews/:id
**Deletar avaliação**

Response (204): No content

### GET /api/users/:userId/rating
**Obter estatísticas de avaliação de um usuário**

Response (200):
```json
{
  "userId": "uuid",
  "totalReviews": 15,
  "averageRating": 4.7,
  "distribution": {
    "5": 10,
    "4": 3,
    "3": 2,
    "2": 0,
    "1": 0
  }
}
```

## 3. Exemplo de Implementação (Node.js/Express)

```javascript
// routes/reviews.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Criar avaliação
router.post('/', authenticate, async (req, res) => {
  const { reviewedUserId, machineId, rating, comment } = req.body;
  const reviewerId = req.user.id;

  // Validações
  if (reviewerId === reviewedUserId) {
    return res.status(400).json({ error: 'Não pode avaliar a si mesmo' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating deve ser entre 1 e 5' });
  }

  try {
    const review = await db.query(
      `INSERT INTO reviews (reviewer_id, reviewed_user_id, machine_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reviewerId, reviewedUserId, machineId, rating, comment]
    );

    res.status(201).json(review.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Você já avaliou esta transação' });
    }
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// Listar avaliações de um usuário
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  const reviews = await db.query(`
    SELECT r.*, 
           u.name as reviewer_name,
           m.name as machine_name
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    LEFT JOIN machines m ON r.machine_id = m.id
    WHERE r.reviewed_user_id = $1
    ORDER BY r.created_at DESC
  `, [userId]);

  const stats = await db.query(`
    SELECT * FROM user_ratings WHERE user_id = $1
  `, [userId]);

  res.json({
    reviews: reviews.rows,
    stats: stats.rows[0] || {
      totalReviews: 0,
      averageRating: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0
    }
  });
});

// Listar avaliações de uma máquina
router.get('/machine/:machineId', async (req, res) => {
  const { machineId } = req.params;

  const reviews = await db.query(`
    SELECT r.*, u.name as reviewer_name
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.machine_id = $1
    ORDER BY r.created_at DESC
  `, [machineId]);

  res.json(reviews.rows);
});

// Editar avaliação
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  // Verificar se é o autor
  const review = await db.query(
    'SELECT * FROM reviews WHERE id = $1 AND reviewer_id = $2',
    [id, userId]
  );

  if (review.rows.length === 0) {
    return res.status(404).json({ error: 'Avaliação não encontrada' });
  }

  // Verificar se passou 7 dias
  const createdAt = new Date(review.rows[0].created_at);
  const now = new Date();
  const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);

  if (daysDiff > 7) {
    return res.status(403).json({ error: 'Não pode editar após 7 dias' });
  }

  const updated = await db.query(
    `UPDATE reviews 
     SET rating = $1, comment = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [rating, comment, id]
  );

  res.json(updated.rows[0]);
});

// Deletar avaliação
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await db.query(
    'DELETE FROM reviews WHERE id = $1 AND reviewer_id = $2',
    [id, userId]
  );

  res.status(204).send();
});

// Obter rating de um usuário
router.get('/user/:userId/rating', async (req, res) => {
  const { userId } = req.params;

  const stats = await db.query(`
    SELECT * FROM user_ratings WHERE user_id = $1
  `, [userId]);

  if (stats.rows.length === 0) {
    return res.json({
      userId,
      totalReviews: 0,
      averageRating: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
  }

  const data = stats.rows[0];
  res.json({
    userId,
    totalReviews: data.total_reviews,
    averageRating: data.average_rating,
    distribution: {
      5: data.five_stars,
      4: data.four_stars,
      3: data.three_stars,
      2: data.two_stars,
      1: data.one_star
    }
  });
});

module.exports = router;
```

## 4. Adicionar no app.js

```javascript
const reviewsRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewsRoutes);
```

## 5. Regras de Negócio

- ✅ Usuário não pode avaliar a si mesmo
- ✅ Rating deve ser entre 1 e 5
- ✅ Uma avaliação por transação (reviewer + reviewed + machine)
- ✅ Pode editar em até 7 dias após criação
- ✅ Apenas o autor pode editar/deletar
- ✅ Média calculada automaticamente pela view

## 6. Testar Endpoints

```bash
# Criar avaliação
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedUserId": "uuid-vendedor",
    "machineId": "uuid-maquina",
    "rating": 5,
    "comment": "Ótimo vendedor!"
  }'

# Listar avaliações de um usuário
curl http://localhost:3000/api/reviews/user/uuid-usuario

# Obter rating
curl http://localhost:3000/api/reviews/user/uuid-usuario/rating

# Editar avaliação
curl -X PUT http://localhost:3000/api/reviews/uuid-avaliacao \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 4, "comment": "Atualizado"}'

# Deletar avaliação
curl -X DELETE http://localhost:3000/api/reviews/uuid-avaliacao \
  -H "Authorization: Bearer TOKEN"
```

## Pronto!

Depois de implementar o backend, me avise para integrar o frontend! 🚀
