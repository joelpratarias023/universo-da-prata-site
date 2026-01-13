# 📘 GUIA DE INTEGRAÇÃO - BACKEND COM SUPABASE

## 🎯 Objetivo deste Documento

Este guia explica **TUDO** o que foi criado no sistema e **EXATAMENTE** o que você precisa fazer para conectar o backend ao Supabase. Foi projetado para tornar sua vida mais fácil! 😊

---

## 📦 O QUE JÁ ESTÁ PRONTO

### 1. **Sistema de Fornecedores** ✅
**Localização:** `fornecedor/` pasta
- Login individual para fornecedores
- Painel onde veem apenas SEUS produtos
- Formulário para adicionar produtos
- Sistema de notificações

### 2. **Sistema de Entregadores** ✅
**Localização:** `fornecedor/entregadores/` pasta
- Login individual para entregadores
- Painel mobile-first (otimizado para celular)
- Veem apenas entregas ATRIBUÍDAS a eles
- Atualização de status das entregas

### 3. **Sistema Admin Completo** ✅
**Localização:** `painel-admin/admin-completo.html`
- Dashboard com estatísticas
- Aprovação de produtos (fornecedores)
- Criação e aprovação de entregas
- Gestão de pagamentos
- Controle total sobre tudo

### 4. **Backend Controllers** ✅
**Localização:** `backend/src/controllers/`
- `AdminFornecedorController.js` - 8 endpoints
- `AdminEntregadorController.js` - 10 endpoints  
- `AdminProdutoController.js` - 8 endpoints
- `AdminPagamentoController.js` - 7 endpoints

### 5. **Frontend Integration** ✅
**Localização:** `painel-admin/admin-backend.js`
- JavaScript que chama os endpoints
- Já conecta com APIs
- Apenas falta conectar backend ao Supabase

---

## 🧠 COMO O SISTEMA FUNCIONA (LÓGICA)

### **Fluxo 1: Fornecedor → Produto → Aprovação → Site**

```
┌─────────────────────────────────────────────────────────┐
│  1. FORNECEDOR FAZ LOGIN                                │
│     fornecedor/login-fornecedor.html                    │
│     POST /api/fornecedores/login                        │
│     ↓                                                    │
│     Recebe TOKEN JWT                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. FORNECEDOR ADICIONA PRODUTO                         │
│     fornecedor/painel-fornecedor.html                   │
│     POST /api/fornecedores/produtos                     │
│     ↓                                                    │
│     Produto salvo com status='pendente' no Supabase     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. ADMIN VÊ PRODUTO PENDENTE                           │
│     painel-admin/admin-completo.html                    │
│     Seção: "Aprovar Produtos"                           │
│     GET /api/admin-completo/produtos/pendentes          │
│     ↓                                                    │
│     Lista todos produtos com status='pendente'          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. ADMIN APROVA OU REJEITA                             │
│     APROVAR:                                            │
│     PATCH /api/admin-completo/produtos/:id/aprovar      │
│     UPDATE produtos SET status='ativo'                  │
│     ↓                                                    │
│     Produto aparece no site! ✅                         │
│                                                          │
│     REJEITAR:                                           │
│     PATCH /api/admin-completo/produtos/:id/rejeitar     │
│     UPDATE produtos SET status='rejeitado'              │
│     INSERT notificacoes (notifica fornecedor)           │
└─────────────────────────────────────────────────────────┘
```

### **Fluxo 2: Pedido → Entrega → Entregador → Aprovação**

```
┌─────────────────────────────────────────────────────────┐
│  1. CLIENTE FAZ PEDIDO NO SITE                          │
│     index.html → carrinho.html → confirmacao.html       │
│     POST /api/pedidos                                   │
│     ↓                                                    │
│     Pedido salvo com status='pendente'                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. ADMIN CRIA ENTREGA E ATRIBUI ENTREGADOR             │
│     painel-admin/admin-completo.html                    │
│     Seção: "Entregas" → Botão "Criar Nova Entrega"     │
│     POST /api/admin-completo/entregas                   │
│     ↓                                                    │
│     INSERT entregas (entregador_id, atribuido_por)      │
│     INSERT notificacoes (notifica entregador)           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. ENTREGADOR RECEBE NOTIFICAÇÃO                       │
│     SMS/Email/Push (configurável)                       │
│     Entregador faz login:                               │
│     fornecedor/entregadores/login-entregador.html       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. ENTREGADOR VÊ ENTREGAS ATRIBUÍDAS                   │
│     fornecedor/entregadores/painel-entregador.html      │
│     GET /api/entregadores/entregas                      │
│     ↓                                                    │
│     WHERE entregador_id = :id                           │
│     (Vê apenas suas entregas!)                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  5. ENTREGADOR ATUALIZA STATUS                          │
│     Botão: "Iniciar Entrega" / "Concluir"              │
│     PATCH /api/entregadores/entregas/:id/status         │
│     ↓                                                    │
│     UPDATE entregas SET status='em_transito'            │
│     UPDATE entregas SET status='concluida'              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  6. ADMIN VALIDA E APROVA ENTREGA                       │
│     painel-admin/admin-completo.html                    │
│     Seção: "Entregas p/ Aprovar" (alerta visual 🔥)    │
│     GET /api/admin-completo/entregas?status=concluida   │
│     ↓                                                    │
│     WHERE aprovado_por_admin = false                    │
│     ↓                                                    │
│     APROVAR:                                            │
│     PATCH /api/admin-completo/entregas/:id/aprovar      │
│     UPDATE entregas SET aprovado_por_admin=true         │
│     ↓                                                    │
│     Entrega liberada para pagamento! ✅                 │
│                                                          │
│     REJEITAR:                                           │
│     PATCH /api/admin-completo/entregas/:id/rejeitar     │
│     UPDATE entregas SET status='rejeitada'              │
│     INSERT notificacoes (notifica entregador)           │
└─────────────────────────────────────────────────────────┘
```

### **Fluxo 3: Gerar e Processar Pagamentos**

```
┌─────────────────────────────────────────────────────────┐
│  1. ADMIN GERA PAGAMENTOS POR PERÍODO                   │
│     painel-admin/admin-completo.html                    │
│     Seção: "Pagamentos"                                 │
│     ↓                                                    │
│     FORNECEDOR:                                         │
│     POST /api/admin-completo/pagamentos/fornecedores/gerar│
│     Body: {                                             │
│       fornecedor_id: 1,                                 │
│       data_inicio: '2026-01-01',                        │
│       data_fim: '2026-01-31'                            │
│     }                                                    │
│     ↓                                                    │
│     Backend calcula:                                    │
│     - Busca todas vendas do período                     │
│     - valor_bruto = SUM(vendas)                         │
│     - valor_comissao = valor_bruto * taxa_comissao      │
│     - valor_liquido = valor_bruto - valor_comissao      │
│     ↓                                                    │
│     INSERT pagamentos_fornecedores                      │
│     (status='pendente')                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. ADMIN PROCESSA PAGAMENTO                            │
│     Botão: "Processar" (ao lado do pagamento)           │
│     PATCH /api/admin-completo/pagamentos/fornecedores/:id/processar│
│     Body: {                                             │
│       metodo_pagamento: 'transferencia',                │
│       comprovante_pagamento: 'url_ou_ref',              │
│       observacoes: 'Pago via Multicaixa'                │
│     }                                                    │
│     ↓                                                    │
│     UPDATE pagamentos_fornecedores                      │
│     SET status='processado',                            │
│         data_processamento=NOW(),                       │
│         processado_por=admin_id                         │
│     ↓                                                    │
│     INSERT notificacoes (notifica fornecedor)           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 O QUE VOCÊ PRECISA FAZER

### **PASSO 1: Configurar Supabase** ⚙️

#### 1.1. Execute os SQLs na ordem:
```bash
# 1. Schema de fornecedores
backend/fornecedores-schema.sql

# 2. Schema de entregadores  
backend/entregadores-schema.sql

# 3. Schema admin completo
backend/admin-completo-schema.sql
```

**Como fazer:**
1. Abra o Supabase Dashboard
2. Vá em "SQL Editor"
3. Cole o conteúdo de cada arquivo
4. Clique em "Run"
5. Repita para os 3 arquivos

#### 1.2. Configure as variáveis de ambiente:
```env
# backend/.env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_chave_service (para operações admin)
JWT_SECRET=seu_secret_para_gerar_tokens
```

### **PASSO 2: Conectar Backend ao Supabase** 🔌

#### 2.1. Arquivo de configuração já existe!
**Localização:** `backend/src/config/database.js`

Você precisa apenas ajustar:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // ← Use service key para admin
);

module.exports = { supabase };
```

#### 2.2. Controllers já estão prontos!

**Exemplo - AdminProdutoController.js:**
```javascript
const { supabase } = require('../config/database');

// Listar produtos pendentes
exports.listarPendentes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        fornecedor:fornecedores(nome, email)
      `)
      .eq('status', 'pendente')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Aprovar produto
exports.aprovar = async (req, res) => {
  const { id } = req.params;
  const { preco, comissao_plataforma } = req.body;
  const adminId = req.user.id; // Vem do middleware de autenticação

  try {
    // 1. Atualizar produto
    const { data: produto, error: updateError } = await supabase
      .from('produtos')
      .update({
        status: 'ativo',
        preco: preco,
        comissao_plataforma: comissao_plataforma,
        aprovado_por: adminId,
        data_aprovacao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Registrar no histórico
    await supabase
      .from('historico_admin')
      .insert({
        admin_id: adminId,
        acao: 'aprovar_produto',
        entidade_tipo: 'produto',
        entidade_id: id,
        dados: { preco, comissao_plataforma }
      });

    // 3. Notificar fornecedor
    await supabase
      .from('notificacoes')
      .insert({
        usuario_id: produto.fornecedor_id,
        tipo: 'produto_aprovado',
        titulo: 'Produto Aprovado!',
        mensagem: `Seu produto "${produto.nome}" foi aprovado e está visível no site.`,
        link_acao: `/fornecedor/produtos/${id}`
      });

    res.json({
      success: true,
      message: 'Produto aprovado com sucesso!',
      data: produto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

#### 2.3. O que falta implementar em CADA controller:

**📁 AdminFornecedorController.js:**
```javascript
// ✅ Já tem a estrutura, você precisa:
// 1. Trocar comentários "// TODO: Implementar..." por queries Supabase
// 2. Exemplo:

exports.listarTodos = async (req, res) => {
  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return res.status(500).json({ success: false, message: error.message });
  
  res.json({ success: true, data });
};

exports.definirComissao = async (req, res) => {
  const { id } = req.params;
  const { comissao_padrao } = req.body;
  
  const { data, error } = await supabase
    .from('fornecedores')
    .update({ comissao_padrao })
    .eq('id', id)
    .select()
    .single();
  
  if (error) return res.status(500).json({ success: false, message: error.message });
  
  res.json({ success: true, data });
};
```

**📁 AdminEntregadorController.js:**
```javascript
// Criar entrega e atribuir
exports.criarEntrega = async (req, res) => {
  const { pedido_id, entregador_id, comissao, observacoes } = req.body;
  const adminId = req.user.id;

  // 1. Buscar dados do pedido
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*, cliente:clientes(*)')
    .eq('id', pedido_id)
    .single();

  // 2. Criar entrega
  const { data: entrega, error } = await supabase
    .from('entregas')
    .insert({
      pedido_id,
      entregador_id,
      comissao,
      observacoes,
      atribuido_por: adminId,
      endereco_entrega: pedido.endereco_entrega,
      cliente_nome: pedido.cliente_nome,
      status: 'aguardando_recolha'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  // 3. Notificar entregador
  await supabase
    .from('notificacoes')
    .insert({
      usuario_id: entregador_id,
      tipo: 'nova_entrega',
      titulo: 'Nova Entrega Atribuída!',
      mensagem: `Você tem uma nova entrega para ${pedido.cliente_nome}`,
      link_acao: `/entregador/entregas/${entrega.id}`
    });

  // 4. Registrar histórico
  await supabase.from('historico_admin').insert({
    admin_id: adminId,
    acao: 'criar_entrega',
    entidade_tipo: 'entrega',
    entidade_id: entrega.id,
    dados: { pedido_id, entregador_id, comissao }
  });

  res.json({ success: true, data: entrega });
};

// Aprovar entrega
exports.aprovarEntrega = async (req, res) => {
  const { id } = req.params;
  const { observacoes } = req.body;
  const adminId = req.user.id;

  const { data, error } = await supabase
    .from('entregas')
    .update({
      aprovado_por_admin: true,
      admin_aprovador_id: adminId,
      data_aprovacao: new Date().toISOString(),
      observacoes_admin: observacoes
    })
    .eq('id', id)
    .select('*, entregador:entregadores(*)')
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  // Notificar entregador
  await supabase.from('notificacoes').insert({
    usuario_id: data.entregador_id,
    tipo: 'entrega_aprovada',
    titulo: 'Entrega Aprovada!',
    mensagem: 'Sua entrega foi aprovada e a comissão será paga em breve.',
    link_acao: `/entregador/entregas/${id}`
  });

  res.json({ success: true, data });
};
```

**📁 AdminPagamentoController.js:**
```javascript
// Gerar pagamento para fornecedor
exports.gerarPagamentoFornecedor = async (req, res) => {
  const { fornecedor_id, data_inicio, data_fim } = req.body;
  const adminId = req.user.id;

  try {
    // 1. Buscar vendas do período
    const { data: vendas } = await supabase
      .from('pedidos')
      .select(`
        id,
        total,
        itens_pedido(
          produto:produtos(fornecedor_id, preco, comissao_plataforma),
          quantidade
        )
      `)
      .eq('status', 'concluido')
      .gte('data_pedido', data_inicio)
      .lte('data_pedido', data_fim);

    // 2. Filtrar vendas do fornecedor e calcular valores
    let valor_bruto = 0;
    let quantidade_vendas = 0;

    vendas.forEach(pedido => {
      pedido.itens_pedido.forEach(item => {
        if (item.produto.fornecedor_id === fornecedor_id) {
          valor_bruto += item.produto.preco * item.quantidade;
          quantidade_vendas++;
        }
      });
    });

    // 3. Buscar comissão do fornecedor
    const { data: fornecedor } = await supabase
      .from('fornecedores')
      .select('comissao_padrao')
      .eq('id', fornecedor_id)
      .single();

    const taxa_comissao = fornecedor.comissao_padrao || 15;
    const valor_comissao = (valor_bruto * taxa_comissao) / 100;
    const valor_liquido = valor_bruto - valor_comissao;

    // 4. Criar pagamento
    const { data: pagamento, error } = await supabase
      .from('pagamentos_fornecedores')
      .insert({
        fornecedor_id,
        valor: valor_liquido,
        valor_bruto,
        valor_comissao,
        taxa_comissao,
        quantidade_vendas,
        periodo_inicio: data_inicio,
        periodo_fim: data_fim,
        status: 'pendente',
        gerado_por: adminId
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: pagamento });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Processar pagamento
exports.processarPagamentoFornecedor = async (req, res) => {
  const { id } = req.params;
  const { metodo_pagamento, comprovante_pagamento, observacoes } = req.body;
  const adminId = req.user.id;

  const { data, error } = await supabase
    .from('pagamentos_fornecedores')
    .update({
      status: 'processado',
      metodo_pagamento,
      comprovante_pagamento,
      observacoes,
      data_processamento: new Date().toISOString(),
      processado_por: adminId
    })
    .eq('id', id)
    .select('*, fornecedor:fornecedores(*)')
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  // Notificar fornecedor
  await supabase.from('notificacoes').insert({
    usuario_id: data.fornecedor_id,
    tipo: 'pagamento_processado',
    titulo: 'Pagamento Processado!',
    mensagem: `Seu pagamento de ${data.valor} AKZ foi processado via ${metodo_pagamento}.`,
    link_acao: `/fornecedor/pagamentos/${id}`
  });

  res.json({ success: true, data });
};
```

### **PASSO 3: Middleware de Autenticação** 🔐

**Localização:** `backend/src/middleware/verificarAdmin.js`

```javascript
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

exports.verificarAutenticacao = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token não fornecido' 
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no Supabase
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    req.user = usuario; // Disponibiliza usuário em req.user
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

exports.verificarAdmin = async (req, res, next) => {
  if (req.user.papel !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Apenas administradores.' 
    });
  }
  next();
};

exports.verificarFornecedor = async (req, res, next) => {
  if (req.user.papel !== 'fornecedor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Apenas fornecedores.' 
    });
  }
  next();
};

exports.verificarEntregador = async (req, res, next) => {
  if (req.user.papel !== 'entregador') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Apenas entregadores.' 
    });
  }
  next();
};
```

### **PASSO 4: Rotas (já estão prontas!)** 🛣️

**Localização:** `backend/src/routes/adminCompleto.js`

Você precisa apenas garantir que as rotas estejam registradas no `server.js`:

```javascript
// backend/src/server.js
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
const adminRoutes = require('./routes/adminCompleto');
const fornecedorRoutes = require('./routes/fornecedores');
const entregadorRoutes = require('./routes/entregadores');

app.use('/api/admin-completo', adminRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/entregadores', entregadorRoutes);

// Servidor
app.listen(3001, () => {
  console.log('🚀 Servidor rodando em http://localhost:3001');
});
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

Use este checklist para não esquecer nada:

### **Database (Supabase)**
- [ ] Executar `fornecedores-schema.sql`
- [ ] Executar `entregadores-schema.sql`
- [ ] Executar `admin-completo-schema.sql`
- [ ] Verificar se todas as tabelas foram criadas
- [ ] Verificar se as views foram criadas
- [ ] Verificar se os triggers foram criados

### **Configuração**
- [ ] Criar arquivo `.env` com as variáveis
- [ ] Configurar `SUPABASE_URL`
- [ ] Configurar `SUPABASE_ANON_KEY`
- [ ] Configurar `SUPABASE_SERVICE_KEY`
- [ ] Configurar `JWT_SECRET`
- [ ] Instalar dependências: `npm install @supabase/supabase-js jsonwebtoken bcryptjs`

### **Backend - Controllers**
- [ ] `AdminFornecedorController.js` - Implementar queries Supabase
- [ ] `AdminEntregadorController.js` - Implementar queries Supabase
- [ ] `AdminProdutoController.js` - Implementar queries Supabase
- [ ] `AdminPagamentoController.js` - Implementar queries Supabase
- [ ] `FornecedorController.js` - Verificar se existe e conectar
- [ ] `EntregadorController.js` - Verificar se existe e conectar

### **Backend - Middleware**
- [ ] `verificarAutenticacao` - Validar JWT e buscar usuário
- [ ] `verificarAdmin` - Verificar se papel='admin'
- [ ] `verificarFornecedor` - Verificar se papel='fornecedor'
- [ ] `verificarEntregador` - Verificar se papel='entregador'

### **Backend - Rotas**
- [ ] Registrar rotas no `server.js`
- [ ] Testar endpoint: `GET /api/admin-completo/fornecedores`
- [ ] Testar endpoint: `GET /api/admin-completo/produtos/pendentes`
- [ ] Testar endpoint: `POST /api/admin-completo/entregas`
- [ ] Testar endpoint: `POST /api/admin-completo/pagamentos/fornecedores/gerar`

### **Testes**
- [ ] Criar usuário admin no Supabase (papel='admin')
- [ ] Criar fornecedor de teste (papel='fornecedor')
- [ ] Criar entregador de teste (papel='entregador')
- [ ] Testar login de cada tipo de usuário
- [ ] Testar fluxo completo: produto pendente → aprovação
- [ ] Testar fluxo completo: criar entrega → atribuir → aprovar
- [ ] Testar fluxo completo: gerar pagamento → processar

---

## 🧪 COMO TESTAR (PASSO A PASSO)

### **Teste 1: Login e Autenticação**
```bash
# 1. Criar usuário admin no Supabase SQL Editor:
INSERT INTO usuarios (nome, email, senha, papel) 
VALUES ('Admin', 'admin@teste.com', 'senha_hash', 'admin');

# 2. Testar login via API:
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "senha": "senha123"
  }'

# Resposta esperada:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Admin",
    "papel": "admin"
  }
}
```

### **Teste 2: Produtos Pendentes**
```bash
# 1. Criar produto pendente:
INSERT INTO produtos (nome, preco, fornecedor_id, status) 
VALUES ('Anel de Prata', 5000, 1, 'pendente');

# 2. Buscar produtos pendentes:
curl -X GET http://localhost:3001/api/admin-completo/produtos/pendentes \
  -H "Authorization: Bearer SEU_TOKEN"

# Resposta esperada:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Anel de Prata",
      "preco": 5000,
      "status": "pendente",
      "fornecedor": {
        "nome": "Fornecedor Teste"
      }
    }
  ]
}
```

### **Teste 3: Aprovar Produto**
```bash
curl -X PATCH http://localhost:3001/api/admin-completo/produtos/1/aprovar \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 5500,
    "comissao_plataforma": 15
  }'

# Resposta esperada:
{
  "success": true,
  "message": "Produto aprovado com sucesso!",
  "data": {
    "id": 1,
    "status": "ativo"
  }
}
```

---

## 🎯 DICAS PARA FACILITAR SUA VIDA

### **1. Use o Supabase Client de forma eficiente:**
```javascript
// ✅ BOM - Com relações
const { data } = await supabase
  .from('produtos')
  .select(`
    *,
    fornecedor:fornecedores(nome, email)
  `)
  .eq('status', 'pendente');

// ❌ RUIM - Duas queries separadas
const produtos = await supabase.from('produtos').select('*');
const fornecedor = await supabase.from('fornecedores').select('*');
```

### **2. Sempre trate erros:**
```javascript
try {
  const { data, error } = await supabase.from('produtos').select('*');
  
  if (error) throw error;
  
  res.json({ success: true, data });
} catch (error) {
  console.error('Erro:', error);
  res.status(500).json({ 
    success: false, 
    message: error.message 
  });
}
```

### **3. Use variáveis de ambiente:**
```javascript
// ❌ NÃO faça isso:
const supabase = createClient('https://xyz.supabase.co', 'chave-hardcoded');

// ✅ Faça isso:
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
```

### **4. Registre todas as ações do admin:**
```javascript
// Sempre após uma ação importante:
await supabase.from('historico_admin').insert({
  admin_id: req.user.id,
  acao: 'aprovar_produto',
  entidade_tipo: 'produto',
  entidade_id: produtoId,
  dados: { preco, comissao }
});
```

---

## 📞 ESTRUTURA DE RESPOSTA PADRÃO

**Todas as APIs devem seguir este padrão:**

### **Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso" // opcional
}
```

### **Erro:**
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Código do erro" // opcional
}
```

---

## 🎉 CONCLUSÃO

Você tem:
- ✅ Frontend completo (Fornecedor, Entregador, Admin)
- ✅ Controllers backend estruturados
- ✅ Rotas definidas
- ✅ Schema SQL completo
- ✅ Lógica de fluxo bem definida

**Você precisa fazer:**
1. Executar os SQLs no Supabase (10 minutos)
2. Configurar .env (5 minutos)
3. Implementar queries Supabase nos controllers (2-3 horas)
4. Testar endpoints (1 hora)

**Total estimado: 4-5 horas de trabalho** ⏱️

Se tiver dúvidas em qualquer parte, consulte este documento! 📘

---

**Bom trabalho! 🚀**
