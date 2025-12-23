# 🚀 Guia de Deploy - Universo da Prata

## 📋 Visão Geral

Este projeto tem duas partes:
- **Frontend**: HTML, CSS, JavaScript (site principal)
- **Backend**: Node.js + Express + Supabase (API)

## 🌐 Opções de Deploy

### Opção 1: Vercel (Recomendado para Full Stack)

#### Deploy do Projeto Completo (Frontend + Backend)

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login no Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configurar variáveis de ambiente no Vercel Dashboard**
   - Acesse https://vercel.com/dashboard
   - Vá em Settings > Environment Variables
   - Adicione as variáveis do arquivo `backend/.env.example`:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `JWT_SECRET`
     - `PORT`
     - etc.

5. **Deploy para produção**
   ```bash
   vercel --prod
   ```

---

### Opção 2: Netlify (Frontend) + Render/Railway (Backend)

#### A. Deploy do Frontend no Netlify

1. **Instalar Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login no Netlify**
   ```bash
   netlify login
   ```

3. **Inicializar o projeto**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

#### B. Deploy do Backend no Render

1. **Acesse** https://render.com e faça login
2. **Criar novo Web Service**
3. **Conectar repositório** GitHub
4. **Configurações**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`
5. **Adicionar variáveis de ambiente** (do arquivo `.env.example`)
6. **Deploy**

---

### Opção 3: GitHub Pages (Frontend) + Supabase (Backend)

#### A. Frontend no GitHub Pages

1. **Ativar GitHub Pages**
   - Vá nas Settings do repositório
   - Em Pages, selecione branch `main` e pasta `root`
   - Salvar

2. **Acessar o site**
   - Estará disponível em: `https://joelpratarias023.github.io/universo-da-prata-site/`

#### B. Backend - Usar apenas Supabase

O backend já está configurado para Supabase. Você pode:
1. Criar projeto no Supabase
2. Importar o schema: `backend/supabase-schema.sql`
3. Configurar as variáveis de ambiente no frontend

---

## 🔧 Configuração de Variáveis de Ambiente

### Backend (.env)

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRE=7d
PORT=3001
NODE_ENV=production
```

### Frontend (scripts/config.js)

```javascript
const API_URL = 'https://seu-backend.vercel.app/api';
// ou
const API_URL = 'https://seu-backend.onrender.com/api';
```

---

## 📝 Checklist Antes do Deploy

- [ ] `.gitignore` criado e configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend testado localmente (`npm run dev`)
- [ ] Frontend testado localmente
- [ ] Banco de dados Supabase criado e configurado
- [ ] URLs de API atualizadas no frontend
- [ ] Commit e push para GitHub

---

## 🚀 Deploy Rápido (Método Recomendado)

### 1. Push para GitHub
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Deploy no Vercel
```bash
vercel --prod
```

### 3. Configurar Supabase
1. Crie conta em https://supabase.com
2. Crie novo projeto
3. Execute o SQL: `backend/supabase-schema.sql`
4. Copie as credenciais
5. Adicione no Vercel Dashboard

---

## 🔗 URLs Após Deploy

- **Frontend**: `https://universo-da-prata-site.vercel.app`
- **Backend API**: `https://universo-da-prata-site.vercel.app/api`
- **Supabase**: `https://seu-projeto.supabase.co`

---

## 🆘 Troubleshooting

### Erro: "Module not found"
- Certifique-se de ter feito `npm install` no backend
- Verifique se o `package.json` está correto

### Erro: "Cannot connect to database"
- Verifique as variáveis `SUPABASE_URL` e `SUPABASE_KEY`
- Confirme que o schema foi importado no Supabase

### Erro: CORS
- Adicione o domínio do frontend nas configurações do backend
- No Vercel, configure CORS_ORIGIN corretamente

---

## 📞 Suporte

Para mais informações, consulte:
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Netlify](https://docs.netlify.com)
- [Documentação Render](https://render.com/docs)
- [Documentação Supabase](https://supabase.com/docs)

---

**Versão**: 1.0.0  
**Data**: Dezembro 2025
