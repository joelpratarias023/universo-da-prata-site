# 🌟 UNIVERSO DA PRATA - E-COMMERCE COMPLETO

Sistema completo de e-commerce para joalharia com painel administrativo, gestão de fornecedores e entregadores.

---

## 📚 DOCUMENTAÇÃO COMPLETA

### 🚀 **COMEÇAR AQUI**

Se és novo no projeto, lê na seguinte ordem:

1. **[TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md)** ⭐  
   👉 **COMEÇA AQUI!** Guia completo passo a passo para configurar tudo do zero.
   - Criar conta no Supabase
   - Obter credenciais
   - Configurar backend e frontend
   - Testar sistema

2. **[ONDE_OBTER_CREDENCIAIS.md](ONDE_OBTER_CREDENCIAIS.md)** 🔑  
   Mostra EXATAMENTE onde copiar cada credencial (com imagens explicativas).

3. **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)** ⚡  
   Todos os comandos que vais precisar (copia e cola).

4. **[GUIA_INTEGRACAO_BACKEND.md](GUIA_INTEGRACAO_BACKEND.md)** 🔧  
   Como o sistema funciona internamente (lógica de negócio).

---

## ⚡ QUICK START (Para Iniciantes)

### Passo 1: Instalar Node.js
- Vai para: https://nodejs.org
- Baixa e instala a versão LTS

### Passo 2: Clonar/Baixar o projeto
```powershell
# Se tens Git instalado:
git clone [url-do-repositorio]

# OU baixa o ZIP e extrai
```

### Passo 3: Seguir o tutorial
Abre e segue: **[TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md)**

---

## 🎯 O QUE ESTE SISTEMA FAZ?

### 👥 **Para Clientes**
- ✅ Navegar produtos por categorias
- ✅ Adicionar ao carrinho
- ✅ Fazer pedidos via WhatsApp ou site
- ✅ Criar conta e acompanhar pedidos

### 👨‍💼 **Para Administradores**
- ✅ Aprovar/rejeitar produtos de fornecedores
- ✅ Criar e gerir entregas
- ✅ Aprovar entregas concluídas
- ✅ Gerar e processar pagamentos
- ✅ Ver estatísticas e dashboard
- ✅ Gerir fornecedores e entregadores

### 🏭 **Para Fornecedores**
- ✅ Login individual
- ✅ Adicionar produtos próprios
- ✅ Ver status de aprovação
- ✅ Receber notificações
- ✅ Ver relatórios de vendas

### 🚚 **Para Entregadores**
- ✅ Login mobile-friendly
- ✅ Ver entregas atribuídas
- ✅ Atualizar status (em trânsito, concluída)
- ✅ Receber notificações
- ✅ Ver comissões

---

## 🛠️ TECNOLOGIAS USADAS

### Backend
- **Node.js** + **Express** - Servidor
- **Supabase** - Banco de dados (PostgreSQL)
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas

### Frontend
- **HTML5** + **CSS3** + **JavaScript**
- **Supabase Client** - Autenticação frontend
- **Fetch API** - Comunicação com backend

---

## 📁 ESTRUTURA DO PROJETO

```
Universo-Da-Prata-Site/
│
├── 📄 TUTORIAL_SETUP_COMPLETO.md      ← COMEÇA AQUI!
├── 📄 ONDE_OBTER_CREDENCIAIS.md       ← Guia de credenciais
├── 📄 COMANDOS_RAPIDOS.md             ← Comandos úteis
├── 📄 GUIA_INTEGRACAO_BACKEND.md      ← Lógica do sistema
│
├── backend/                            ← Servidor e API
│   ├── .env                            ← Credenciais (criar!)
│   ├── package.json
│   ├── verificar-config.js             ← Verificar setup
│   ├── criar-admin.js                  ← Criar admin
│   ├── criar-fornecedor.js             ← Criar fornecedor
│   ├── criar-entregador.js             ← Criar entregador
│   ├── fornecedores-schema.sql         ← SQL 1/3
│   ├── entregadores-schema.sql         ← SQL 2/3
│   ├── admin-completo-schema.sql       ← SQL 3/3
│   └── src/
│       ├── server.js                   ← Servidor principal
│       ├── config/                     ← Configurações
│       ├── controllers/                ← Lógica de negócio
│       ├── routes/                     ← Rotas da API
│       ├── models/                     ← Modelos de dados
│       └── middleware/                 ← Autenticação
│
├── scripts/                            ← Scripts do frontend
│   ├── config.js                       ← Configurar Supabase!
│   ├── frontend-integration.js         ← Integração com API
│   ├── auth.js                         ← Autenticação
│   ├── carrinho.js                     ← Carrinho de compras
│   └── ...
│
├── painel-admin/                       ← Painel administrativo
│   ├── admin-completo.html
│   ├── admin-backend.js
│   └── admin.js
│
├── fornecedor/                         ← Painel de fornecedores
│   ├── fornecedor-login.html
│   ├── painel-fornecedor.html
│   └── entregadores/                   ← Painel de entregadores
│       ├── login-entregador.html
│       └── painel-entregador.html
│
├── index.html                          ← Página inicial
├── categorias.html                     ← Categorias
├── produto.html                        ← Detalhes do produto
├── carrinho.html                       ← Carrinho
├── admin-access.html                   ← Login admin
└── css/                                ← Estilos
```

---

## 🎓 TUTORIAIS E GUIAS

### 📘 Tutoriais Principais

| Documento | Descrição | Para Quem |
|-----------|-----------|-----------|
| [TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md) | Setup inicial completo | 🔰 Iniciantes |
| [ONDE_OBTER_CREDENCIAIS.md](ONDE_OBTER_CREDENCIAIS.md) | Onde copiar cada credencial | 🔰 Iniciantes |
| [COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md) | Comandos do dia-a-dia | ⚡ Todos |
| [GUIA_INTEGRACAO_BACKEND.md](GUIA_INTEGRACAO_BACKEND.md) | Como o sistema funciona | 🔧 Desenvolvedores |

### 📗 Documentação Técnica (backend/)

| Documento | Descrição |
|-----------|-----------|
| [backend/README.md](backend/README.md) | Documentação do backend |
| [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) | Endpoints da API |
| [backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md) | Setup do Supabase |

---

## ✅ CHECKLIST DE SETUP

Marca o que já fizeste:

### Configuração Inicial
- [x] Node.js instalado
- [ ] Projeto baixado/clonado
- [x] Conta no Supabase criada
- [ ] Credenciais copiadas

### Backend
- [ ] `npm install` executado em `backend/`
- [ ] Arquivo `backend/.env` criado e preenchido
- [ ] 3 scripts SQL executados no Supabase
- [ ] `node verificar-config.js` passou
- [ ] Admin criado com `node criar-admin.js`
- [ ] Backend iniciado com `npm start`

### Frontend
- [ ] `scripts/config.js` atualizado com credenciais
- [ ] Abre `index.html` sem erros no console
- [ ] Login admin funciona em `admin-access.html`

### Testes
- [ ] http://localhost:3001/api/health responde OK
- [ ] Consegues fazer login no painel admin
- [ ] Dashboard carrega sem erros

**Se marcaste tudo: 🎉 PARABÉNS! Sistema configurado!**

---

## 🚀 COMO USAR (DEPOIS DE CONFIGURADO)

### 1. Iniciar Backend
```powershell
cd backend
npm start
```

### 2. Abrir Frontend
- Abre `index.html` no navegador
- OU usa Live Server no VS Code

### 3. Fazer Login
- **Admin:** `admin-access.html`
- **Fornecedor:** `fornecedor/fornecedor-login.html`
- **Entregador:** `fornecedor/entregadores/login-entregador.html`

---

## 🆘 PRECISO DE AJUDA!

### 🔰 Sou Iniciante e Estou Perdido
👉 Abre: **[TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md)**  
Segue passo a passo. Está tudo explicado!

### 🔑 Não Sei Onde Obter as Credenciais
👉 Abre: **[ONDE_OBTER_CREDENCIAIS.md](ONDE_OBTER_CREDENCIAIS.md)**  
Com imagens e explicações detalhadas!

### ⚡ Preciso de um Comando Rápido
👉 Abre: **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)**  
Todos os comandos que vais precisar!

### 🔧 Quero Entender Como Funciona
👉 Abre: **[GUIA_INTEGRACAO_BACKEND.md](GUIA_INTEGRACAO_BACKEND.md)**  
Lógica completa do sistema!

### ❌ Tenho um Erro
1. Verifica os logs no terminal (`npm start`)
2. Verifica o console do navegador (F12)
3. Executa `node verificar-config.js`
4. Consulta a secção "Troubleshooting" em [COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)

---

## 📞 RECURSOS ADICIONAIS

### Documentação Oficial
- **Supabase:** https://supabase.com/docs
- **Express:** https://expressjs.com/
- **Node.js:** https://nodejs.org/docs/

### Ferramentas Úteis
- **VS Code:** https://code.visualstudio.com/
- **Live Server (extensão VS Code):** Para testar frontend
- **Postman:** Para testar endpoints da API

---

## 🎯 PRÓXIMOS PASSOS

Depois de configurar tudo:

1. **Criar fornecedor:** `node criar-fornecedor.js`
2. **Criar entregador:** `node criar-entregador.js`
3. **Testar fluxo completo:**
   - Fornecedor adiciona produto
   - Admin aprova produto
   - Cliente faz pedido
   - Admin cria entrega
   - Entregador atualiza status
   - Admin aprova entrega
   - Admin processa pagamento

---

## 📊 STATUS DO PROJETO

- ✅ Backend completo e funcional
- ✅ Frontend estruturado
- ✅ Sistema de autenticação
- ✅ Painel admin completo
- ✅ Painel fornecedor completo
- ✅ Painel entregador completo
- ✅ Sistema de notificações
- ✅ Sistema de pagamentos
- ✅ Documentação completa

---

## 🏆 CARACTERÍSTICAS

### Segurança
- ✅ Autenticação JWT
- ✅ Senhas criptografadas (bcrypt)
- ✅ Validação de dados
- ✅ CORS configurado
- ✅ Tokens com expiração

### Usabilidade
- ✅ Interface intuitiva
- ✅ Mobile-friendly
- ✅ Notificações em tempo real
- ✅ Dashboard com estatísticas

### Escalabilidade
- ✅ Banco de dados relacional (PostgreSQL via Supabase)
- ✅ API RESTful
- ✅ Código modular
- ✅ Fácil manutenção

---

## 💡 DICAS

1. **Guarda as credenciais:** Cria backup do `.env` num local seguro
2. **Use Git:** Faz commits regulares (mas NUNCA comites `.env`)
3. **Testa sempre:** Usa `node verificar-config.js` antes de iniciar
4. **Logs são teus amigos:** Consulta sempre os logs quando houver erros

---

## 🎉 COMEÇA AGORA!

Pronto para começar? Abre:

👉 **[TUTORIAL_SETUP_COMPLETO.md](TUTORIAL_SETUP_COMPLETO.md)**

Boa sorte! 🚀✨
