#!/bin/bash

# 🔒 Script de Teste de Segurança
# Testa todas as proteções implementadas

API_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:3001"

echo "🔒 TESTE DE SEGURANÇA - EquipRent"
echo "=================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar
test_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ PASSOU${NC}"
  else
    echo -e "${RED}❌ FALHOU${NC}"
  fi
}

echo "📋 Verificando serviços..."
echo ""

# Verificar se backend está rodando
if curl -s "$API_URL/auth/csrf-token" > /dev/null; then
  echo -e "${GREEN}✅ Backend rodando${NC}"
else
  echo -e "${RED}❌ Backend não está rodando em $API_URL${NC}"
  echo "Execute: cd backend && npm run start:dev"
  exit 1
fi

# Verificar se frontend está rodando
if curl -s "$FRONTEND_URL" > /dev/null; then
  echo -e "${GREEN}✅ Frontend rodando${NC}"
else
  echo -e "${YELLOW}⚠️  Frontend não está rodando em $FRONTEND_URL${NC}"
  echo "Execute: npm run dev"
fi

echo ""
echo "=================================="
echo ""

# Teste 1: CSRF Token
echo "🧪 Teste 1: CSRF Token"
echo "Obtendo token CSRF..."
CSRF_RESPONSE=$(curl -s -c cookies.txt "$API_URL/auth/csrf-token")
CSRF_TOKEN=$(echo $CSRF_RESPONSE | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CSRF_TOKEN" ]; then
  echo -e "${GREEN}✅ CSRF token obtido: ${CSRF_TOKEN:0:20}...${NC}"
else
  echo -e "${RED}❌ Falha ao obter CSRF token${NC}"
fi
echo ""

# Teste 2: Login sem CSRF (deve falhar)
echo "🧪 Teste 2: Login SEM CSRF token (deve falhar)"
LOGIN_NO_CSRF=$(curl -s -w "%{http_code}" -o /dev/null \
  -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}')

if [ "$LOGIN_NO_CSRF" = "403" ]; then
  echo -e "${GREEN}✅ Bloqueado corretamente (403)${NC}"
else
  echo -e "${RED}❌ Deveria retornar 403, retornou: $LOGIN_NO_CSRF${NC}"
fi
echo ""

# Teste 3: Login com CSRF (deve funcionar)
echo "🧪 Teste 3: Login COM CSRF token (deve funcionar)"
LOGIN_WITH_CSRF=$(curl -s -w "%{http_code}" -o /dev/null \
  -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -b cookies.txt -c cookies.txt \
  -d '{"email":"test@test.com","password":"test123"}')

if [ "$LOGIN_WITH_CSRF" = "200" ] || [ "$LOGIN_WITH_CSRF" = "201" ]; then
  echo -e "${GREEN}✅ Login bem-sucedido ($LOGIN_WITH_CSRF)${NC}"
else
  echo -e "${YELLOW}⚠️  Status: $LOGIN_WITH_CSRF (pode ser credenciais inválidas)${NC}"
fi
echo ""

# Teste 4: Rate Limiting
echo "🧪 Teste 4: Rate Limiting (5 tentativas de login)"
echo "Fazendo 6 tentativas seguidas..."
RATE_LIMIT_BLOCKED=false

for i in {1..6}; do
  # Renovar CSRF token a cada tentativa
  CSRF_TOKEN=$(curl -s -b cookies.txt -c cookies.txt "$API_URL/auth/csrf-token" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
  
  STATUS=$(curl -s -w "%{http_code}" -o /dev/null \
    -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: $CSRF_TOKEN" \
    -b cookies.txt -c cookies.txt \
    -d '{"email":"test@test.com","password":"wrong"}')
  
  echo "  Tentativa $i: Status $STATUS"
  
  if [ "$STATUS" = "429" ]; then
    RATE_LIMIT_BLOCKED=true
    break
  fi
  
  sleep 0.5
done

if [ "$RATE_LIMIT_BLOCKED" = true ]; then
  echo -e "${GREEN}✅ Rate limiting funcionando (bloqueou após tentativas)${NC}"
else
  echo -e "${YELLOW}⚠️  Rate limiting pode não estar configurado${NC}"
fi
echo ""

# Teste 5: Headers de Segurança (Helmet)
echo "🧪 Teste 5: Headers de Segurança (Helmet)"
HEADERS=$(curl -s -I "$API_URL/auth/csrf-token")

check_header() {
  if echo "$HEADERS" | grep -qi "$1"; then
    echo -e "  ${GREEN}✅ $1${NC}"
  else
    echo -e "  ${RED}❌ $1 ausente${NC}"
  fi
}

check_header "X-Content-Type-Options"
check_header "X-Frame-Options"
check_header "Strict-Transport-Security"
echo ""

# Teste 6: Cookie httpOnly
echo "🧪 Teste 6: Cookie httpOnly"
if [ -f cookies.txt ]; then
  if grep -q "HttpOnly" cookies.txt; then
    echo -e "${GREEN}✅ Cookie com flag HttpOnly${NC}"
  else
    echo -e "${YELLOW}⚠️  Cookie pode não ter flag HttpOnly${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Arquivo de cookies não encontrado${NC}"
fi
echo ""

# Limpeza
rm -f cookies.txt

echo "=================================="
echo ""
echo "📊 RESUMO DOS TESTES"
echo ""
echo "✅ = Passou | ❌ = Falhou | ⚠️  = Atenção"
echo ""
echo "Para testes manuais detalhados, veja: TESTE-SEGURANCA.md"
echo ""
echo "🔍 Próximos passos:"
echo "1. Abra o navegador em $FRONTEND_URL/login"
echo "2. Abra DevTools (F12) → Application → Cookies"
echo "3. Faça login e verifique o cookie 'token'"
echo "4. Verifique que tem flags: HttpOnly, Secure, SameSite"
echo ""
