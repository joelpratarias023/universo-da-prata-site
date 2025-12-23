# 🚀 Backend - Universo da Prata

## Documentação Completa da API REST

---

## 📋 Índice
1. [Instalação e Configuração](#instalação-e-configuração)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Autenticação](#autenticação)
4. [Endpoints da API](#endpoints-da-api)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Erros e Tratamento](#erros-e-tratamento)

---

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 14+
- MySQL 5.7+
- NPM ou Yarn

### Passo 1: Instalar Dependências
```bash
cd backend
npm install
```

### Passo 2: Configurar o Banco de Dados
1. Abra o MySQL Workbench ou linha de comando
2. Execute o script SQL:
```bash
mysql -u root -p < database.sql
```

Ou manualmente:
```sql
mysql> SOURCE /caminho/para/backend/database.sql
```

### Passo 3: Criar Arquivo .env
Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# DATABASE
DB_HOST=localhost
DB_PORT=3306
DB_NAME=universo_prata
DB_USER=root
DB_PASSWORD=sua_senha

# SERVER
PORT=3001
NODE_ENV=development
API_URL=http://localhost:3001

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_2025
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5500
```

### Passo 4: Iniciar o Servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

Você verá:
```
╔════════════════════════════════════════════╗
║  🚀 Servidor rodando com sucesso!          ║
║  📡 Porta: 3001                            ║
║  🌐 URL: http://localhost:3001             ║
║  📚 API Docs: http://localhost:3001/api    ║
╚════════════════════════════════════════════╝
```

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Conexão MySQL
│   │   └── jwt.js               # Configuração JWT
│   ├── controllers/
│   │   ├── AuthController.js    # Autenticação e perfil
│   │   ├── ProdutoController.js # Gerenciamento de produtos
│   │   ├── CategoriaController.js # Categorias
│   │   ├── PedidoController.js  # Pedidos
│   │   ├── EnderecoController.js # Endereços
│   │   └── AvaliacaoController.js # Avaliações
│   ├── middleware/
│   │   ├── auth.js              # Autenticação e autorização
│   │   └── errorHandler.js      # Tratamento de erros
│   ├── models/
│   │   ├── Usuario.js           # Modelo de usuário
│   │   ├── Produto.js           # Modelo de produto
│   │   ├── Categoria.js         # Modelo de categoria
│   │   ├── Pedido.js            # Modelo de pedido
│   │   ├── Endereco.js          # Modelo de endereço
│   │   ├── ItensPedido.js       # Itens do pedido
│   │   └── Avaliacao.js         # Modelo de avaliação
│   ├── routes/
│   │   ├── auth.js              # Rotas de autenticação
│   │   ├── produtos.js          # Rotas de produtos
│   │   ├── categorias.js        # Rotas de categorias
│   │   ├── pedidos.js           # Rotas de pedidos
│   │   ├── enderecos.js         # Rotas de endereços
│   │   └── avaliacoes.js        # Rotas de avaliações
│   ├── utils/
│   │   ├── validacoes.js        # Funções de validação
│   │   └── respostas.js         # Padrão de resposta
│   └── server.js                # Arquivo principal
├── .env.example                 # Exemplo de variáveis de ambiente
├── database.sql                 # Script SQL
└── package.json
```

---

## 🔐 Autenticação

### JWT (JSON Web Token)
Todos os endpoints protegidos requerem um token JWT no header:

```
Authorization: Bearer seu_token_jwt_aqui
```

### Fluxo de Autenticação
1. **Registrar**: `POST /api/auth/registrar`
2. **Login**: `POST /api/auth/login`
3. **Receber Token**: Salvar token no localStorage
4. **Usar Token**: Enviar em todos os requests autenticados

---

## 📡 Endpoints da API

### 🔑 Autenticação

#### Registrar
```http
POST /api/auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678900",
  "telefone": "+244912345678",
  "senha": "Senha123!",
  "confirmar_senha": "Senha123!"
}
```

**Resposta (201):**
```json
{
  "sucesso": true,
  "mensagem": "Conta criada com sucesso",
  "dados": {
    "usuario": {
      "id": 1,
      "uuid": "uuid-aqui",
      "nome": "João Silva",
      "email": "joao@email.com",
      "tipo": "cliente"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "Senha123!"
}
```

#### Perfil
```http
GET /api/auth/perfil
Authorization: Bearer token_aqui
```

#### Atualizar Perfil
```http
PUT /api/auth/perfil
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "telefone": "+244912345678"
}
```

#### Alterar Senha
```http
POST /api/auth/alterar-senha
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "senha_atual": "Senha123!",
  "senha_nova": "NovaSenha123!",
  "confirmar_senha": "NovaSenha123!"
}
```

---

### 📦 Produtos

#### Listar Produtos
```http
GET /api/produtos?pagina=1&limite=12&busca=broche&categoria_id=1&preco_min=100&preco_max=1000
```

**Parâmetros Query:**
- `pagina` (número) - Página (padrão: 1)
- `limite` (número) - Itens por página (padrão: 12)
- `busca` (string) - Buscar por nome/descrição
- `categoria_id` (número) - Filtrar por categoria
- `preco_min` (número) - Preço mínimo
- `preco_max` (número) - Preço máximo

#### Buscar Produto por ID
```http
GET /api/produtos/:id
```

#### Produtos por Categoria
```http
GET /api/produtos/categoria/:categoria_id?pagina=1&limite=12
```

#### Produtos Mais Vendidos
```http
GET /api/produtos/mais-vendidos?limite=10
```

#### Criar Produto (Admin)
```http
POST /api/produtos
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Broche Ouro",
  "descricao": "Broche em ouro 18k",
  "preco": 250.00,
  "categoria_id": 1,
  "imagem_url": "https://...",
  "estoque": 10
}
```

#### Atualizar Produto (Admin)
```http
PUT /api/produtos/:id
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Broche Ouro Premium",
  "preco": 300.00,
  "estoque": 15
}
```

#### Deletar Produto (Admin)
```http
DELETE /api/produtos/:id
Authorization: Bearer token_admin
```

---

### 🏷️ Categorias

#### Listar Categorias
```http
GET /api/categorias
```

#### Buscar Categoria
```http
GET /api/categorias/:id
```

#### Criar Categoria (Admin)
```http
POST /api/categorias
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Broches",
  "descricao": "Broches de prata e ouro",
  "imagem_url": "https://...",
  "ordem": 1
}
```

#### Atualizar Categoria (Admin)
```http
PUT /api/categorias/:id
Authorization: Bearer token_admin
```

#### Deletar Categoria (Admin)
```http
DELETE /api/categorias/:id
Authorization: Bearer token_admin
```

---

### 🛒 Pedidos

#### Criar Pedido
```http
POST /api/pedidos
Authorization: Bearer token_cliente
Content-Type: application/json

{
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 3,
      "quantidade": 1
    }
  ],
  "endereco_id": 1,
  "taxa_entrega": 50.00,
  "desconto": 10.00,
  "observacoes": "Entregar com cuidado"
}
```

#### Meus Pedidos
```http
GET /api/pedidos/meus-pedidos?pagina=1&limite=10
Authorization: Bearer token_cliente
```

#### Buscar Pedido
```http
GET /api/pedidos/:id
Authorization: Bearer token
```

#### Listar Pedidos (Admin)
```http
GET /api/pedidos?status=pendente&pagina=1&limite=20
Authorization: Bearer token_admin
```

**Statuses:** `pendente`, `confirmado`, `em_entrega`, `entregue`, `cancelado`

#### Atualizar Pedido (Admin)
```http
PUT /api/pedidos/:id
Authorization: Bearer token_admin
Content-Type: application/json

{
  "status": "em_entrega",
  "entregador_id": 5
}
```

---

### 📍 Endereços

#### Listar Endereços
```http
GET /api/enderecos
Authorization: Bearer token
```

#### Buscar Endereço
```http
GET /api/enderecos/:id
Authorization: Bearer token
```

#### Criar Endereço
```http
POST /api/enderecos
Authorization: Bearer token
Content-Type: application/json

{
  "endereco": "Avenida Revolucionária",
  "numero": "123",
  "complemento": "Apto 456",
  "bairro": "Maianga",
  "cidade": "Luanda",
  "estado": "LA",
  "cep": "00000",
  "principal": true
}
```

#### Atualizar Endereço
```http
PUT /api/enderecos/:id
Authorization: Bearer token
Content-Type: application/json
```

#### Deletar Endereço
```http
DELETE /api/enderecos/:id
Authorization: Bearer token
```

---

### ⭐ Avaliações

#### Criar Avaliação
```http
POST /api/avaliacoes
Authorization: Bearer token_cliente
Content-Type: application/json

{
  "produto_id": 1,
  "estrelas": 5,
  "comentario": "Produto excelente! Muito bom!"
}
```

#### Listar Avaliações do Produto
```http
GET /api/avaliacoes/produto/:produto_id?pagina=1&limite=10
```

#### Buscar Avaliação
```http
GET /api/avaliacoes/:id
```

#### Atualizar Avaliação
```http
PUT /api/avaliacoes/:id
Authorization: Bearer token
Content-Type: application/json

{
  "estrelas": 4,
  "comentario": "Revisando minha opinião..."
}
```

#### Deletar Avaliação
```http
DELETE /api/avaliacoes/:id
Authorization: Bearer token
```

---

## 💻 Exemplos de Uso

### JavaScript/Fetch API

#### Registrar Novo Usuário
```javascript
const registrar = async () => {
  const response = await fetch('http://localhost:3001/api/auth/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: 'João Silva',
      email: 'joao@email.com',
      cpf: '12345678900',
      telefone: '+244912345678',
      senha: 'Senha123!',
      confirmar_senha: 'Senha123!'
    })
  });

  const dados = await response.json();
  
  if (dados.sucesso) {
    // Salvar token
    localStorage.setItem('token', dados.dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.dados.usuario));
    console.log('Usuário registrado com sucesso!');
  } else {
    console.error('Erro:', dados.mensagem);
  }
};
```

#### Fazer Login
```javascript
const login = async (email, senha) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha })
  });

  const dados = await response.json();
  
  if (dados.sucesso) {
    localStorage.setItem('token', dados.dados.token);
    console.log('Logado com sucesso!');
  }
};
```

#### Listar Produtos
```javascript
const obterProdutos = async () => {
  const response = await fetch(
    'http://localhost:3001/api/produtos?pagina=1&limite=12&categoria_id=1'
  );
  
  const dados = await response.json();
  console.log(dados.dados); // Array de produtos
};
```

#### Criar Pedido
```javascript
const criarPedido = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3001/api/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      itens: [
        { produto_id: 1, quantidade: 2 },
        { produto_id: 3, quantidade: 1 }
      ],
      endereco_id: 1,
      taxa_entrega: 50.00,
      observacoes: 'Entregar com cuidado'
    })
  });

  const dados = await response.json();
  console.log(dados.dados); // Dados do novo pedido
};
```

#### Função Helper para Requests Autenticados
```javascript
const api = async (endpoint, opcoes = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...opcoes.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:3001/api${endpoint}`, {
    ...opcoes,
    headers
  });

  return await response.json();
};

// Uso:
const meusPedidos = await api('/pedidos/meus-pedidos');
const perfil = await api('/auth/perfil');
const meuCatalogo = await api('/produtos');
```

---

## ⚠️ Erros e Tratamento

### Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token ausente/inválido |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe |
| 500 | Server Error - Erro do servidor |

### Resposta de Erro
```json
{
  "sucesso": false,
  "mensagem": "Descrição do erro",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

### Exemplos de Erro

#### Email já cadastrado
```json
{
  "sucesso": false,
  "mensagem": "Email já cadastrado",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

#### Token inválido
```json
{
  "sucesso": false,
  "mensagem": "Token inválido ou expirado",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

#### Sem permissão
```json
{
  "sucesso": false,
  "mensagem": "Acesso restrito a administradores",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

---

## 🔒 Segurança

### Boas Práticas Implementadas
- ✅ Senhas com hash bcrypt
- ✅ JWT para autenticação
- ✅ CORS configurável
- ✅ Validação de entrada
- ✅ Tratamento de erros seguro
- ✅ Variáveis de ambiente
- ✅ Índices no banco de dados

### Recomendações Adicionais
1. **HTTPS em Produção** - Sempre use SSL/TLS
2. **Rate Limiting** - Implemente em produção
3. **Logs de Segurança** - Monitore acessos
4. **Backup Regular** - Faça backup do banco
5. **Senhas Fortes** - Requer mínimo 8 caracteres com maiúscula, minúscula, número e símbolo

---

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Arquivo `.env` configurado corretamente
2. MySQL está rodando
3. Banco de dados foi criado com o script SQL
4. Porta 3001 não está em uso
5. Node.js e npm estão atualizados

---

**Versão:** 1.0.0  
**Última Atualização:** Dezembro 2025
