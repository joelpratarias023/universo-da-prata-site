# ✅ CHECKLIST - Sistema do Fornecedor

Use este checklist para configurar e testar o sistema completo.

---

## 📋 CONFIGURAÇÃO INICIAL

### 1. Banco de Dados
- [ ] Abrir Supabase Dashboard
- [ ] Ir para SQL Editor
- [ ] Executar script: `backend/fornecedores-schema.sql`
- [ ] Verificar se as tabelas foram criadas:
  - [ ] `fornecedores`
  - [ ] `pagamentos_fornecedores`
  - [ ] Coluna `fornecedor_id` em `produtos`

### 2. Backend
- [ ] Navegar para pasta `backend`
- [ ] Verificar se `.env` existe com:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `PORT=3001`
- [ ] Instalar dependências: `npm install`
- [ ] Criar fornecedor teste: `node criar-fornecedor.js`
- [ ] Iniciar servidor: `npm start` ou `START.bat`
- [ ] Verificar se está rodando em: `http://localhost:3001`

### 3. Frontend
- [ ] Verificar se URL da API está correta nos scripts:
  - [ ] `scripts/fornecedor-login.js`
  - [ ] `scripts/painel-fornecedor.js`
- [ ] Abrir `fornecedor-login.html` com Live Server ou navegador

---

## 🧪 TESTES FUNCIONAIS

### Login
- [ ] Acessar `fornecedor-login.html`
- [ ] Tentar login com credenciais erradas (deve dar erro)
- [ ] Fazer login com:
  - Email: `fornecedor@teste.com`
  - Senha: `fornecedor123`
- [ ] Verificar se redireciona para `painel-fornecedor.html`
- [ ] Verificar se nome aparece no header

### Dashboard
- [ ] Visualizar cards com estatísticas
- [ ] Verificar se valores aparecem (podem ser 0)
- [ ] Verificar resumo financeiro

### Produtos
- [ ] Clicar em "Produtos" no menu
- [ ] Verificar se lista carrega
- [ ] Clicar em "Ver" em algum produto
- [ ] Verificar modal com detalhes
- [ ] Fechar modal

### Vendas
- [ ] Clicar em "Vendas" no menu
- [ ] Verificar se histórico carrega
- [ ] Verificar colunas da tabela

### Financeiro
- [ ] Clicar em "Financeiro" no menu
- [ ] Verificar cards financeiros
- [ ] Verificar histórico de pagamentos

### Perfil
- [ ] Clicar em "Perfil" no menu
- [ ] Verificar se dados carregam
- [ ] Editar nome ou telefone
- [ ] Salvar alterações
- [ ] Verificar mensagem de sucesso

### Senha
- [ ] Na seção Perfil
- [ ] Tentar alterar senha com senha atual errada (deve dar erro)
- [ ] Alterar senha com senhas diferentes (deve dar erro)
- [ ] Alterar senha corretamente
- [ ] Verificar mensagem de sucesso

### Logout
- [ ] Clicar em "Sair"
- [ ] Verificar se volta para login
- [ ] Tentar acessar `painel-fornecedor.html` diretamente
- [ ] Deve redirecionar para login

---

## 🔧 TESTES TÉCNICOS

### API Backend
- [ ] Acessar: `http://localhost:3001/api`
- [ ] Deve retornar JSON com endpoints
- [ ] Testar: `http://localhost:3001/api/health`
- [ ] Deve retornar status OK

### Console do Navegador
- [ ] Abrir DevTools (F12)
- [ ] Verificar se não há erros no Console
- [ ] Verificar Network para ver requisições
- [ ] Verificar se token é enviado nos headers

### Responsividade
- [ ] Testar em desktop (1920px)
- [ ] Testar em laptop (1366px)
- [ ] Testar em tablet (768px)
- [ ] Testar em mobile (375px)
- [ ] Verificar se menu funciona
- [ ] Verificar se tabelas são scrolláveis

---

## 📊 TESTES COM DADOS REAIS

### Associar Produtos
```sql
-- Execute no Supabase
UPDATE produtos 
SET fornecedor_id = (
  SELECT id FROM fornecedores 
  WHERE email = 'fornecedor@teste.com'
)
WHERE id IN (1, 2, 3, 4, 5);
```

- [ ] Executar SQL acima
- [ ] Recarregar Dashboard
- [ ] Verificar se total de peças aumentou
- [ ] Ir em Produtos
- [ ] Verificar se produtos aparecem

### Simular Vendas
Se houver pedidos no sistema:
- [ ] Verificar se vendas aparecem
- [ ] Verificar cálculos financeiros
- [ ] Verificar histórico por produto

---

## 🔒 TESTES DE SEGURANÇA

### Autenticação
- [ ] Tentar acessar rotas protegidas sem token
- [ ] Deve retornar 401
- [ ] Tentar usar token inválido
- [ ] Deve retornar 401

### Autorização
- [ ] Fornecedor só vê seus próprios produtos
- [ ] Não pode ver dados de outros fornecedores

### Senhas
- [ ] Verificar se senhas não aparecem nas respostas
- [ ] Verificar se hash está sendo usado

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Backend não inicia
- [ ] Verificar se porta 3001 está livre
- [ ] Verificar se `.env` existe
- [ ] Verificar credenciais do Supabase
- [ ] Verificar logs do terminal

### Login não funciona
- [ ] Verificar se fornecedor foi criado
- [ ] Verificar se backend está rodando
- [ ] Verificar console do navegador
- [ ] Verificar se URL da API está correta

### Dados não aparecem
- [ ] Verificar se há produtos associados
- [ ] Verificar se há vendas registradas
- [ ] Verificar logs do servidor
- [ ] Verificar Network no DevTools

### Erro 401/403
- [ ] Fazer logout e login novamente
- [ ] Limpar localStorage
- [ ] Verificar se token não expirou

---

## ✅ CHECKLIST FINAL

Após todos os testes:

- [ ] Backend funcionando
- [ ] Login OK
- [ ] Dashboard carregando
- [ ] Produtos listando
- [ ] Vendas carregando
- [ ] Financeiro calculando
- [ ] Perfil editável
- [ ] Senha alterável
- [ ] Logout funcionando
- [ ] Responsivo
- [ ] Sem erros no console
- [ ] API respondendo

---

## 🎉 SISTEMA PRONTO!

Se todos os itens estão marcados, o sistema está 100% funcional!

**Documentação disponível em:**
- `README_FORNECEDOR.md` - Documentação completa
- `GUIA_RAPIDO_FORNECEDOR.md` - Início rápido
- `RESUMO_IMPLEMENTACAO.md` - Resumo técnico

**Arquivos principais:**
- `fornecedor-login.html` - Login
- `painel-fornecedor.html` - Painel
- `backend/src/` - Código do servidor

---

**Tudo funcionando? Excelente! O sistema está pronto para uso.** ✨
