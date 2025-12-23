# 🧪 Guia de Testes - Supabase

Após configurar o Supabase, use este guia para testar sua API.

## 📡 Teste 1: Health Check

```bash
curl http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-16T...",
  "database": "Supabase (PostgreSQL)"
}
```

## 📚 Teste 2: Listar Categorias

```bash
curl http://localhost:3001/api/categorias
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "dados": [],
  "mensagem": "Categorias recuperadas"
}
```

## 👤 Teste 3: Registrar Usuário

```bash
curl -X POST http://localhost:3001/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "telefone": "11999999999",
    "senha": "Senha123!",
    "confirmar_senha": "Senha123!"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "dados": {
    "usuario": {
      "id": 1,
      "uuid": "...",
      "nome": "João Silva",
      "email": "joao@example.com",
      "tipo": "cliente"
    },
    "token": "eyJ..."
  },
  "mensagem": "Conta criada com sucesso"
}
```

## 🔑 Teste 4: Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "Senha123!"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "dados": {
    "usuario": {
      "id": 1,
      "uuid": "...",
      "nome": "João Silva",
      "email": "joao@example.com",
      "tipo": "cliente"
    },
    "token": "eyJ..."
  },
  "mensagem": "Logado com sucesso"
}
```

## 🛒 Teste 5: Criar Categoria (com autenticação)

Substitua `TOKEN` pelo token recebido do login.

```bash
curl -X POST http://localhost:3001/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nome": "Limpeza",
    "descricao": "Serviços de limpeza em geral",
    "ordem": 1
  }'
```

## 🧮 Teste 6: Criar Produto

```bash
curl -X POST http://localhost:3001/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nome": "Limpeza de Tapete",
    "descricao": "Limpeza profissional de tapetes",
    "preco": 50.00,
    "categoria_id": 1,
    "imagem_url": "https://...",
    "estoque": 100
  }'
```

## 📋 Teste 7: Listar Produtos

```bash
curl http://localhost:3001/api/produtos?pagina=1&limite=10
```

## 📦 Teste 8: Buscar Produto por ID

```bash
curl http://localhost:3001/api/produtos/1
```

## ✨ Teste 9: Criar Avaliação

```bash
curl -X POST http://localhost:3001/api/avaliacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "produto_id": 1,
    "estrelas": 5,
    "comentario": "Excelente serviço!"
  }'
```

## 🚚 Teste 10: Criar Endereço

```bash
curl -X POST http://localhost:3001/api/enderecos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "endereco": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 456",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "principal": true
  }'
```

## 📦 Teste 11: Criar Pedido

```bash
curl -X POST http://localhost:3001/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "endereco_entrega": 1,
    "observacoes": "Entrega de manhã",
    "itens": [
      {
        "produto_id": 1,
        "quantidade": 2,
        "preco_unitario": 50.00
      }
    ]
  }'
```

## 🔍 Teste 12: Listar Pedidos do Usuário

```bash
curl http://localhost:3001/api/pedidos/meus-pedidos \
  -H "Authorization: Bearer TOKEN"
```

## 🛠️ Verificação do Supabase

### Verificar se as tabelas foram criadas:

1. Acesse o dashboard do Supabase
2. Vá para **Table Editor**
3. Você deve ver:
   - usuarios
   - categorias
   - produtos
   - pedidos
   - itens_pedido
   - endereco
   - avaliacoes

### Executar query no SQL Editor:

```sql
-- Contar registros
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_produtos FROM produtos;
SELECT COUNT(*) as total_pedidos FROM pedidos;

-- Ver estrutura da tabela
\d usuarios
\d produtos
```

## ⚠️ Erros Comuns:

### Error 401 - Não autenticado
```json
{"sucesso": false, "mensagem": "Token não fornecido"}
```
**Solução**: Adicione o header `Authorization: Bearer TOKEN`

### Error 404 - Não encontrado
```json
{"sucesso": false, "mensagem": "Recurso não encontrado"}
```
**Solução**: Verifique o ID do recurso

### Error 500 - Erro no servidor
```json
{"sucesso": false, "mensagem": "Erro ao...", "erro": "..."}
```
**Solução**: Verifique se:
- O schema SQL foi executado
- As credenciais do Supabase estão corretas
- Os nomes das tabelas estão certos

### Error 409 - Email já existe
```json
{"sucesso": false, "mensagem": "Email já cadastrado"}
```
**Solução**: Use outro email no registro

## 📊 Testando com Insomnia/Postman:

### Variáveis de Ambiente:

```json
{
  "api_url": "http://localhost:3001",
  "token": "copie-o-token-do-login-aqui"
}
```

### Exemplo de Request em Insomnia:

**Name:** Get Products
**Method:** GET
**URL:** `{{ api_url }}/api/produtos`
**Headers:**
- `Content-Type: application/json`

## 🎯 Checklist de Testes:

- [ ] Health Check retorna OK
- [ ] Registrar novo usuário funciona
- [ ] Login funciona e retorna token
- [ ] Criar categoria funciona
- [ ] Criar produto funciona
- [ ] Listar produtos retorna dados
- [ ] Buscar produto por ID funciona
- [ ] Criar avaliação funciona
- [ ] Criar endereço funciona
- [ ] Criar pedido funciona
- [ ] Listar pedidos do usuário funciona
- [ ] Dados aparecem no dashboard Supabase

## 🚀 Teste de Carga (opcional):

```bash
# Instalar Apache Bench
apt-get install apache2-utils  # Linux
brew install httpd  # macOS

# Testar 100 requisições
ab -n 100 -c 10 http://localhost:3001/api/health

# Resultado esperado:
# Requests per second: > 100
# Failed requests: 0
```

## ✅ Se tudo passou nos testes!

Parabéns! Seu backend está:
- ✅ Conectado ao Supabase
- ✅ Criando e lendo dados
- ✅ Autenticando usuários
- ✅ Pronto para produção

Próximo passo: Conectar o frontend!

---

**Dúvidas?** Consulte `SUPABASE_SETUP.md`
