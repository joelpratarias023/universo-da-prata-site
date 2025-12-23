#!/bin/bash

# 📋 CHECKLIST DE MIGRAÇÃO SUPABASE
# Execute este script para verificar se tudo está pronto

echo "╔════════════════════════════════════════════════════╗"
echo "║  ✅ CHECKLIST - MIGRAÇÃO SUPABASE               ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="✅"
cross_mark="❌"

# 1. Verificar se package.json foi atualizado
echo -n "1. Verificando package.json... "
if grep -q "@supabase/supabase-js" package.json && ! grep -q "mysql2" package.json; then
  echo -e "${GREEN}${check_mark}${NC}"
else
  echo -e "${RED}${cross_mark}${NC}"
  echo "   ⚠️  Execute: npm install"
fi

# 2. Verificar se database.js foi atualizado
echo -n "2. Verificando src/config/database.js... "
if grep -q "@supabase/supabase-js" src/config/database.js; then
  echo -e "${GREEN}${check_mark}${NC}"
else
  echo -e "${RED}${cross_mark}${NC}"
fi

# 3. Verificar se os modelos foram adaptados
echo -n "3. Verificando modelos adaptados... "
MODELS_OK=0
for model in Usuario.js Categoria.js Produto.js Pedido.js ItensPedido.js Endereco.js Avaliacao.js; do
  if grep -q "supabase" "src/models/$model"; then
    MODELS_OK=$((MODELS_OK + 1))
  fi
done

if [ $MODELS_OK -eq 7 ]; then
  echo -e "${GREEN}${check_mark}${NC} (7/7 modelos)"
else
  echo -e "${RED}${cross_mark}${NC} ($MODELS_OK/7 modelos)"
fi

# 4. Verificar se server.js foi atualizado
echo -n "4. Verificando src/server.js... "
if grep -q "supabase" src/server.js && ! grep -q "const pool" src/server.js; then
  echo -e "${GREEN}${check_mark}${NC}"
else
  echo -e "${RED}${cross_mark}${NC}"
fi

# 5. Verificar se .env.example foi atualizado
echo -n "5. Verificando .env.example... "
if grep -q "SUPABASE_URL" .env.example && ! grep -q "DB_HOST" .env.example; then
  echo -e "${GREEN}${check_mark}${NC}"
else
  echo -e "${RED}${cross_mark}${NC}"
fi

# 6. Verificar se arquivos de documentação existem
echo -n "6. Verificando documentação... "
DOCS_OK=0
for doc in supabase-schema.sql SUPABASE_SETUP.md MIGRATION_SUMMARY.md TESTING_GUIDE.md; do
  if [ -f "$doc" ]; then
    DOCS_OK=$((DOCS_OK + 1))
  fi
done

if [ $DOCS_OK -eq 4 ]; then
  echo -e "${GREEN}${check_mark}${NC} (4/4 documentos)"
else
  echo -e "${YELLOW}⚠️ ${NC} ($DOCS_OK/4 documentos)"
fi

# 7. Verificar se .env existe
echo -n "7. Verificando .env... "
if [ -f ".env" ]; then
  if grep -q "SUPABASE_URL" .env; then
    echo -e "${GREEN}${check_mark}${NC}"
  else
    echo -e "${YELLOW}⚠️ ${NC} (sem credenciais preenchidas)"
  fi
else
  echo -e "${RED}${cross_mark}${NC} (.env não existe, crie a partir de .env.example)"
fi

# 8. Verificar dependências
echo -n "8. Verificando node_modules... "
if [ -d "node_modules" ]; then
  echo -e "${GREEN}${check_mark}${NC}"
else
  echo -e "${RED}${cross_mark}${NC} (execute: npm install)"
fi

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  📋 PRÓXIMOS PASSOS                               ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "1. 🌐 Acesse https://supabase.com e crie uma conta"
echo "2. 📝 Crie um novo projeto"
echo "3. 🔑 Copie as credenciais (Settings > API)"
echo "4. ⚙️  Edite .env com SUPABASE_URL e SUPABASE_KEY"
echo "5. 🗄️  Abra SQL Editor no Supabase Dashboard"
echo "6. 📄 Cole conteúdo de supabase-schema.sql"
echo "7. ▶️  Clique em 'Run' para executar o schema"
echo "8. 📦 Execute: npm install"
echo "9. 🚀 Execute: npm run dev"
echo "10. 🧪 Teste: curl http://localhost:3001/api/health"
echo ""
echo "📖 Para mais informações:"
echo "   - Guia detalhado: SUPABASE_SETUP.md"
echo "   - Testes da API: TESTING_GUIDE.md"
echo "   - Resumo mudanças: MIGRATION_SUMMARY.md"
echo ""
echo "✅ Se tudo passou no checklist acima, você está pronto!"
echo ""
