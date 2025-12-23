@echo off
REM ========================================
REM Script de Instalação do Backend
REM Universo da Prata (Windows)
REM ========================================

echo.
echo ╔════════════════════════════════════════════╗
echo ║ 🚀 Instalação do Backend - Universo da Prata
echo ║ Windows Edition
echo ╚════════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js primeiro.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js encontrado: %NODE_VERSION%
echo ✅ NPM encontrado: %NPM_VERSION%
echo.

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

if %errorlevel% equ 0 (
    echo ✅ Dependências instaladas com sucesso!
) else (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo.

REM Criar arquivo .env
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy .env.example .env
    echo ✅ Arquivo .env criado. Edite com suas credenciais
) else (
    echo ✅ Arquivo .env já existe
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║ ✅ Instalação Completa!                   ║
echo ╚════════════════════════════════════════════╝
echo.
echo 📌 Próximos Passos:
echo.
echo 1. Configure o banco de dados MySQL:
echo    mysql -u root -p < database.sql
echo.
echo 2. Edite o arquivo .env com suas credenciais
echo.
echo 3. Inicie o servidor:
echo    npm run dev
echo.
echo 4. Teste a API:
echo    curl http://localhost:3001/api
echo.
pause
