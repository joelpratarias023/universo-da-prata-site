# README - Backend Universo da Prata

## 🚀 Visão Geral

Backend completo para o e-commerce **Universo da Prata** construído com:
- **Node.js + Express** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Bcrypt** - Criptografia de senhas

---

## ⚡ Quick Start

### 1. Clone e Instale
```bash
cd backend
npm install
```

### 2. Configure o Banco de Dados
```bash
# Abra o MySQL e execute:
source database.sql

# Ou usando linha de comando:
mysql -u root -p < database.sql
```

### 3. Configure .env
```bash
cp .env.example .env
# Edite as credenciais do banco de dados
```

### 4. Inicie o Servidor
```bash
npm run dev
```

**Resultado:**
```
✅ Conectado ao MySQL com sucesso!
📊 Tabelas de banco de dados criadas
🚀 Servidor rodando em http://localhost:3001
```

---

## 📁 Estrutura

```
backend/
├── src/
│   ├── config/       # Configurações (DB, JWT)
│   ├── controllers/  # Lógica de negócio
│   ├── middleware/   # Autenticação, erros
│   ├── models/       # Modelos de dados
│   ├── routes/       # Endpoints da API
│   ├── utils/        # Funções auxiliares
│   └── server.js     # Arquivo principal
├── database.sql      # Script de criação de tabelas
├── .env.example      # Variáveis de ambiente
└── package.json
```

---

## 🔑 Endpoints Principais

### Autenticação
- `POST /api/auth/registrar` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/perfil` - Perfil do usuário

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar (admin)
- `PUT /api/produtos/:id` - Atualizar (admin)
- `DELETE /api/produtos/:id` - Deletar (admin)

### Pedidos
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos/meus-pedidos` - Meus pedidos
- `GET /api/pedidos/:id` - Detalhes do pedido

### Endereços
- `GET /api/enderecos` - Listar endereços
- `POST /api/enderecos` - Criar endereço
- `PUT /api/enderecos/:id` - Atualizar
- `DELETE /api/enderecos/:id` - Deletar

### Avaliações
- `POST /api/avaliacoes` - Avaliar produto
- `GET /api/avaliacoes/produto/:id` - Avaliações do produto

---

## 📚 Documentação Completa

Veja [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentação detalhada com exemplos.

---

## 🔐 Autenticação

Todos os requests autenticados precisam do header:
```
Authorization: Bearer seu_token_jwt
```

Exemplo:
```javascript
const response = await fetch('http://localhost:3001/api/auth/perfil', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

---

## 🗄️ Banco de Dados

### Tabelas Principais
- `usuarios` - Usuários do sistema
- `produtos` - Catálogo de produtos
- `categorias` - Categorias de produtos
- `pedidos` - Pedidos de clientes
- `itens_pedido` - Itens de cada pedido
- `enderecos` - Endereços de entrega
- `avaliacoes` - Avaliações de produtos

### Inicializar BD
```bash
mysql -u root -p universo_prata < database.sql
```

---

## 🛠️ Variáveis de Ambiente

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=universo_prata
DB_USER=root
DB_PASSWORD=sua_senha

# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=chave_secreta_muito_segura
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5500
```

---

## 📦 Dependências

```json
{
  "bcryptjs": "^2.4.3",      // Hash de senhas
  "cors": "^2.8.5",           // CORS habilitado
  "dotenv": "^16.3.1",        // Variáveis de ambiente
  "express": "^4.18.2",       // Framework web
  "jsonwebtoken": "^9.1.2",   // JWT
  "mysql2": "^3.6.5",         // Driver MySQL
  "uuid": "^9.0.1"            // IDs únicos
}
```

---

## 🚀 Deploy

### Preparar para Produção
1. Defina `NODE_ENV=production` no `.env`
2. Use URL HTTPS da sua aplicação
3. Configure banco de dados remoto
4. Adicione rate limiting
5. Configure variáveis seguras

### Variáveis Recomendadas para Produção
```env
NODE_ENV=production
DB_HOST=seu_host_remoto
DB_USER=usuario_seguro
DB_PASSWORD=senha_muito_segura
JWT_SECRET=chave_extremamente_secreta
CORS_ORIGIN=https://seu-dominio.com
```

---

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED" MySQL
```
Solução: Verifique se MySQL está rodando
windows: net start MySQL80
linux: sudo service mysql start
```

### Erro: "Access denied" para usuário MySQL
```
Solução: Verifique credenciais em .env
Resetar senha: mysql -u root -p
```

### Porta 3001 já em uso
```
Solução: Use porta diferente ou mate o processo
windows: netstat -ano | findstr :3001
linux: lsof -i :3001 | kill -9 PID
```

---

## 🤝 Integração com Frontend

### Configurar CORS
Edite `backend/src/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5500', 'https://seu-site.com'],
  credentials: true,
}));
```

### Exemplos de Uso no Frontend

#### Registrar
```javascript
const registrar = async (dados) => {
  const response = await fetch('http://localhost:3001/api/auth/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return await response.json();
};
```

#### Listar Produtos
```javascript
const obterProdutos = async () => {
  const response = await fetch('http://localhost:3001/api/produtos?limite=12');
  return await response.json();
};
```

#### Criar Pedido
```javascript
const criarPedido = async (itens, endereco_id) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      itens,
      endereco_id,
      taxa_entrega: 50
    })
  });
  return await response.json();
};
```

---

## 📋 Checklist de Implementação

- [x] Autenticação com JWT
- [x] CRUD de Produtos
- [x] CRUD de Categorias
- [x] Sistema de Pedidos
- [x] Gerenciamento de Endereços
- [x] Sistema de Avaliações
- [x] Validação de dados
- [x] Tratamento de erros
- [x] CORS configurável
- [x] Documentação completa

---

## 📞 Suporte

**Dúvidas?** Verifique:
1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Console de erros do navegador
3. Logs do servidor (npm run dev)
4. Credenciais do banco de dados

---

**Status:** ✅ Completo e Funcional  
**Versão:** 1.0.0  
**Última Atualização:** Dezembro 2025
