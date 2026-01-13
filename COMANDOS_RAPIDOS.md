# 🚀 COMANDOS RÁPIDOS - UNIVERSO DA PRATA

Este ficheiro contém todos os comandos que vais precisar.

---

## 📥 INSTALAÇÃO INICIAL

### 1. Instalar dependências do backend
```powershell
cd backend
npm install
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Verificar se está tudo configurado
```powershell
cd backend
node verificar-config.js
```

**O que faz:**
- ✅ Verifica se `.env` está correto
- ✅ Testa conexão com Supabase
- ✅ Valida estrutura de pastas
- ✅ Verifica dependências instaladas

---

## 👥 CRIAR USUÁRIOS

### 1. Criar primeiro administrador
```powershell
cd backend
node criar-admin.js
```

**Vai pedir:**
- Nome completo
- Email
- Senha (mínimo 6 caracteres)

### 2. Criar fornecedor
```powershell
cd backend
node criar-fornecedor.js
```

**Vai pedir:**
- Nome do fornecedor
- Email
- Senha
- Telefone
- Comissão padrão (%)

### 3. Criar entregador
```powershell
cd backend
node criar-entregador.js
```

**Vai pedir:**
- Nome do entregador
- Email
- Senha
- Telefone
- Tipo de veículo

---

## 🖥️ INICIAR SERVIDOR

### Modo normal
```powershell
cd backend
npm start
```

### Modo desenvolvimento (auto-restart)
```powershell
cd backend
npm run dev
```

**Servidor estará em:** http://localhost:3001

---

## 🧪 TESTAR API

### 1. Health Check (verifica se API está rodando)
**Abre no navegador:**
```
http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-08T...",
  "database": "Supabase (PostgreSQL)"
}
```

### 2. Listar endpoints disponíveis
**Abre no navegador:**
```
http://localhost:3001/api
```

---

## 🗄️ SUPABASE - EXECUTAR SQL

### No Supabase Dashboard:
1. SQL Editor → New query
2. Copia o conteúdo de cada arquivo (na ordem):

```sql
-- 1. Fornecedores
backend/fornecedores-schema.sql

-- 2. Entregadores
backend/entregadores-schema.sql

-- 3. Admin Completo
backend/admin-completo-schema.sql
```

3. Clica em RUN

---

## 📊 ACESSO AOS PAINÉIS

### Painel Admin
```
Abrir: admin-access.html
Login: Email e senha do admin criado
```

### Painel Fornecedor
```
Abrir: fornecedor/fornecedor-login.html
Login: Email e senha do fornecedor criado
```

### Painel Entregador
```
Abrir: fornecedor/entregadores/login-entregador.html
Login: Email e senha do entregador criado
```

---

## 🔍 TROUBLESHOOTING

### Problema: Porta 3001 ocupada
```powershell
# Ver quem está usando a porta
netstat -ano | findstr :3001

# Mudar porta no .env
# Edita backend/.env e muda:
PORT=3002
```

### Problema: "Cannot find module"
```powershell
# Reinstalar dependências
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problema: Erro ao conectar Supabase
```powershell
# Verificar configuração
cd backend
node verificar-config.js
```

### Limpar cache do navegador
**Console do navegador (F12):**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 📝 LOGS E DEBUG

### Ver logs do servidor
Os logs aparecem no terminal onde executaste `npm start`

### Ver logs do frontend
1. Abre a página no navegador
2. Pressiona F12
3. Vai para a aba "Console"

---

## 🗃️ BACKUP

### Fazer backup do banco de dados
No Supabase Dashboard:
1. Settings → Database
2. Clica em "Backups"
3. Clica em "Create backup"

### Fazer backup do código
```powershell
# Criar arquivo zip
Compress-Archive -Path . -DestinationPath backup-universo-prata-$(Get-Date -Format 'yyyy-MM-dd').zip
```

---

## 🔄 ATUALIZAR PROJETO

### Atualizar dependências do backend
```powershell
cd backend
npm update
```

### Verificar dependências desatualizadas
```powershell
cd backend
npm outdated
```

---

## 📦 ESTRUTURA DE PASTAS

```
Universo-Da-Prata-Site/
├── backend/
│   ├── .env                          ← Credenciais (NUNCA comitar!)
│   ├── package.json                  ← Dependências
│   ├── verificar-config.js           ← Script de verificação
│   ├── criar-admin.js                ← Criar admin
│   ├── criar-fornecedor.js           ← Criar fornecedor
│   ├── criar-entregador.js           ← Criar entregador
│   ├── src/
│   │   ├── server.js                 ← Servidor principal
│   │   ├── config/
│   │   │   ├── database.js           ← Conexão Supabase
│   │   │   └── jwt.js                ← Configuração JWT
│   │   ├── controllers/              ← Lógica de negócio
│   │   ├── routes/                   ← Rotas da API
│   │   ├── models/                   ← Modelos de dados
│   │   └── middleware/               ← Autenticação, etc
│   └── uploads/                      ← Imagens enviadas
├── scripts/
│   ├── config.js                     ← Configuração frontend ⚠️
│   ├── frontend-integration.js       ← Integração com API
│   └── ...
├── painel-admin/
│   ├── admin-completo.html           ← Painel admin
│   └── admin-backend.js              ← Chamadas à API
├── fornecedor/
│   ├── fornecedor-login.html         ← Login fornecedor
│   ├── painel-fornecedor.html        ← Painel fornecedor
│   └── entregadores/
│       ├── login-entregador.html     ← Login entregador
│       └── painel-entregador.html    ← Painel entregador
└── index.html                        ← Página inicial
```

---

## 🎯 FLUXO DE TRABALHO DIÁRIO

### 1. Iniciar desenvolvimento
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (Live Server no VS Code)
# Clica com botão direito em index.html → "Open with Live Server"
```

### 2. Fazer alterações
- Edita os arquivos
- Backend reinicia automaticamente (npm run dev)
- Frontend recarrega automaticamente (Live Server)

### 3. Testar
- Acessa os painéis
- Verifica os logs
- Usa o Console do navegador (F12)

---

## 📚 DOCUMENTAÇÃO

### Documentos do projeto:
- `TUTORIAL_SETUP_COMPLETO.md` - Setup inicial completo
- `ONDE_OBTER_CREDENCIAIS.md` - Onde copiar cada credencial
- `GUIA_INTEGRACAO_BACKEND.md` - Como o sistema funciona
- `COMANDOS_RAPIDOS.md` - Este ficheiro! 😊

### Documentação externa:
- Supabase: https://supabase.com/docs
- Express: https://expressjs.com/
- Node.js: https://nodejs.org/docs/

---

## 🎉 ATALHOS ÚTEIS

### Parar servidor (no terminal)
```
Ctrl + C
```

### Limpar terminal
```powershell
cls
```

### Ver versões instaladas
```powershell
node --version
npm --version
```

### Abrir VS Code na pasta atual
```powershell
code .
```

---

## ⚡ COMANDOS MAIS USADOS (RESUMO)

```powershell
# Setup inicial (só uma vez)
cd backend
npm install
node verificar-config.js
node criar-admin.js

# Uso diário
cd backend
npm run dev

# Criar usuários
node criar-fornecedor.js
node criar-entregador.js

# Troubleshooting
node verificar-config.js
npm install
```

---

**💡 DICA:** Guarda este ficheiro aberto enquanto trabalhas! Copia e cola os comandos conforme precisares.

**🎯 BOA SORTE COM O PROJETO!** 🚀
