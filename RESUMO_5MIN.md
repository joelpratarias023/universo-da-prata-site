# 📌 RESUMO SUPER RÁPIDO - 5 MINUTOS

Se já tens experiência e só precisas de um lembrete rápido:

---

## ⚡ SETUP EM 5 PASSOS

### 1️⃣ SUPABASE (2 min)
```
1. https://supabase.com → Sign Up
2. New Project → "universo-da-prata"
3. Settings → API → Copia:
   - Project URL
   - anon public key
   - service_role key
```

### 2️⃣ BACKEND CONFIG (1 min)
```
Edita: backend/.env

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ... (anon)
SUPABASE_SERVICE_KEY=eyJ... (service)
JWT_SECRET=SenhaForte123!
```

### 3️⃣ FRONTEND CONFIG (30 seg)
```
Edita: scripts/config.js

window.SUPABASE_URL = "https://xxx.supabase.co";
window.SUPABASE_ANON_KEY = "eyJ...";
```

### 4️⃣ DATABASE (1 min)
```
Supabase → SQL Editor → Run (na ordem):
1. backend/fornecedores-schema.sql
2. backend/entregadores-schema.sql  
3. backend/admin-completo-schema.sql
```

### 5️⃣ INSTALAR & TESTAR (30 seg)
```powershell
cd backend
npm install
node criar-admin.js
npm start
```

---

## 🎯 TESTAR SE FUNCIONA

```powershell
# Terminal 1
cd backend
npm start

# Terminal 2 OU Navegador
http://localhost:3001/api/health
```

Deve retornar:
```json
{"status": "OK", "database": "Supabase"}
```

---

## 📂 ARQUIVOS IMPORTANTES

```
backend/.env               ← Credenciais backend
scripts/config.js          ← Credenciais frontend
backend/src/server.js      ← Servidor
```

---

## 🚀 COMANDOS DIÁRIOS

```powershell
cd backend
npm start           # Iniciar servidor
node criar-admin.js # Criar admin
```

---

## 🆘 PROBLEMAS?

### Erro: "SUPABASE_URL obrigatório"
→ Verifica `backend/.env`

### Erro: "Token inválido"
→ Verifica `scripts/config.js`

### Erro: "Cannot find module"
→ `cd backend && npm install`

### Erro: "Failed to fetch"
→ Backend não está rodando (`npm start`)

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para tutorial detalhado: **[TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md)**

---

**✅ PRONTO! Sistema configurado em 5 minutos!** 🎉
