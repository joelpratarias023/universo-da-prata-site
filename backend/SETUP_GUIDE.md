# 🎯 GUIA DE SETUP COMPLETO - Backend Universo da Prata

## 📋 Sumário
1. [Requisitos](#requisitos)
2. [Instalação Passo a Passo](#instalação-passo-a-passo)
3. [Configuração do MySQL](#configuração-do-mysql)
4. [Testes da API](#testes-da-api)
5. [Solução de Problemas](#solução-de-problemas)

---

## ✅ Requisitos

### Sistema
- Windows 10+, macOS ou Linux
- 500 MB de espaço em disco
- Conexão com internet (para npm install)

### Software Obrigatório
- **Node.js 14+** → [Download](https://nodejs.org/)
- **MySQL 5.7+** → [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (opcional) → [Download](https://git-scm.com/)

### Software Recomendado
- **Visual Studio Code** → [Download](https://code.visualstudio.com/)
- **Postman** (testar API) → [Download](https://www.postman.com/downloads/)
- **MySQL Workbench** → [Download](https://dev.mysql.com/downloads/workbench/)

---

## 🚀 Instalação Passo a Passo

### Passo 1: Verificar Instalações

#### Windows (PowerShell)
```powershell
node --version
npm --version
mysql --version
```

#### Linux/Mac (Terminal)
```bash
node --version
npm --version
mysql --version
```

Você deverá ver algo como:
```
v18.0.0
8.0.0
mysql Ver 8.0.28
```

### Passo 2: Clonar ou Entrar no Diretório

```bash
cd backend
```

### Passo 3: Executar Script de Instalação

#### Windows
```powershell
.\install.bat
```

#### Linux/Mac
```bash
bash install.sh
```

Isso vai:
- ✅ Verificar Node.js
- ✅ Instalar dependências npm
- ✅ Criar arquivo .env

### Passo 4: Configurar .env

Abra o arquivo `backend/.env` com seu editor:

```env
# DATABASE
DB_HOST=localhost
DB_PORT=3306
DB_NAME=universo_prata
DB_USER=root
DB_PASSWORD=sua_senha_aqui

# SERVER
PORT=3001
NODE_ENV=development
API_URL=http://localhost:3001

# JWT
JWT_SECRET=chave_secreta_muito_segura_2025_universo_prata
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5500,http://localhost:8000
```

**⚠️ Importante:** 
- Altere `DB_PASSWORD` com sua senha MySQL
- `JWT_SECRET` deve ser único e seguro em produção
- Em desenvolvimento, pode usar os valores padrão

---

## 🗄️ Configuração do MySQL

### Método 1: Usando MySQL Command Line

#### 1. Abrir MySQL
```bash
mysql -u root -p
```
Digite sua senha quando solicitado.

#### 2. Criar Banco e Importar
```sql
CREATE DATABASE universo_prata;
USE universo_prata;
SOURCE C:/caminho/para/backend/database.sql;
```

#### 3. Verificar Tabelas
```sql
SHOW TABLES;
```

Você deverá ver:
```
+-----------------------+
| Tables_in_universo_prata |
+-----------------------+
| usuarios              |
| enderecos            |
| categorias           |
| produtos             |
| pedidos              |
| itens_pedido         |
| avaliacoes           |
+-----------------------+
```

### Método 2: Usando MySQL Workbench

1. Abra MySQL Workbench
2. Clique em "File" → "Open SQL Script"
3. Selecione `backend/database.sql`
4. Clique em "⚡ Execute All" ou pressione Ctrl+Shift+Enter
5. Verifique em "Schemas" → "universo_prata" → "Tables"

### Método 3: Usando Linha de Comando (Windows)

```powershell
cd backend
mysql -u root -p < database.sql
```

---

## ✨ Iniciando o Servidor

### Modo Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

### Saída Esperada
```
✅ Conectado ao MySQL com sucesso!
📊 Criando tabelas do banco de dados...
✅ Tabela usuarios criada
✅ Tabela enderecos criada
✅ Tabela categorias criada
✅ Tabela produtos criada
✅ Tabela pedidos criada
✅ Tabela itens_pedido criada
✅ Tabela avaliacoes criada
✅ Todas as tabelas foram criadas com sucesso!

╔════════════════════════════════════════════╗
║  🚀 Servidor rodando com sucesso!          ║
║  📡 Porta: 3001                            ║
║  🌐 URL: http://localhost:3001             ║
║  📚 API Docs: http://localhost:3001/api    ║
╚════════════════════════════════════════════╝
```

---

## 🧪 Testes da API

### Teste 1: Health Check

#### Curl
```bash
curl http://localhost:3001/api/health
```

#### Resultado Esperado
```json
{
  "status": "OK",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

### Teste 2: Listar Categorias

#### Curl
```bash
curl http://localhost:3001/api/categorias
```

#### Resultado Esperado
```json
{
  "sucesso": true,
  "mensagem": "Categorias recuperadas",
  "dados": [
    {
      "id": 1,
      "uuid": "cat-uuid-1",
      "nome": "Broches",
      "descricao": "Broches de prata e ouro",
      "ordem": 1,
      "ativa": true
    },
    ...
  ],
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

### Teste 3: Registrar Usuário

#### Curl
```bash
curl -X POST http://localhost:3001/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste User",
    "email": "teste@email.com",
    "cpf": "12345678900",
    "telefone": "+244912345678",
    "senha": "Senha123!",
    "confirmar_senha": "Senha123!"
  }'
```

### Teste 4: Fazer Login

#### Curl
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "senha": "Senha123!"
  }'
```

#### Resultado Esperado
```json
{
  "sucesso": true,
  "mensagem": "Logado com sucesso",
  "dados": {
    "usuario": {
      "id": 1,
      "uuid": "user-uuid",
      "nome": "Teste User",
      "email": "teste@email.com",
      "tipo": "cliente"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

**Copie o token para usar em requests autenticados!**

### Teste 5: Acessar Rota Protegida

```bash
# Substitua TOKEN_AQUI pelo token obtido acima
curl -H "Authorization: Bearer TOKEN_AQUI" \
  http://localhost:3001/api/auth/perfil
```

### Usando Postman

1. Abra o Postman
2. Crie nova requisição:
   - **Método:** POST
   - **URL:** http://localhost:3001/api/auth/login
   - **Body** (JSON):
     ```json
     {
       "email": "teste@email.com",
       "senha": "Senha123!"
     }
     ```
3. Clique em "Send"
4. Copie o token da resposta
5. Em nova requisição, vá para a aba "Headers"
6. Adicione:
   - **Key:** Authorization
   - **Value:** Bearer SEU_TOKEN_AQUI

---

## 🐛 Solução de Problemas

### ❌ "ECONNREFUSED" - MySQL não está conectando

**Causa:** MySQL não está rodando

**Solução:**
```bash
# Windows
net start MySQL80

# Linux
sudo service mysql start

# Mac
brew services start mysql
```

### ❌ "Error: Access denied for user 'root'@'localhost'"

**Causa:** Senha do MySQL está incorreta

**Solução:**
1. Verifique a senha em `.env`
2. Resete a senha:
   ```bash
   mysql -u root -p
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'sua_nova_senha';
   FLUSH PRIVILEGES;
   ```

### ❌ "Port 3001 is already in use"

**Causa:** Outra aplicação está usando a porta 3001

**Solução:**
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# Linux/Mac
lsof -i :3001
kill -9 PID
```

Ou altere a porta em `.env`:
```env
PORT=3002
```

### ❌ "Cannot find module 'express'"

**Causa:** Dependências não foram instaladas

**Solução:**
```bash
cd backend
npm install
```

### ❌ "database.sql: No such file"

**Causa:** Está em diretório errado

**Solução:**
```bash
# Certifique-se de estar em: backend/
ls database.sql
# Se não aparecer, copie o arquivo para backend/
```

### ❌ Token expirado ou inválido

**Causa:** JWT expirou ou está corrompido

**Solução:**
1. Faça login novamente
2. Copie o novo token
3. Use o novo token nas requisições

### ❌ CORS bloqueando requisições

**Causa:** Frontend está em origem diferente

**Solução:** Edite `.env`:
```env
CORS_ORIGIN=http://seu-frontend:porta,http://localhost:5500
```

---

## 📊 Estrutura de Pastas Criada

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── ProdutoController.js
│   │   ├── CategoriaController.js
│   │   ├── PedidoController.js
│   │   ├── EnderecoController.js
│   │   └── AvaliacaoController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Produto.js
│   │   ├── Categoria.js
│   │   ├── Pedido.js
│   │   ├── Endereco.js
│   │   ├── ItensPedido.js
│   │   └── Avaliacao.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── produtos.js
│   │   ├── categorias.js
│   │   ├── pedidos.js
│   │   ├── enderecos.js
│   │   └── avaliacoes.js
│   ├── utils/
│   │   ├── validacoes.js
│   │   └── respostas.js
│   └── server.js
├── node_modules/ (criado pelo npm install)
├── .env (criado durante setup)
├── .env.example
├── package.json
├── package-lock.json
├── database.sql
├── README.md
├── API_DOCUMENTATION.md
├── frontend-integration.js
├── install.sh
└── install.bat
```

---

## ✅ Checklist Final

- [ ] Node.js instalado (`node --version`)
- [ ] MySQL instalado e rodando
- [ ] Dependências npm instaladas (`npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Banco de dados criado (`database.sql` importado)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] API respondendo em `http://localhost:3001/api`
- [ ] Teste de registro funcionando
- [ ] Teste de login funcionando
- [ ] Token JWT sendo gerado

---

## 📞 Próximos Passos

1. **Integrar com Frontend:**
   - Copie `frontend-integration.js` para seu projeto
   - Use as funções para chamar a API

2. **Adicionar Dados de Teste:**
   - Use o `insert.sql` para adicionar produtos/categorias

3. **Configurar CORS:**
   - Edite `.env` com URL do frontend

4. **Deploy:**
   - Escolha plataforma (Heroku, AWS, DigitalOcean)
   - Siga guia de deploy específico

---

**Parabéns! Seu backend está pronto! 🎉**

Para dúvidas, consulte:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [README.md](./README.md)
