# FASE 14 - Sistema de Favoritos - Backend

## 1. Criar Tabela no Banco de Dados

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, machine_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_machine_id ON favorites(machine_id);
```

## 2. Endpoints Necessários

### POST /api/favorites
**Adicionar máquina aos favoritos**

Request:
```json
{
  "machineId": "uuid-da-maquina"
}
```

Response (201):
```json
{
  "id": "uuid-do-favorito",
  "userId": "uuid-do-usuario",
  "machineId": "uuid-da-maquina",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### DELETE /api/favorites/:machineId
**Remover máquina dos favoritos**

Response (204): No content

### GET /api/favorites
**Listar favoritos do usuário (com dados das máquinas)**

Response (200):
```json
[
  {
    "id": "uuid-do-favorito",
    "createdAt": "2024-01-15T10:30:00Z",
    "machine": {
      "id": "uuid",
      "name": "Trator John Deere",
      "price": 285000,
      "images": ["url1", "url2"],
      "city": "Passo Fundo",
      "state": "RS",
      "yearModel": 2019,
      "manufacturer": "John Deere",
      "category": "TRACTORS",
      "businessType": "SALE"
    }
  }
]
```

### GET /api/machines/:id/is-favorited
**Verificar se máquina está favoritada**

Response (200):
```json
{
  "isFavorited": true
}
```

## 3. Exemplo de Implementação (Node.js/Express)

```javascript
// routes/favorites.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Adicionar favorito
router.post('/', authenticate, async (req, res) => {
  const { machineId } = req.body;
  const userId = req.user.id;

  try {
    const favorite = await db.query(
      'INSERT INTO favorites (user_id, machine_id) VALUES ($1, $2) RETURNING *',
      [userId, machineId]
    );
    res.status(201).json(favorite.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Já está nos favoritos' });
    }
    res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
});

// Remover favorito
router.delete('/:machineId', authenticate, async (req, res) => {
  const { machineId } = req.params;
  const userId = req.user.id;

  await db.query(
    'DELETE FROM favorites WHERE user_id = $1 AND machine_id = $2',
    [userId, machineId]
  );
  res.status(204).send();
});

// Listar favoritos
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id;

  const favorites = await db.query(`
    SELECT f.id, f.created_at, 
           m.id as machine_id, m.name, m.price, m.images, 
           m.city, m.state, m.year_model, m.manufacturer,
           m.category, m.business_type
    FROM favorites f
    JOIN machines m ON f.machine_id = m.id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC
  `, [userId]);

  res.json(favorites.rows);
});

// Verificar se está favoritado
router.get('/check/:machineId', authenticate, async (req, res) => {
  const { machineId } = req.params;
  const userId = req.user.id;

  const result = await db.query(
    'SELECT EXISTS(SELECT 1 FROM favorites WHERE user_id = $1 AND machine_id = $2)',
    [userId, machineId]
  );

  res.json({ isFavorited: result.rows[0].exists });
});

module.exports = router;
```

## 4. Adicionar no app.js

```javascript
const favoritesRoutes = require('./routes/favorites');
app.use('/api/favorites', favoritesRoutes);
```

## 5. Testar Endpoints

```bash
# Adicionar favorito
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "uuid-da-maquina"}'

# Listar favoritos
curl http://localhost:3000/api/favorites \
  -H "Authorization: Bearer TOKEN"

# Remover favorito
curl -X DELETE http://localhost:3000/api/favorites/uuid-da-maquina \
  -H "Authorization: Bearer TOKEN"

# Verificar se está favoritado
curl http://localhost:3000/api/favorites/check/uuid-da-maquina \
  -H "Authorization: Bearer TOKEN"
```

## Pronto!

Depois de implementar o backend, me avise para eu implementar o frontend! 🚀
