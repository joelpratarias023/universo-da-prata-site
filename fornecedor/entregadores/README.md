# 🚚 Sistema de Entregadores - Universo da Prata

Sistema completo para gestão de entregas com painel mobile-first para entregadores.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura](#estrutura)
- [API](#api)

## 🎯 Visão Geral

O sistema de entregadores permite que os entregadores:
- Recebam notificações de novas entregas
- Gerenciem suas rotas em tempo real
- Confirmem entregas pelo celular
- Acompanhem ganhos e comissões
- Tenham contato direto com clientes via telefone/WhatsApp

## ✨ Funcionalidades

### 1. **Notificações de Entrega**
- Notificação por SMS e/ou email quando nova entrega for atribuída
- Contém: nome cliente, contato, endereço, produto, observações, comissão

### 2. **Dashboard**
- Total de entregas atribuídas
- Total de entregas concluídas
- Total de entregas pendentes
- Valor ganho no mês atual
- Valor total acumulado
- Taxa de conclusão
- Próximas entregas

### 3. **Lista de Entregas**
- Código da entrega
- Dados do cliente
- Endereço completo
- Produto a entregar
- Status (Pendente, Em Rota, Entregue, Cancelada)
- Ações: Ver detalhes, Iniciar rota, Confirmar

### 4. **Histórico de Ganhos**
- Quantidade de entregas por mês
- Valor total ganho por mês
- Filtro por ano
- Gráfico de desempenho

### 5. **Confirmação de Entrega**
- Marcar como concluída
- Registrar observações
- Data e hora automáticas

### 6. **Pagamentos**
- Comissões pagas
- Comissões pendentes
- Histórico de transferências

### 7. **Perfil**
- Dados pessoais
- CPF
- Veículo
- Dados bancários (PIX, banco, agência, conta)

### 8. **Comunicação**
- Botão para ligar cliente
- Botão WhatsApp
- Integração com GPS para rotas

## 🚀 Instalação

### Backend

1. **Execute o schema no Supabase:**
```sql
-- Executar backend/entregadores-schema.sql no SQL Editor do Supabase
```

2. **Instale dependências:**
```bash
cd backend
npm install
```

3. **Configure variáveis de ambiente:**
```env
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_aqui
JWT_SECRET=sua_chave_secreta
```

4. **Adicione rotas ao servidor:**
```javascript
// backend/src/server.js
const entregadoresRoutes = require('./routes/entregadores');
app.use('/api/entregadores', entregadoresRoutes);
```

5. **Inicie o servidor:**
```bash
npm start
```

### Frontend

Os arquivos estão em: `fornecedor/entregadores/`

**Acesso:**
- Login: `entregador-login.html`
- Painel: `painel-entregador.html`

## 💻 Uso

### Modo Demo (Padrão)

O sistema está em **modo demonstração** para testes sem backend.

Para acessar:
1. Abra `fornecedor/entregadores/painel-entregador.html` diretamente
2. Veja todas as funcionalidades com dados de exemplo

### Modo Produção

1. Configure o backend (Supabase)
2. Em `scripts/painel-entregador.js`, mude:
```javascript
const MODO_DEMO = false; // linha 5
```

3. Crie um entregador de teste:
```javascript
// backend/criar-entregador.js
const Entregador = require('./src/models/Entregador');
const bcrypt = require('bcryptjs');

async function criarEntregadorTeste() {
    const senha_hash = await bcrypt.hash('senha123', 10);
    
    const entregador = await Entregador.criar({
        nome: 'João Silva',
        email: 'joao@entregador.com',
        senha_hash,
        telefone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        veiculo: 'Moto Honda CG 160',
        ativo: true
    });
    
    console.log('Entregador criado:', entregador);
}

criarEntregadorTeste();
```

4. Execute:
```bash
node backend/criar-entregador.js
```

5. Faça login com:
   - Email: `joao@entregador.com`
   - Senha: `senha123`

## 📁 Estrutura

```
fornecedor/entregadores/
├── entregador-login.html          # Página de login
├── painel-entregador.html         # Painel principal
├── css/
│   ├── entregador-login.css       # Estilos do login
│   └── painel-entregador.css      # Estilos do painel (mobile-first)
└── scripts/
    ├── entregador-login.js        # Lógica de login
    └── painel-entregador.js       # Lógica do painel + modo demo

backend/
├── entregadores-schema.sql        # Schema do banco de dados
├── src/
│   ├── models/
│   │   └── Entregador.js          # Model do entregador
│   ├── controllers/
│   │   └── EntregadorController.js # Controller com endpoints
│   ├── middleware/
│   │   └── autenticarEntregador.js # Middleware de autenticação
│   └── routes/
│       └── entregadores.js        # Rotas da API
```

## 🔌 API

### Endpoints

#### **POST** `/api/entregadores/login`
Login do entregador
```json
{
  "email": "joao@entregador.com",
  "senha": "senha123"
}
```

#### **GET** `/api/entregadores/dashboard`
Estatísticas do dashboard (requer autenticação)

#### **GET** `/api/entregadores/entregas?status=pendente`
Listar entregas (requer autenticação)

#### **PATCH** `/api/entregadores/entregas/:id/status`
Atualizar status da entrega (requer autenticação)
```json
{
  "status": "em_rota",
  "observacoes": "A caminho"
}
```

#### **PATCH** `/api/entregadores/entregas/:id/confirmar`
Confirmar entrega (requer autenticação)
```json
{
  "observacoes": "Entregue com sucesso"
}
```

#### **GET** `/api/entregadores/ganhos?ano=2026`
Histórico de ganhos (requer autenticação)

#### **GET** `/api/entregadores/pagamentos`
Histórico de pagamentos (requer autenticação)

#### **GET** `/api/entregadores/perfil`
Obter perfil (requer autenticação)

#### **PUT** `/api/entregadores/perfil`
Atualizar perfil (requer autenticação)
```json
{
  "nome": "João Silva",
  "telefone": "(11) 98765-4321",
  "veiculo": "Moto Honda CG 160",
  "pix": "123.456.789-00",
  "banco": "Banco Exemplo",
  "agencia": "1234",
  "conta": "12345-6"
}
```

## 📱 Design Mobile-First

O sistema foi desenvolvido com **mobile-first**, pensando que entregadores usarão principalmente smartphones:

### Mobile (< 768px)
- Bottom navigation bar (5 ícones)
- Cards empilhados verticalmente
- Botões grandes e touch-friendly
- Tabelas com scroll horizontal

### Tablet (768px+)
- Sidebar lateral
- Grid de 2-3 colunas
- Mais informações visíveis

### Desktop (1024px+)
- Layout completo
- Sidebar expandida
- Todas as colunas visíveis

## 🔒 Segurança

- Autenticação via JWT
- Senhas criptografadas com bcrypt
- Row Level Security (RLS) no Supabase
- Middleware de autenticação em rotas protegidas

## 🎨 Design

- **Tema:** Fundo preto com estrelas flutuantes (igual ao site)
- **Cor primária:** Prata (#c0c0c0)
- **Responsivo:** Mobile-first
- **Animações:** Estrelas flutuando suavemente

## 📞 Funcionalidades Especiais

### Contato com Cliente
- **Ligar:** Abre discador do celular
- **WhatsApp:** Abre conversa direta

### GPS e Rotas
- Botão "🗺️ Rota" abre Google Maps com direções
- Navegação turn-by-turn

### Notificações (Preparado)
Backend preparado para enviar:
- SMS via Twilio
- Email via SendGrid
- Notificações push

## 🐛 Troubleshooting

### Não consigo fazer login
- Verifique se o backend está rodando
- Confirme se criou um usuário no banco
- Veja console do navegador para erros

### Modo demo não desliga
- Certifique-se de mudar `MODO_DEMO = false` em `painel-entregador.js`

### Entregas não aparecem
- Verifique se há entregas no banco de dados
- Confirme que `entregador_id` está correto
- Veja logs do servidor

## 📝 Próximos Passos

1. ✅ Sistema completo funcionando em modo demo
2. ⏳ Configurar Supabase
3. ⏳ Integrar notificações (SMS/Email)
4. ⏳ Implementar notificações em tempo real
5. ⏳ Adicionar chat interno com admin

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Veja os logs do console
3. Teste em modo demo primeiro

---

**Desenvolvido para Universo da Prata** 🚚✨
