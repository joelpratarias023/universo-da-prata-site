# 🚀 TUTORIAL COMPLETO - SETUP DO PROJETO (PASSO A PASSO)

**Data:** Janeiro 2026  
**Objetivo:** Fazer o backend, autenticação e site funcionarem 100%

---

## 📋 ÍNDICE

1. [Criar conta no Supabase](#1-criar-conta-no-supabase)
2. [Obter credenciais](#2-obter-credenciais-do-supabase)
3. [Criar base de dados](#3-criar-base-de-dados)
4. [Configurar Backend](#4-configurar-backend)
5. [Configurar Frontend](#5-configurar-frontend)
6. [Testar tudo](#6-testar-sistema)

---

## 1️⃣ CRIAR CONTA NO SUPABASE

### Passo 1.1: Acessar Supabase
1. Vai para: **https://supabase.com**
2. Clica em **"Start your project"** (ou "Sign Up")
3. Podes criar conta com:
   - GitHub (recomendado)
   - Email + Password

### Passo 1.2: Criar novo projeto
1. Após login, clica em **"New Project"**
2. Preenche:
   - **Name:** `universo-da-prata` (ou o nome que quiseres)
   - **Database Password:** Cria uma senha forte (GUARDA BEM!)
   - **Region:** Escolhe `Europe (Frankfurt)` (mais próximo de Angola)
   - **Pricing Plan:** FREE (suficiente para começar)
3. Clica em **"Create new project"**
4. ⏰ Aguarda 1-2 minutos (vai mostrar "Setting up project...")

---

## 2️⃣ OBTER CREDENCIAIS DO SUPABASE

### Passo 2.1: Encontrar as credenciais
1. Quando o projeto terminar de criar, verás o dashboard
2. No menu lateral, clica em **⚙️ Settings** (rodinha/engrenagem)
3. Clica em **"API"** no submenu

### Passo 2.2: Copiar as chaves

Verás uma secção chamada **"Project API keys"**. Tens 3 chaves:

#### 🔑 **anon public** (chave pública)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```
✅ Esta é SEGURA para usar no frontend (site)

#### 🔐 **service_role** (chave privada)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```
⚠️ Esta é SECRETA! Só usa no backend (nunca no site)

#### 🌐 **Project URL**
```
https://xxxxxxxxxxx.supabase.co
```

### 🚨 IMPORTANTE: Guarda estas 3 informações!
Vais precisar delas nos próximos passos. Abre o Bloco de Notas e cola:

```
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

---

## 3️⃣ CRIAR BASE DE DADOS

### Passo 3.1: Abrir SQL Editor
1. No Supabase Dashboard, clica em **🗄️ SQL Editor** no menu lateral
2. Clica em **"New query"**

### Passo 3.2: Executar os scripts SQL (NA ORDEM!)

Vais executar 3 arquivos SQL. **IMPORTANTE:** Executa na ordem correta!

#### 📄 **Script 1: Fornecedores**
1. Abre o arquivo: `backend/fornecedores-schema.sql`
2. Copia TODO o conteúdo
3. Cola no SQL Editor do Supabase
4. Clica em **RUN** (botão verde no canto inferior direito)
5. ✅ Deve aparecer "Success. No rows returned"

#### 📄 **Script 2: Entregadores**
1. Abre o arquivo: `backend/entregadores-schema.sql`
2. Copia TODO o conteúdo
3. Cola no SQL Editor do Supabase (pode criar nova query ou limpar a anterior)
4. Clica em **RUN**
5. ✅ Deve aparecer "Success. No rows returned"

#### 📄 **Script 3: Admin Completo**
1. Abre o arquivo: `backend/admin-completo-schema.sql`
2. Copia TODO o conteúdo
3. Cola no SQL Editor do Supabase
4. Clica em **RUN**
5. ✅ Deve aparecer "Success. No rows returned"

### Passo 3.3: Verificar se tabelas foram criadas
1. Clica em **🗂️ Table Editor** no menu lateral
2. Deves ver as seguintes tabelas:
   - ✅ `usuarios`
   - ✅ `produtos`
   - ✅ `categorias`
   - ✅ `pedidos`
   - ✅ `fornecedores`
   - ✅ `entregadores`
   - ✅ `entregas`
   - ✅ `pagamentos_fornecedores`
   - ✅ `pagamentos_entregadores`
   - ✅ `notificacoes`
   - ✅ `historico_admin`

Se vires todas estas tabelas, **PARABÉNS!** 🎉 A base de dados está criada!

---

## 4️⃣ CONFIGURAR BACKEND

### Passo 4.1: Criar arquivo .env

1. Vai para a pasta `backend/`
2. Cria um arquivo chamado **`.env`** (exatamente este nome, com o ponto na frente)
3. Cola este conteúdo (substitui pelas tuas credenciais):

```env
# ===================================
# SUPABASE CONFIGURATION
# ===================================
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (ANON KEY)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (SERVICE KEY)

# ===================================
# SERVER CONFIGURATION
# ===================================
PORT=3001
NODE_ENV=development
API_URL=http://localhost:3001

# ===================================
# JWT CONFIGURATION
# ===================================
# IMPORTANTE: Cria uma senha forte e única!
# Sugestão: usa este site https://www.random.org/strings/
JWT_SECRET=sua_chave_secreta_super_forte_aqui_2026
JWT_EXPIRE=7d

# ===================================
# EMAIL CONFIGURATION (Opcional)
# ===================================
# Se quiseres enviar emails de notificação:
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_aplicacao

# ===================================
# FILE UPLOAD
# ===================================
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# ===================================
# CORS (Frontend permitidos)
# ===================================
CORS_ORIGIN=http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500
```

### 🔥 INSTRUÇÕES PARA PREENCHER:

1. **SUPABASE_URL:** Cola a URL que copiaste no passo 2
2. **SUPABASE_KEY:** Cola a **anon public** key
3. **SUPABASE_SERVICE_KEY:** Cola a **service_role** key
4. **JWT_SECRET:** Cria uma senha forte (ex: `UniversoDaPrata@2026#SeguroTotal`)

### Passo 4.2: Instalar dependências

Abre o terminal na pasta `backend/` e executa:

```powershell
npm install
```

Isto vai instalar todas as bibliotecas necessárias (Supabase, Express, JWT, etc.)

### Passo 4.3: Verificar configuração

Executa o script de verificação:

```powershell
node check-installation.js
```

Se tudo estiver correto, verás:
```
✅ Supabase conectado com sucesso!
✅ JWT configurado
✅ Todas as dependências instaladas
```

---

## 5️⃣ CONFIGURAR FRONTEND

### Passo 5.1: Atualizar scripts/config.js

1. Abre o arquivo: `scripts/config.js`
2. Substitui TUDO por isto (com as tuas credenciais):

```javascript
// ===================================
// CONFIGURAÇÃO DO SUPABASE (FRONTEND)
// ===================================

// IMPORTANTE: Aqui usa apenas a ANON KEY (chave pública)
window.SUPABASE_URL = "https://xxxxxxxxxxx.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...";

// URL do Backend (deixa assim se estiveres em desenvolvimento)
window.API_URL = "http://localhost:3001/api";

console.log("✅ Configuração do Supabase carregada!");
```

### Passo 5.2: Verificar se está a carregar

1. Abre o `index.html` no navegador
2. Abre o Console (F12 → Console)
3. Deves ver: `✅ Configuração do Supabase carregada!`

---

## 6️⃣ TESTAR SISTEMA

### Teste 1: Iniciar Backend

1. Abre terminal na pasta `backend/`
2. Executa:

```powershell
npm start
```

Deves ver:
```
✅ Servidor rodando na porta 3001
✅ Banco de dados conectado
✅ API disponível em http://localhost:3001
```

### Teste 2: Testar API Health Check

Abre o navegador e vai para:
```
http://localhost:3001/api/health
```

Deves ver:
```json
{
  "status": "OK",
  "timestamp": "2026-01-08T...",
  "database": "Supabase (PostgreSQL)"
}
```

### Teste 3: Criar primeiro usuário admin

Executa este comando no terminal (dentro da pasta `backend/`):

```powershell
node criar-admin.js
```

Vai pedir:
- **Nome:** (ex: Admin Principal)
- **Email:** (ex: admin@universodaprata.com)
- **Senha:** (cria uma senha forte)

Se correr bem, verás:
```
✅ Admin criado com sucesso!
📧 Email: admin@universodaprata.com
🔑 Podes fazer login agora!
```

### Teste 4: Fazer login no painel admin

1. Abre o arquivo: `admin-access.html` no navegador
2. Faz login com o email e senha que criaste
3. Deves ser redirecionado para `painel-admin/admin-completo.html`
4. ✅ Se conseguires ver o dashboard, **TUDO FUNCIONA!** 🎉

---

## 🎯 PRÓXIMOS PASSOS

Agora que tens tudo configurado:

### 1. Criar primeiro fornecedor
```powershell
cd backend
node criar-fornecedor.js
```

### 2. Criar primeiro entregador
```powershell
cd backend
node criar-entregador.js
```

### 3. Testar fluxos completos

#### Fluxo Fornecedor:
1. Acessa `fornecedor/fornecedor-login.html`
2. Faz login com o fornecedor criado
3. Adiciona um produto
4. Vai para o painel admin
5. Aprova o produto
6. ✅ Produto aparece no site!

#### Fluxo Entregador:
1. Cria um pedido no site (como cliente)
2. No painel admin, cria uma entrega
3. Atribui ao entregador
4. Acessa `fornecedor/entregadores/login-entregador.html`
5. Faz login como entregador
6. Atualiza status da entrega
7. No painel admin, aprova a entrega
8. ✅ Sistema completo funcionando!

---

## 🆘 RESOLUÇÃO DE PROBLEMAS

### Problema: "Cannot find module '@supabase/supabase-js'"
**Solução:** Executa `npm install` na pasta `backend/`

### Problema: "SUPABASE_URL é obrigatório"
**Solução:** Verifica se criaste o arquivo `.env` corretamente

### Problema: "Token inválido ou expirado"
**Solução:** 
1. Limpa o localStorage: Console (F12) → `localStorage.clear()`
2. Faz login novamente

### Problema: Backend não inicia
**Solução:**
1. Verifica se a porta 3001 está livre
2. Tenta mudar a porta no `.env`: `PORT=3002`

### Problema: "Failed to fetch"
**Solução:**
1. Verifica se o backend está rodando (`npm start`)
2. Verifica o CORS no `.env`: adiciona teu domínio em `CORS_ORIGIN`

---

## 📞 SUPORTE

Se encontrares algum problema que não está aqui, verifica:

1. **Logs do backend:** Terminal onde executaste `npm start`
2. **Console do navegador:** F12 → Console
3. **Documentação:** Lê o `GUIA_INTEGRACAO_BACKEND.md`

---

## ✅ CHECKLIST FINAL

Marca o que já fizeste:

- [ ] Conta no Supabase criada
- [ ] Credenciais copiadas (URL, ANON_KEY, SERVICE_KEY)
- [ ] 3 scripts SQL executados
- [ ] Tabelas visíveis no Table Editor
- [ ] Arquivo `.env` criado no backend
- [ ] `npm install` executado
- [ ] `scripts/config.js` atualizado
- [ ] Backend iniciado (`npm start`)
- [ ] Health check funcionando
- [ ] Admin criado
- [ ] Login no painel admin funcionando

**Se marcaste tudo: PARABÉNS! Sistema 100% configurado! 🎉🚀**
