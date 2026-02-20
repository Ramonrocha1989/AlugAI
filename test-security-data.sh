#!/bin/bash

# Script para testar se dados sensíveis estão expostos no localStorage

echo "🔍 Testando segurança de dados sensíveis..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL da API
API_URL="${API_URL:-http://localhost:3000/api}"

echo "📍 API URL: $API_URL"
echo ""

# Teste 1: Login
echo "1️⃣ Testando endpoint /auth/login..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"ramonrocha1989@gmail.com","password":"SuaSenha123"}' \
  -c cookies.txt)

echo "Resposta do login:"
echo "$RESPONSE" | jq '.'
echo ""

# Verificar se contém dados sensíveis
if echo "$RESPONSE" | jq -e '.user.phone' > /dev/null 2>&1; then
  echo -e "${RED}❌ FALHA: Campo 'phone' está exposto no login!${NC}"
  PHONE_EXPOSED=1
else
  echo -e "${GREEN}✅ OK: Campo 'phone' não está exposto${NC}"
  PHONE_EXPOSED=0
fi

if echo "$RESPONSE" | jq -e '.user.company.document' > /dev/null 2>&1; then
  echo -e "${RED}❌ FALHA: Campo 'company.document' está exposto no login!${NC}"
  DOCUMENT_EXPOSED=1
else
  echo -e "${GREEN}✅ OK: Campo 'company.document' não está exposto${NC}"
  DOCUMENT_EXPOSED=0
fi

echo ""

# Teste 2: Endpoint /auth/me
echo "2️⃣ Testando endpoint /auth/me..."
ME_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
  -b cookies.txt)

echo "Resposta do /auth/me:"
echo "$ME_RESPONSE" | jq '.'
echo ""

# Verificar se /auth/me retorna dados completos
if echo "$ME_RESPONSE" | jq -e '.phone' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ OK: /auth/me retorna 'phone' (esperado)${NC}"
  ME_HAS_PHONE=1
else
  echo -e "${YELLOW}⚠️  AVISO: /auth/me não retorna 'phone'${NC}"
  ME_HAS_PHONE=0
fi

if echo "$ME_RESPONSE" | jq -e '.company.document' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ OK: /auth/me retorna 'company.document' (esperado)${NC}"
  ME_HAS_DOCUMENT=1
else
  echo -e "${YELLOW}⚠️  AVISO: /auth/me não retorna 'company.document'${NC}"
  ME_HAS_DOCUMENT=0
fi

echo ""

# Limpar cookies
rm -f cookies.txt

# Resumo
echo "📊 RESUMO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $PHONE_EXPOSED -eq 0 ] && [ $DOCUMENT_EXPOSED -eq 0 ]; then
  echo -e "${GREEN}✅ SEGURANÇA OK: Dados sensíveis não estão expostos no login${NC}"
  EXIT_CODE=0
else
  echo -e "${RED}❌ FALHA DE SEGURANÇA: Dados sensíveis estão expostos no login!${NC}"
  echo ""
  echo "🔧 AÇÃO NECESSÁRIA:"
  echo "   Aplicar correções em src/auth/auth.controller.ts"
  echo "   Ver arquivo: CORRECAO-BACKEND-URGENTE.md"
  EXIT_CODE=1
fi

echo ""

if [ $ME_HAS_PHONE -eq 1 ] && [ $ME_HAS_DOCUMENT -eq 1 ]; then
  echo -e "${GREEN}✅ ENDPOINT /auth/me OK: Retorna dados completos${NC}"
else
  echo -e "${YELLOW}⚠️  ENDPOINT /auth/me: Implementar para retornar dados completos${NC}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $EXIT_CODE
