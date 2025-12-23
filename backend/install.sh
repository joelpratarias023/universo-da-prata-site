#!/bin/bash

# ========================================
# Script de Instalação do Backend
# Universo da Prata
# ========================================

echo "╔════════════════════════════════════════════╗"
echo "║ 🚀 Instalação do Backend - Universo da Prata║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ NPM encontrado: $(npm --version)"
echo ""

# Entrar no diretório backend
cd "$(dirname "$0")"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""

# Criar arquivo .env
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Edite com suas credenciais:"
    echo "   nano .env  (Linux/Mac)"
    echo "   notepad .env  (Windows)"
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║ ✅ Instalação Completa!                   ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📌 Próximos Passos:"
echo ""
echo "1. Configure o banco de dados MySQL:"
echo "   mysql -u root -p < database.sql"
echo ""
echo "2. Edite o arquivo .env com suas credenciais:"
echo "   DB_HOST=localhost"
echo "   DB_USER=root"
echo "   DB_PASSWORD=sua_senha"
echo ""
echo "3. Inicie o servidor:"
echo "   npm run dev"
echo ""
echo "4. Teste a API:"
echo "   curl http://localhost:3001/api"
echo ""
