# Integração com Backend

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as variáveis:

```env
# URL do seu backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Modo de operação
NEXT_PUBLIC_USE_MOCK=false  # false = backend real, true = dados mockados
```

### 2. Modo Mock vs Backend Real

O sistema suporta dois modos:

- **Mock Mode** (`NEXT_PUBLIC_USE_MOCK=true`): Usa dados mockados em localStorage
- **Backend Mode** (`NEXT_PUBLIC_USE_MOCK=false`): Conecta ao backend real

Isso permite desenvolver o frontend antes do backend estar pronto!

## 📡 Endpoints Esperados

### Autenticação

#### POST `/auth/login`
```json
// Request
{
  "email": "user@example.com",
  "password": "senha123"
}

// Response
{
  "id": "123",
  "email": "user@example.com",
  "companyName": "Empresa XYZ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/register`
```json
// Request
{
  "email": "user@example.com",
  "password": "senha123",
  "companyName": "Empresa XYZ"
}

// Response
{
  "id": "123",
  "email": "user@example.com",
  "companyName": "Empresa XYZ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/logout`
```json
// Request: vazio (token no header)
// Response: 204 No Content
```

### Equipamentos

#### GET `/equipments`
Query params: `?search=escavadeira&location=São Paulo`

```json
// Response
[
  {
    "id": "1",
    "name": "Escavadeira Hidráulica",
    "description": "Escavadeira de 20 toneladas...",
    "category": "Escavadeiras",
    "pricePerDay": 850,
    "location": "São Paulo, SP",
    "images": ["url1", "url2"],
    "ownerId": "123",
    "ownerName": "Empresa XYZ",
    "available": true
  }
]
```

#### GET `/equipments/:id`
```json
// Response
{
  "id": "1",
  "name": "Escavadeira Hidráulica",
  "description": "Escavadeira de 20 toneladas...",
  "category": "Escavadeiras",
  "pricePerDay": 850,
  "location": "São Paulo, SP",
  "images": ["url1", "url2"],
  "ownerId": "123",
  "ownerName": "Empresa XYZ",
  "available": true
}
```

#### POST `/equipments`
Requer autenticação (Bearer token)

```json
// Request
{
  "name": "Escavadeira Hidráulica",
  "description": "Escavadeira de 20 toneladas...",
  "category": "Escavadeiras",
  "pricePerDay": 850,
  "location": "São Paulo, SP",
  "images": ["url1", "url2"]
}

// Response
{
  "id": "1",
  "name": "Escavadeira Hidráulica",
  "description": "Escavadeira de 20 toneladas...",
  "category": "Escavadeiras",
  "pricePerDay": 850,
  "location": "São Paulo, SP",
  "images": ["url1", "url2"],
  "ownerId": "123",
  "ownerName": "Empresa XYZ",
  "available": true
}
```

#### GET `/equipments/my`
Requer autenticação (Bearer token)

Retorna apenas os equipamentos do usuário logado.

```json
// Response
[
  {
    "id": "1",
    "name": "Escavadeira Hidráulica",
    ...
  }
]
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Token) para autenticação.

### Como funciona:

1. Usuário faz login/registro
2. Backend retorna um token JWT
3. Frontend salva o token no localStorage
4. Todas as requisições incluem o token no header: `Authorization: Bearer <token>`
5. Se o token expirar (401), usuário é redirecionado para login

### Interceptors Axios

O arquivo `services/api.ts` já está configurado com interceptors:

- **Request**: Adiciona automaticamente o token JWT em todas as requisições
- **Response**: Redireciona para login se receber erro 401 (não autorizado)

## 🚀 Testando a Integração

### 1. Com Mock (desenvolvimento frontend)
```env
NEXT_PUBLIC_USE_MOCK=true
```

```bash
npm run dev
```

### 2. Com Backend Real
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Certifique-se que seu backend está rodando:
```bash
# Exemplo com backend Node.js
cd backend
npm start

# Exemplo com backend Python
cd backend
python manage.py runserver
```

Então inicie o frontend:
```bash
npm run dev
```

## 🐛 Troubleshooting

### CORS Error
Se você receber erro de CORS, configure seu backend para aceitar requisições do frontend:

**Node.js/Express:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Python/Django:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Token não está sendo enviado
Verifique se o usuário está logado:
```javascript
const user = localStorage.getItem('currentUser');
console.log(user);
```

### Erro 401 (Unauthorized)
- Verifique se o token está válido
- Verifique se o backend está validando o token corretamente
- Verifique se o formato do header está correto: `Bearer <token>`

## 📝 Próximos Passos

- [ ] Implementar refresh token
- [ ] Adicionar upload de imagens real (S3, Cloudinary)
- [ ] Implementar paginação
- [ ] Adicionar tratamento de erros mais robusto
- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar loading states globais
