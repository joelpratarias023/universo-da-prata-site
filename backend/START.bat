@echo off
echo ============================================
echo  Iniciando Backend - Painel do Fornecedor
echo ============================================
echo.

cd backend

echo [1/2] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
) else (
    echo Dependencias ja instaladas!
)

echo.
echo [2/2] Iniciando servidor...
echo.
echo Backend rodando em: http://localhost:3001
echo API disponivel em: http://localhost:3001/api
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm start
