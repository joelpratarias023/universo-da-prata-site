# 🎯 GUIA RÁPIDO - ONDE OBTER CADA CREDENCIAL

Este documento mostra **EXATAMENTE** onde copiar cada valor necessário.

---

## 🌐 CREDENCIAIS DO SUPABASE

### 1. Aceder ao Dashboard

1. Vai para: **https://supabase.com**
2. Faz login
3. Seleciona o teu projeto `universo-da-prata`

### 2. Encontrar as Credenciais

No menu lateral, clica em: **⚙️ Settings** → **API**

Verás esta tela:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project API keys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configuration

Project URL
┌─────────────────────────────────────┐
│ https://xxyyzz.supabase.co          │ ← COPIA ISTO
└─────────────────────────────────────┘

API Keys

anon public
┌─────────────────────────────────────┐
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │ ← COPIA ISTO (chave pública)
└─────────────────────────────────────┘

service_role
┌─────────────────────────────────────┐
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │ ← COPIA ISTO (chave privada)
└─────────────────────────────────────┘
```

---

## 📝 ONDE COLAR CADA CREDENCIAL

### 🔧 BACKEND (Arquivo: `backend/.env`)

```env
# Copias o Project URL aqui ↓
SUPABASE_URL=https://xxyyzz.supabase.co

# Copias a "anon public" aqui ↓
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...

# Copias a "service_role" aqui ↓
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...

# Crias uma senha forte única ↓
JWT_SECRET=UniversoDaPrata@2026#MuitoSeguro!
```

### 🎨 FRONTEND (Arquivo: `scripts/config.js`)

```javascript
// Copias o Project URL aqui ↓
window.SUPABASE_URL = "https://xxyyzz.supabase.co";

// Copias a "anon public" aqui ↓ (NUNCA uses service_role no frontend!)
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...";
```

---

## 🔐 DIFERENÇA ENTRE AS CHAVES

### ✅ **anon public** (Chave Pública)
- **Usa em:** Frontend (site)
- **Segurança:** Pode ser exposta publicamente
- **Permissões:** Limitadas (só o que configurares nas RLS policies)
- **Exemplo de uso:** Login de clientes, ver produtos

### 🔒 **service_role** (Chave Privada)
- **Usa em:** Backend (servidor)
- **Segurança:** ⚠️ NUNCA exponhas publicamente!
- **Permissões:** Total (ignora RLS, acesso completo)
- **Exemplo de uso:** Operações de admin, criar usuários

---

## 📊 TABELA RESUMO

| Credencial | Onde Obter | Backend (.env) | Frontend (config.js) |
|------------|-----------|----------------|---------------------|
| **Project URL** | Settings → API | ✅ SUPABASE_URL | ✅ SUPABASE_URL |
| **anon public** | Settings → API | ✅ SUPABASE_KEY | ✅ SUPABASE_ANON_KEY |
| **service_role** | Settings → API | ✅ SUPABASE_SERVICE_KEY | ❌ NUNCA! |
| **JWT Secret** | Tu crias | ✅ JWT_SECRET | ❌ Não precisa |

---

## 🎬 PASSO A PASSO VISUAL

### Passo 1: Copiar Project URL
1. Settings → API
2. Procura "Project URL"
3. Clica no ícone 📋 para copiar
4. Cola em `backend/.env` → `SUPABASE_URL=...`
5. Cola em `scripts/config.js` → `window.SUPABASE_URL = "..."`

### Passo 2: Copiar anon public
1. Settings → API
2. Procura "anon public"
3. Clica no ícone 📋 para copiar
4. Cola em `backend/.env` → `SUPABASE_KEY=...`
5. Cola em `scripts/config.js` → `window.SUPABASE_ANON_KEY = "..."`

### Passo 3: Copiar service_role
1. Settings → API
2. Procura "service_role"
3. Clica no ícone 📋 para copiar
4. Cola em `backend/.env` → `SUPABASE_SERVICE_KEY=...`
5. ⚠️ **NÃO coles no frontend!**

### Passo 4: Criar JWT Secret
1. Pensa numa senha forte (mínimo 20 caracteres)
2. Exemplo: `UniversoDaPrata@2026#SuperSeguro!`
3. Cola em `backend/.env` → `JWT_SECRET=...`

---

## ✅ VERIFICAR SE ESTÁ CORRETO

### Teste 1: Valores não são placeholders
❌ **ERRADO:**
```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_KEY=COLA_AQUI_A_ANON_PUBLIC_KEY
```

✅ **CORRETO:**
```env
SUPABASE_URL=https://xxyyzz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Teste 2: Chaves começam com "eyJ"
Todas as chaves do Supabase (anon e service_role) começam com `eyJ`

✅ **CORRETO:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  
❌ **ERRADO:** `sua-chave-aqui` ou `COLA_AQUI`

### Teste 3: URLs terminam com .supabase.co
✅ **CORRETO:** `https://xxyyzz.supabase.co`  
❌ **ERRADO:** `https://supabase.com` ou `https://SEU_PROJETO.supabase.co`

---

## 🚨 SEGURANÇA - O QUE NUNCA FAZER

### ❌ NUNCA:
1. Comitar `.env` no Git/GitHub
2. Usar `service_role` no frontend
3. Partilhar `service_role` publicamente
4. Usar a mesma `JWT_SECRET` em produção e desenvolvimento

### ✅ SEMPRE:
1. Manter `.env` apenas localmente
2. Usar `anon public` no frontend
3. Usar `service_role` apenas no backend
4. Criar `JWT_SECRET` forte e única

---

## 🆘 PROBLEMAS COMUNS

### Problema: "Failed to fetch"
**Causa:** URL do Supabase incorreta  
**Solução:** Verifica se copiaste o Project URL completo

### Problema: "Invalid API key"
**Causa:** Chave anon ou service_role incorreta  
**Solução:** Copia novamente de Settings → API

### Problema: "JWT must be provided"
**Causa:** JWT_SECRET não configurado ou muito curto  
**Solução:** Cria uma senha com pelo menos 20 caracteres

---

## 📞 ONDE ENCONTRAR AJUDA

Se ainda tiveres dúvidas:

1. **Tutorial completo:** `TUTORIAL_SETUP_COMPLETO.md`
2. **Guia de integração:** `GUIA_INTEGRACAO_BACKEND.md`
3. **Documentação Supabase:** https://supabase.com/docs

---

## ✨ DICA PRO

Cria um arquivo `CREDENCIAIS_BACKUP.txt` (fora do Git) com:

```
PROJETO: Universo da Prata
DATA: Janeiro 2026

=== SUPABASE ===
URL: https://xxyyzz.supabase.co
ANON KEY: eyJhbGci...
SERVICE KEY: eyJhbGci...
DB PASSWORD: [senha do banco]

=== JWT ===
SECRET: UniversoDaPrata@2026#SuperSeguro!

=== EMAIL ===
USER: seu_email@gmail.com
APP PASSWORD: xxxx xxxx xxxx xxxx
```

Guarda este ficheiro num local SEGURO (não no projeto)!
