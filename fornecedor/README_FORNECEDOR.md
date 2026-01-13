# 🏪 Sistema de Painel do Fornecedor - Universo da Prata

Sistema completo de gestão para fornecedores com autenticação individual, dashboard estatístico e controle financeiro.

## 📋 Funcionalidades Implementadas

### ✅ Autenticação
- Sistema de login individual para fornecedores
- Proteção de rotas com JWT
- Validação de sessão automática
- Logout seguro

### ✅ Dashboard (Visão Geral)
- **Quantidade total de peças registadas** no sistema
- **Quantidade de peças vendidas**
- **Quantidade de peças disponíveis em stock**
- **Valor total a receber** (baseado nas peças vendidas)
- **Valor já pago** (se aplicável)
- **Valor pendente**

### ✅ Gestão de Produtos
- Lista de todas as peças do fornecedor
- Informação por peça:
  - Nome / código do produto
  - Quantidade disponível
  - Preço unitário
  - Status (disponível / vendida)
  - Histórico de vendas por produto
- Modal com detalhes completos de cada produto

### ✅ Histórico de Vendas
- Lista detalhada das peças vendidas
- Data da venda
- Valor da venda
- Cliente (se aplicável)
- Status do pagamento (pago / pendente)

### ✅ Resumo Financeiro
- Total faturado
- Comissão da plataforma (se existir)
- Valor líquido a receber
- Histórico de pagamentos efetuados ao fornecedor

### ✅ Gestão de Perfil
- Visualizar e editar dados do fornecedor
- Alterar senha com segurança

## 🚀 Configuração

### 1. Configurar o Banco de Dados (Supabase)

Execute o script SQL no Supabase SQL Editor:

```bash
backend/fornecedores-schema.sql
```

Este script irá:
- Criar a tabela `fornecedores`
- Adicionar coluna `fornecedor_id` na tabela `produtos`
- Criar índices para performance
- Criar tabela `pagamentos_fornecedores` para histórico
- Configurar triggers e políticas RLS

### 2. Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 3. Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` na pasta `backend` contém:

```env
PORT=3001
JWT_SECRET=seu-segredo-jwt-aqui
SUPABASE_URL=sua-url-supabase
SUPABASE_KEY=sua-chave-supabase
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500
```

### 4. Iniciar o Backend

```bash
cd backend
npm start
```

O servidor estará disponível em: `http://localhost:3001`

### 5. Configurar o Frontend

Abra o arquivo `scripts/fornecedor-login.js` e `scripts/painel-fornecedor.js` e verifique se a URL da API está correta:

```javascript
const API_URL = 'http://localhost:3001/api';
```

### 6. Iniciar o Frontend

Use um servidor local como Live Server no VS Code ou Python:

```bash
# Com Python
python -m http.server 5500

# Ou use a extensão Live Server do VS Code
```

## 📂 Estrutura de Arquivos Criados

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   └── FornecedorController.js    # Controller com toda lógica
│   ├── middleware/
│   │   └── autenticarFornecedor.js    # Middleware de autenticação
│   ├── models/
│   │   └── Fornecedor.js              # Model do fornecedor
│   ├── routes/
│   │   └── fornecedores.js            # Rotas da API
│   └── server.js                       # Atualizado com rotas
└── fornecedores-schema.sql             # Script SQL
```

### Frontend
```
├── fornecedor-login.html               # Página de login
├── painel-fornecedor.html              # Painel completo
├── css/
│   ├── fornecedor-login.css           # Estilos do login
│   └── painel-fornecedor.css          # Estilos do painel
└── scripts/
    ├── fornecedor-login.js            # Lógica do login
    └── painel-fornecedor.js           # Lógica do painel
```

## 🔗 Endpoints da API

### Autenticação
- `POST /api/fornecedores/login` - Login do fornecedor

### Dashboard (Protegidas)
- `GET /api/fornecedores/dashboard` - Dados do dashboard
- `GET /api/fornecedores/produtos` - Lista de produtos
- `GET /api/fornecedores/produtos/:id` - Detalhes de um produto
- `GET /api/fornecedores/vendas` - Histórico de vendas
- `GET /api/fornecedores/financeiro` - Resumo financeiro

### Perfil
- `GET /api/fornecedores/perfil` - Dados do perfil
- `PUT /api/fornecedores/perfil` - Atualizar perfil
- `PUT /api/fornecedores/alterar-senha` - Alterar senha

## 🧪 Criar Fornecedor de Teste

Para criar um fornecedor de teste, você pode:

### Opção 1: Via SQL (Recomendado)

```sql
-- Gerar hash da senha primeiro (use bcrypt online ou Node.js)
-- Senha: fornecedor123
-- Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO fornecedores (
  nome, 
  email, 
  cnpj, 
  telefone, 
  senha, 
  endereco, 
  taxa_comissao, 
  status
) VALUES (
  'Fornecedor Teste',
  'fornecedor@teste.com',
  '12.345.678/0001-90',
  '(11) 98765-4321',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Rua Teste, 123 - São Paulo, SP',
  10.00,
  'ativo'
);
```

### Opção 2: Via Script Node.js

Crie um arquivo `criar-fornecedor.js` na pasta `backend`:

```javascript
const bcrypt = require('bcryptjs');
const supabase = require('./src/config/database');
const { v4: uuidv4 } = require('uuid');

async function criarFornecedor() {
  const senha = 'fornecedor123';
  const senhaHash = await bcrypt.hash(senha, 10);
  
  const { data, error } = await supabase
    .from('fornecedores')
    .insert([{
      uuid: uuidv4(),
      nome: 'Fornecedor Teste',
      email: 'fornecedor@teste.com',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 98765-4321',
      senha: senhaHash,
      endereco: 'Rua Teste, 123 - São Paulo, SP',
      taxa_comissao: 10.00,
      status: 'ativo'
    }])
    .select();
  
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Fornecedor criado com sucesso!', data);
    console.log('\nCredenciais de acesso:');
    console.log('Email: fornecedor@teste.com');
    console.log('Senha: fornecedor123');
  }
  
  process.exit();
}

criarFornecedor();
```

Execute:
```bash
cd backend
node criar-fornecedor.js
```

## 🔗 Associar Produtos a Fornecedores

Para associar produtos existentes a um fornecedor:

```sql
-- Atualizar produtos para associá-los a um fornecedor
UPDATE produtos 
SET fornecedor_id = (SELECT id FROM fornecedores WHERE email = 'fornecedor@teste.com')
WHERE id IN (1, 2, 3); -- IDs dos produtos desejados
```

## 📱 Acesso ao Sistema

1. **Login**: Acesse `fornecedor-login.html`
2. **Credenciais de teste**:
   - Email: `fornecedor@teste.com`
   - Senha: `fornecedor123`

## 🎨 Interface

### Página de Login
- Design moderno com gradiente
- Validações em tempo real
- Feedback visual de erros
- Informações sobre o sistema

### Painel do Fornecedor
- **Dashboard**: Cards com estatísticas principais
- **Produtos**: Tabela com todos os produtos e histórico
- **Vendas**: Lista completa de vendas realizadas
- **Financeiro**: Resumo completo e histórico de pagamentos
- **Perfil**: Edição de dados e alteração de senha

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação via JWT
- ✅ Proteção de rotas no backend
- ✅ Validação de sessão no frontend
- ✅ Row Level Security (RLS) no Supabase
- ✅ Sanitização de inputs

## 🎯 Próximos Passos (Opcional)

1. **Upload de produtos**: Permitir fornecedores adicionarem seus próprios produtos
2. **Notificações**: Sistema de notificações em tempo real
3. **Relatórios**: Geração de relatórios em PDF
4. **Chat**: Sistema de chat com administradores
5. **Multi-idioma**: Suporte para múltiplos idiomas

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o backend está rodando
2. Verifique se as tabelas foram criadas no Supabase
3. Verifique o console do navegador para erros
4. Verifique os logs do servidor

## 📝 Notas Importantes

- O sistema requer que a tabela `produtos` tenha a coluna `fornecedor_id`
- A taxa de comissão é configurável por fornecedor
- Os cálculos financeiros consideram apenas pedidos com status 'entregue' ou 'concluido'
- O histórico de pagamentos é opcional e pode ser gerenciado manualmente

---

**Desenvolvido para Universo da Prata** ✨
