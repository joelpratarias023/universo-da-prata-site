# ❓ PERGUNTAS FREQUENTES (FAQ)

Respostas para as dúvidas mais comuns.

---

## 🎯 CONFIGURAÇÃO INICIAL

### P: Nunca usei Supabase. É difícil?
**R:** Não! É super simples:
1. Crias conta (grátis)
2. Crias projeto
3. Copias 3 valores (URL e 2 chaves)
4. Colas no `.env`

Leva menos de 5 minutos. Segue: [TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md)

---

### P: Onde encontro as credenciais do Supabase?
**R:** Supabase Dashboard → Settings → API

Detalhes completos em: [ONDE_OBTER_CREDENCIAIS.md](ONDE_OBTER_CREDENCIAIS.md)

---

### P: Qual a diferença entre `anon` e `service_role`?
**R:**
- **anon** = Chave pública (usa no frontend, site)
- **service_role** = Chave privada (usa no backend, NUNCA no site)

---

### P: Preciso de cartão de crédito para usar Supabase?
**R:** NÃO! O plano gratuito não pede cartão. Tens:
- 500 MB de banco de dados
- 1 GB de armazenamento
- 2 GB de transferência/mês
- Suficiente para desenvolver e testar!

---

## 🔧 INSTALAÇÃO

### P: Não tenho Node.js instalado. Como instalo?
**R:** 
1. Vai para: https://nodejs.org
2. Baixa a versão LTS (recomendada)
3. Instala normalmente
4. Verifica: `node --version` no terminal

---

### P: O comando `npm install` dá erro. O que fazer?
**R:** Tenta na ordem:
```powershell
# 1. Atualizar npm
npm install -g npm@latest

# 2. Limpar cache
npm cache clean --force

# 3. Apagar node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### P: "Cannot find module '@supabase/supabase-js'"
**R:** Esqueceste de executar `npm install` na pasta `backend/`:
```powershell
cd backend
npm install
```

---

## 🗄️ BANCO DE DADOS

### P: Como executo os scripts SQL?
**R:**
1. Supabase Dashboard → SQL Editor → New query
2. Copia TODO conteúdo do arquivo `.sql`
3. Cola no editor
4. Clica RUN
5. Repete para os 3 arquivos (na ordem)

---

### P: Qual ordem executar os SQL?
**R:** EXATAMENTE nesta ordem:
1. `fornecedores-schema.sql`
2. `entregadores-schema.sql`
3. `admin-completo-schema.sql`

---

### P: Posso executar tudo de uma vez?
**R:** Tecnicamente sim, mas NÃO recomendado. Executa um por um para ver se há erros.

---

### P: Como sei se as tabelas foram criadas?
**R:** Supabase Dashboard → Table Editor → Deves ver todas as tabelas listadas.

---

## 🚀 SERVIDOR

### P: Como inicio o servidor?
**R:**
```powershell
cd backend
npm start
```

---

### P: Servidor não inicia. O que fazer?
**R:** Verifica:
1. `.env` existe e está preenchido?
2. Executaste `npm install`?
3. Porta 3001 está livre?

Usa: `node verificar-config.js` para diagnosticar.

---

### P: "Port 3001 is already in use"
**R:** Opção 1 - Muda a porta no `.env`:
```env
PORT=3002
```

Opção 2 - Mata o processo:
```powershell
netstat -ano | findstr :3001
# Anota o PID (último número)
taskkill /PID [numero] /F
```

---

### P: Como paro o servidor?
**R:** No terminal onde está rodando: `Ctrl + C`

---

## 👤 USUÁRIOS

### P: Como crio o primeiro admin?
**R:**
```powershell
cd backend
node criar-admin.js
```

---

### P: Esqueci a senha do admin. Como recupero?
**R:** Opções:
1. Cria novo admin com `node criar-admin.js` (email diferente)
2. Reseta senha direto no Supabase (Table Editor → usuarios → edita senha_hash)

---

### P: Como crio fornecedor e entregador?
**R:**
```powershell
# Fornecedor
node criar-fornecedor.js

# Entregador
node criar-entregador.js
```

---

### P: Posso ter múltiplos admins?
**R:** SIM! Executa `node criar-admin.js` quantas vezes quiseres.

---

## 🔐 AUTENTICAÇÃO

### P: Como funciona o login?
**R:** 
1. Frontend envia email+senha para API
2. Backend verifica no banco
3. Se OK, gera token JWT
4. Frontend guarda token no localStorage
5. Todas requisições seguintes incluem o token

---

### P: "Token inválido ou expirado"
**R:**
```javascript
// Console do navegador (F12):
localStorage.clear();
location.reload();
// Depois faz login novamente
```

---

### P: Quanto tempo o token dura?
**R:** 7 dias (configurado no `.env` como `JWT_EXPIRE=7d`)

---

### P: Posso mudar a duração do token?
**R:** SIM! No `backend/.env`:
```env
JWT_EXPIRE=24h   # 24 horas
JWT_EXPIRE=30d   # 30 dias
JWT_EXPIRE=1y    # 1 ano
```

---

## 🎨 FRONTEND

### P: Como abro o site?
**R:** 
- Clica duas vezes em `index.html`
- OU instala Live Server no VS Code

---

### P: Live Server não funciona. Alternativa?
**R:** Usa Python:
```powershell
# Python 3
python -m http.server 8000

# Ou simplesmente abre index.html no Chrome/Firefox
```

---

### P: Produtos não aparecem no site
**R:** Verifica:
1. Backend está rodando? (`npm start`)
2. `scripts/config.js` tem as credenciais corretas?
3. Produtos têm `status='ativo'` no banco?

---

### P: "Failed to fetch" no console
**R:** Backend não está rodando. Executa:
```powershell
cd backend
npm start
```

---

## 📊 PAINÉIS

### P: Não consigo entrar no painel admin
**R:** Verifica:
1. Criaste um admin? (`node criar-admin.js`)
2. Email e senha corretos?
3. Console do navegador (F12) mostra algum erro?

---

### P: Painel admin carrega mas está vazio
**R:**
1. Abre F12 → Console
2. Procura erros
3. Provavelmente problema de CORS ou backend não rodando

---

### P: Fornecedor não vê produtos dele
**R:** 
1. Fornecedor adicionou produtos?
2. Produtos têm `fornecedor_id` correto no banco?
3. Backend está rodando?

---

## 💰 PAGAMENTOS

### P: Como funcionam os pagamentos?
**R:**
1. Admin escolhe período e fornecedor
2. Sistema calcula automaticamente:
   - Vendas do período
   - Comissão da plataforma
   - Valor líquido
3. Admin aprova e processa

---

### P: Posso mudar a taxa de comissão?
**R:** SIM! Cada fornecedor tem sua taxa individual. Define no painel admin ou direto no banco.

---

## 🔍 DEBUGGING

### P: Como vejo os erros?
**R:**
- **Backend:** Terminal onde executaste `npm start`
- **Frontend:** Console do navegador (F12 → Console)

---

### P: Como verifico se está tudo OK?
**R:**
```powershell
cd backend
node verificar-config.js
```

---

### P: Quero ver o que está acontecendo na API
**R:** Instala Postman ou Insomnia e testa os endpoints:
```
GET http://localhost:3001/api/health
GET http://localhost:3001/api/produtos
POST http://localhost:3001/api/auth/login
```

---

## 📱 MOBILE

### P: O painel funciona em celular?
**R:** 
- **Painel Admin:** Desktop only (muitas funcionalidades)
- **Painel Fornecedor:** Funciona em mobile, mas melhor em desktop
- **Painel Entregador:** 100% otimizado para mobile! 📱

---

### P: Como entregadores acessam de fora?
**R:** Precisas fazer deploy (hospedar):
- Backend: Heroku, Railway, Render
- Frontend: Netlify, Vercel, GitHub Pages

---

## 🚚 DEPLOY/PRODUÇÃO

### P: Como coloco online?
**R:** Isso é um tópico grande. Basicamente:
1. Backend: Deploy no Heroku/Railway
2. Frontend: Deploy no Netlify/Vercel
3. Atualiza URLs e CORS

Tutorial de deploy não incluído (fora do escopo).

---

### P: Posso usar em produção?
**R:** SIM, mas antes:
- ✅ Muda todas as senhas/secrets
- ✅ Configura HTTPS
- ✅ Ajusta CORS para domínio real
- ✅ Backup regular do banco
- ✅ Monitora logs e erros

---

## 🔒 SEGURANÇA

### P: É seguro?
**R:** SIM! O sistema usa:
- Senhas criptografadas (bcrypt)
- Tokens JWT
- CORS configurado
- Validação de dados

---

### P: Posso commitar .env no Git?
**R:** **NUNCA!** O `.env` tem credenciais secretas. Já está no `.gitignore`.

---

### P: Alguém pode ver minha service_role key?
**R:** Só se estiver no backend. NUNCA usa service_role no frontend!

---

## 📚 APRENDIZADO

### P: Não entendo nada de programação. Consigo usar?
**R:** Para USAR o sistema pronto: SIM (segue o tutorial)  
Para DESENVOLVER/MODIFICAR: Precisas aprender JavaScript, Node.js, etc.

---

### P: Onde aprendo mais?
**R:**
- Node.js: https://nodejs.dev/learn
- Express: https://expressjs.com/
- Supabase: https://supabase.com/docs
- JavaScript: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript

---

### P: Posso modificar o código?
**R:** CLARO! É o teu projeto. Modifica à vontade!

---

## 🆘 AINDA COM PROBLEMAS?

### P: Li tudo e ainda não funciona!
**R:** Faz checklist:

```powershell
# 1. Verificar Node.js
node --version  # Deve mostrar v18+ ou v20+

# 2. Verificar instalação
cd backend
npm install

# 3. Verificar configuração
node verificar-config.js

# 4. Ver logs detalhados
npm start
# Lê TUDO que aparece no terminal

# 5. Frontend
# Abre index.html → F12 → Console
# Lê os erros
```

---

### P: Onde peço ajuda?
**R:** 
1. Relê a documentação (90% das dúvidas estão aqui)
2. Verifica logs (backend terminal + frontend console)
3. Google o erro exato (copia e cola)
4. Stack Overflow

---

## 💡 DICAS ÚTEIS

### Dica 1: Sempre verifica os logs
Erros sempre aparecem nos logs. Não ignores!

### Dica 2: Usa verificar-config.js
Antes de iniciar, sempre executa:
```powershell
node verificar-config.js
```

### Dica 3: Console é teu amigo
F12 → Console mostra TODOS os erros do frontend.

### Dica 4: Guarda backup do .env
Cria `CREDENCIAIS_BACKUP.txt` num local seguro (fora do projeto).

### Dica 5: Testa aos poucos
Não testes tudo de uma vez. Vai passo a passo:
1. Backend inicia? ✅
2. Health check funciona? ✅
3. Login funciona? ✅
4. etc...

---

## 🎉 AINDA TEM DÚVIDAS?

Consulta os outros documentos:

- 🚀 [TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md) - Setup passo a passo
- 🔑 [ONDE_OBTER_CREDENCIAIS.md](ONDE_OBTER_CREDENCIAIS.md) - Credenciais
- ⚡ [COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md) - Comandos úteis
- 🎨 [FLUXO_VISUAL.md](FLUXO_VISUAL.md) - Como funciona
- 🏁 [COMECA_AQUI.md](COMECA_AQUI.md) - Início

**Boa sorte! 🍀**
