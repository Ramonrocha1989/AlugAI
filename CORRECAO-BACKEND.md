# 🔧 CORREÇÃO URGENTE - Backend (NestJS)

## ❌ Problema Atual
- Login funciona ✅
- Cookie é definido ✅
- Mas requisições subsequentes retornam 401 ❌
- Frontend redireciona para login ❌

## 🔍 Causa
O cookie **não está sendo enviado** ou **não está sendo lido** pelo backend nas requisições após o login.

---

## ✅ SOLUÇÃO 1: Configurar Cookie Corretamente

### src/auth/auth.controller.ts

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.login(loginDto);
  
  // IMPORTANTE: Configurações do cookie
  response.cookie('token', result.token, {
    httpOnly: true,
    secure: false, // ← DEVE SER FALSE em desenvolvimento (HTTP)
    sameSite: 'lax', // ← IMPORTANTE: 'lax' não 'strict'
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    path: '/',
    domain: undefined, // ← NÃO definir em localhost
  });
  
  return {
    user: result.user,
    // NÃO retornar token no body
  };
}
```

**Por que `sameSite: 'lax'`?**
- `strict` bloqueia cookies em redirecionamentos
- `lax` permite cookies em navegação normal

---

## ✅ SOLUÇÃO 2: Verificar CORS

### src/main.ts

```typescript
app.enableCors({
  origin: 'http://localhost:3001', // ← URL EXATA do frontend
  credentials: true, // ← OBRIGATÓRIO
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['Set-Cookie'],
});
```

---

## ✅ SOLUÇÃO 3: JWT Strategy Lendo Cookie

### src/auth/strategies/jwt.strategy.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Ler token do cookie
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['token'];
        }
        
        // Log para debug (remover depois)
        console.log('🍪 Cookie token:', token ? 'Presente' : 'Ausente');
        
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('✅ Token validado:', payload.sub);
    
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

---

## ✅ SOLUÇÃO 4: Cookie Parser

### src/main.ts

```typescript
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // IMPORTANTE: Cookie parser ANTES de tudo
  app.use(cookieParser());
  
  // CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  
  // ... resto
}
```

---

## 🧪 TESTAR

### 1. Verificar se cookie está sendo definido

```bash
# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: SEU_TOKEN_CSRF" \
  -d '{"email":"test@test.com","password":"senha123"}' \
  -c cookies.txt \
  -v

# Verificar arquivo cookies.txt
cat cookies.txt
# Deve ter: token=eyJhbGc...
```

### 2. Verificar se cookie está sendo lido

```bash
# Fazer requisição autenticada
curl http://localhost:3000/api/machines/my \
  -b cookies.txt \
  -v

# Deve retornar 200 (não 401)
```

### 3. Logs do NestJS

Após fazer login, os logs devem mostrar:
```
🍪 Cookie token: Presente
✅ Token validado: 123
```

Se mostrar "Ausente", o cookie não está sendo enviado.

---

## 📋 CHECKLIST

- [ ] `sameSite: 'lax'` (não 'strict')
- [ ] `secure: false` em desenvolvimento
- [ ] `domain: undefined` (não definir)
- [ ] CORS com `credentials: true`
- [ ] CORS com `origin` correto
- [ ] `cookieParser()` configurado
- [ ] JWT Strategy lê do cookie
- [ ] Testar com curl

---

## 🎯 RESULTADO ESPERADO

1. Login → Cookie definido ✅
2. Redireciona para /dashboard ✅
3. Dashboard faz requisição → Cookie enviado automaticamente ✅
4. Backend lê cookie → Valida JWT ✅
5. Retorna dados (200) ✅
6. Dashboard carrega normalmente ✅

---

## 🐛 DEBUG

Se ainda não funcionar, adicione logs:

```typescript
// src/auth/strategies/jwt.strategy.ts
jwtFromRequest: (req: Request) => {
  console.log('📨 Headers:', req.headers);
  console.log('🍪 Cookies:', req.cookies);
  
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  
  console.log('🔑 Token extraído:', token ? 'SIM' : 'NÃO');
  
  return token;
},
```

Faça login e veja os logs. Me envie o resultado!
