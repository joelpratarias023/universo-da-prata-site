# 🚀 Guia Rápido - Painel do Fornecedor

## Início Rápido (5 minutos)

### 1️⃣ Configurar Banco de Dados

Abra o Supabase SQL Editor e execute:

```bash
backend/fornecedores-schema.sql
```

### 2️⃣ Criar Fornecedor de Teste

No terminal, na pasta `backend`:

```bash
node criar-fornecedor.js
```

Isso criará um fornecedor com:
- **Email**: fornecedor@teste.com
- **Senha**: fornecedor123

### 3️⃣ Iniciar o Backend

```bash
cd backend
npm start
```

### 4️⃣ Abrir o Frontend

Abra `fornecedor-login.html` com Live Server ou navegador.

### 5️⃣ Fazer Login

Use as credenciais:
- Email: `fornecedor@teste.com`
- Senha: `fornecedor123`

## ✅ O que foi implementado

### Backend (API)
- ✅ Modelo Fornecedor com métodos completos
- ✅ Controller com todas as funcionalidades
- ✅ Middleware de autenticação JWT
- ✅ Rotas protegidas
- ✅ Integração com Supabase
- ✅ Cálculos financeiros automáticos

### Frontend
- ✅ Página de login responsiva e moderna
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão de produtos com histórico
- ✅ Histórico completo de vendas
- ✅ Resumo financeiro detalhado
- ✅ Gestão de perfil e alteração de senha
- ✅ Interface totalmente responsiva

## 📊 Funcionalidades por Seção

### Dashboard
- Total de peças registadas
- Peças vendidas
- Peças em stock
- Valor a receber
- Resumo financeiro completo

### Produtos
- Lista de todos os produtos
- Código, estoque, preço
- Status (ativo/inativo)
- Total vendido por produto
- Histórico de vendas detalhado

### Vendas
- Data da venda
- Produto vendido
- Quantidade e valor
- Cliente
- Status do pagamento

### Financeiro
- Total faturado
- Comissão da plataforma
- Valor líquido
- Valor pago
- Valor pendente
- Histórico de pagamentos

### Perfil
- Editar informações
- Alterar senha
- Ver dados da conta

## 🔗 Associar Produtos ao Fornecedor

Para testar com produtos reais, execute no Supabase:

```sql
-- Associar produtos ao fornecedor de teste
UPDATE produtos 
SET fornecedor_id = (
  SELECT id FROM fornecedores 
  WHERE email = 'fornecedor@teste.com'
)
WHERE id IN (1, 2, 3, 4, 5);  -- IDs dos produtos que você quer associar
```

## 🎯 Testando o Sistema

1. **Login**: Acesse e faça login
2. **Dashboard**: Veja as estatísticas (serão 0 se não houver produtos)
3. **Produtos**: Liste os produtos associados ao fornecedor
4. **Vendas**: Veja o histórico de vendas (se houver)
5. **Financeiro**: Veja o resumo financeiro
6. **Perfil**: Edite suas informações

## 🐛 Resolução de Problemas

### Erro ao fazer login
- Verifique se o backend está rodando
- Verifique se o fornecedor foi criado no banco
- Verifique o console do navegador

### Dados não aparecem
- Verifique se há produtos associados ao fornecedor
- Verifique se há vendas registradas
- Veja os logs do servidor

### Erro 401 (Não autorizado)
- Faça logout e login novamente
- Limpe o localStorage do navegador
- Verifique se o JWT_SECRET está configurado

## 📱 URLs

- **Login**: `http://localhost:5500/fornecedor-login.html`
- **Painel**: `http://localhost:5500/painel-fornecedor.html`
- **API**: `http://localhost:3001/api`

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT para autenticação
- Middleware de proteção de rotas
- Validação de sessão automática

## 📝 Próximas Melhorias (Opcional)

- [ ] Upload de novos produtos pelo fornecedor
- [ ] Gráficos e estatísticas avançadas
- [ ] Exportar relatórios em PDF/Excel
- [ ] Notificações em tempo real
- [ ] Sistema de mensagens com admin

---

**Tudo pronto para usar!** 🎉
