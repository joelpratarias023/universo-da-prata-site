# Guia de Configuração - Supabase

Este projeto foi migrado de MySQL para **Supabase**, um backend PostgreSQL open-source com autenticação integrada.

## 🚀 Passo 1: Criar conta e projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Sign Up" e crie uma conta
3. Crie um novo projeto:
   - Clique em "New Project"
   - Escolha um nome para o projeto (ex: "universo-da-prata")
   - Escolha uma região (recomendo América do Sul - São Paulo)
   - Defina uma senha para o banco de dados
   - Clique em "Create new project"

## 🔑 Passo 2: Obter credenciais do Supabase

1. Após criar o projeto, vá para **Settings** > **API**
2. Você encontrará:
   - **Project URL** - será seu `SUPABASE_URL`
   - **Anon Public** - será seu `SUPABASE_KEY`
3. Copie essas valores

## 📝 Passo 3: Criar as tabelas no Supabase

1. No dashboard do Supabase, acesse **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a confirmação de que todas as tabelas foram criadas

## ⚙️ Passo 4: Configurar variáveis de ambiente

1. Crie um arquivo `.env` na pasta `backend/` (copie de `.env.example`)
2. Preencha com suas credenciais:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
PORT=3001
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-muito-segura
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## 📦 Passo 5: Instalar dependências

```bash
cd backend
npm install
```

## 🎯 Passo 6: Iniciar o servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## ✅ Passo 7: Testar a conexão

Faça uma requisição para:
```
GET http://localhost:3001/api/health
```

Se receber uma resposta 200 com `{"status": "OK"}`, a conexão está funcionando!

## 🔍 Troubleshooting

### Erro: "SUPABASE_URL e SUPABASE_KEY são obrigatórios"
- Verifique se as variáveis de ambiente estão corretas em `.env`
- Certifique-se de que o arquivo `.env` está na pasta `backend/`

### Erro de conexão ao Supabase
- Verifique se o URL e a Key estão corretos
- Teste acessando o dashboard do Supabase

### Erro nas queries
- Verifique se as tabelas foram criadas executando o schema SQL
- Confirme que os nomes das tabelas e colunas estão corretos

## 📱 Diferencas principais do MySQL para Supabase

| Aspecto | MySQL | Supabase |
|--------|-------|---------|
| Client | `mysql2` | `@supabase/supabase-js` |
| Sintaxe de Query | SQL parametrizado | Filter chains (método fluent) |
| Conversão de tipos | Automática | Manual necessária algumas vezes |
| Timestamps | AUTO_INCREMENT, CURRENT_TIMESTAMP | UUID, CURRENT_TIMESTAMP |
| Relacionamentos | Foreign keys | Referências + select com joins |
| Autenticação | Manual com JWT | Integrada (opcional) |

## 🔐 Segurança - Row Level Security (RLS)

Para habilitar segurança adicional no Supabase:

1. Vá para **Authentication** > **Policies**
2. Configure políticas de acesso para cada tabela
3. Exemplo: Usuários só podem ver seus próprios dados

```sql
-- Política para usuários acessarem apenas seus dados
CREATE POLICY "Users can view own data" ON usuarios
  FOR SELECT
  USING (auth.uid()::text = uuid);
```

## 📚 Recursos úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia PostgreSQL](https://www.postgresql.org/docs/)
- [SDK JavaScript do Supabase](https://supabase.com/docs/reference/javascript)

## 🎉 Sucesso!

Se tudo está funcionando, você migrou com sucesso do MySQL para Supabase!
