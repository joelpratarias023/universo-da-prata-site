# 📚 Guia Completo - Painel de Administração

## 🎯 Visão Geral

O painel administrativo do Universo da Prata foi criado para que você possa gerenciar todos os aspectos do seu negócio em um único lugar. É totalmente funcional e pronto para uso!

## 🚀 Como Acessar

### Opção 1: Página de Acesso
```html
http://seu-site.com/admin-access.html
```

### Opção 2: Diretamente
```html
http://seu-site.com/painel-admin/admin-completo.html
```

## 📊 Dashboard - Visão Geral do Negócio

Ao abrir o painel, você verá o Dashboard com 6 cards principais:

```
┌─────────────────────────────────────────────────────┐
│                    DASHBOARD                        │
├─────────────────────────────────────────────────────┤
│  📦 Produtos    │  🚚 Entregadores  │  🛍️ Pedidos  │
│       23        │         5         │      12      │
├─────────────────────────────────────────────────────┤
│  👥 Clientes   │  💰 Vendas Hoje  │  ⭐ Rating   │
│       45        │   1.250 AKZ      │    4.8       │
└─────────────────────────────────────────────────────┘
```

## 🛒 Seção 1: Produtos

### Adicionar um Novo Produto

1. Clique em **"📦 Produtos"** no menu lateral
2. Clique no botão **"➕ Adicionar Novo Produto"**
3. Preencha o formulário:

   ```
   Nome do Produto:     [Digite o nome]
   Descrição:           [Descrição detalhada]
   Categoria:           [Selecione a categoria]
   Preço (AKZ):         [Ex: 50.00]
   Estoque:             [Ex: 100]
   URL da Imagem:       [Link da imagem]
   ```

4. Clique em **"Salvar"**
5. O produto aparecerá imediatamente na tabela

### Ver Produtos

A tabela mostra:
- **ID**: Código único do produto
- **Nome**: Nome do produto
- **Categoria**: Categoria selecionada
- **Preço**: Valor em AKZ
- **Estoque**: Unidades disponíveis
- **Imagem**: Thumbnail
- **Ações**: Editar ou Deletar

### Filtrar Produtos

```
┌─────────────────────────────────────┐
│ 🔍 Buscar por nome: [____]          │
│ 📁 Categoria: [Selecione ▼]  🔎    │
└─────────────────────────────────────┘
```

Comece a digitar o nome ou selecione uma categoria para filtrar.

### Editar um Produto

1. Localize o produto na tabela
2. Clique no botão **"✏️ Editar"**
3. Modifique os dados desejados
4. Clique em **"Salvar"**

### Deletar um Produto

1. Localize o produto na tabela
2. Clique no botão **"🗑️ Deletar"**
3. Confirme a deleção

---

## 🚚 Seção 2: Entregadores

### Adicionar um Novo Entregador

1. Clique em **"🚚 Entregadores"** no menu lateral
2. Clique em **"➕ Adicionar Novo Entregador"**
3. Preencha o formulário:

   ```
   Nome do Entregador:  [Digite o nome]
   Telefone:            [Ex: +244 923 456 789]
   Email (opcional):    [Email do entregador]
   Zona de Cobertura:   [Ex: Centro, Periférico]
   Status:              [Ativo / Inativo]
   Comissão (%):        [Ex: 10]
   ```

4. Clique em **"Salvar"**

### Status dos Entregadores

Os entregadores têm dois status possíveis:
- 🟢 **Ativo** (pode receber pedidos)
- 🔴 **Inativo** (não recebe pedidos)

### Ver Entregas

Cada entregador mostra:
- Número de entregas realizadas
- Status atual
- Zona de atuação
- Comissão percentual

### Gerenciar Entregadores

- **Editar**: Clique ✏️ para atualizar informações
- **Deletar**: Clique 🗑️ para remover da lista
- **Filtrar**: Busque por nome ou status

---

## 🛍️ Seção 3: Pedidos

### Ver Todos os Pedidos

A tabela exibe:
- **ID do Pedido**: Código único
- **Cliente**: Nome do cliente
- **Valor**: Total do pedido
- **Data**: Data do pedido
- **Entregador**: Quem vai entregar
- **Status**: Situação atual (cores diferentes)

### Status dos Pedidos

```
🟡 Pendente    → Aguardando confirmação
🟢 Entregue    → Pedido entregue
🔴 Cancelado   → Pedido cancelado
🔵 Em Trânsito → Sendo entregue
```

### Ver Detalhes do Pedido

1. Localize o pedido na tabela
2. Clique em **"👁️ Ver"**
3. Uma janela mostrará:
   - Informações do cliente
   - Endereço de entrega
   - Itens do pedido
   - Valor total
   - Entregador responsável
   - Status atual

4. Você pode **Atualizar o Status** selecionando um novo status

### Filtrar Pedidos

```
┌─────────────────────────────────────┐
│ 🔍 Buscar ID/Cliente: [____]        │
│ 📊 Status: [Todos ▼]  🔎           │
└─────────────────────────────────────┘
```

---

## 👥 Seção 4: Clientes

### Ver Todos os Clientes

A tabela mostra:
- **Nome**: Nome do cliente
- **Telefone**: Contato
- **Email**: Email (se registrado)
- **Endereço**: Endereço de entrega
- **Pedidos**: Quantidade de compras
- **Gasto Total**: Valor total gasto
- **Ação**: Deletar cliente

### Filtrar Clientes

Procure por:
- Nome do cliente
- Número de telefone
- Endereço de email

Simplesmente comece a digitar no campo de busca.

### Deletar um Cliente

1. Localize o cliente na tabela
2. Clique em **"🗑️ Deletar"**
3. Confirme a exclusão

---

## 📈 Seção 5: Relatórios

### Estatísticas do Negócio

O painel de relatórios mostra:

#### Produtos Mais Vendidos
```
1. 💍 Pulseira de Prata - 45 unidades
2. 💎 Anel Dourado - 38 unidades
3. 🔗 Corrente de Ouro - 32 unidades
...
```

#### Entregadores Mais Produtivos
```
1. João Silva - 156 entregas
2. Maria Santos - 142 entregas
3. Pedro Costa - 128 entregas
...
```

#### Métricas Importantes
- **Ticket Médio**: Valor médio por pedido
- **Taxa de Conversão**: Percentual de sucesso
- **Tempo Médio de Entrega**: Horas para entregar

---

## ⚙️ Seção 6: Configurações

### Dados da Loja

Defina as informações principais:
- **Nome da Loja**: Universo da Prata
- **Telefone Principal**: +244 923 456 789
- **Email da Loja**: contato@universo-prata.com
- **Horário de Atendimento**: 8h às 18h

### Gerenciador de Categorias

#### Adicionar Nova Categoria

1. Digite o nome da categoria
2. Clique em **"Adicionar Categoria"**
3. A categoria aparecerá como uma tag

```
[Jóias] [Anéis] [Pulseiras] [Colares] [×]
```

#### Deletar Categoria

Clique no botão **"×"** da categoria que deseja remover.

### Backup e Restauração de Dados

#### Fazer Backup 💾

Clique em **"Fazer Backup"** para:
- Baixar um arquivo JSON com todos os dados
- Arquivo nomeado como: `backup-universo-prata-2025-01-15.json`
- Guarde este arquivo em local seguro

**Quando fazer backup:**
- Antes de grandes mudanças
- Diariamente (como procedimento padrão)
- Antes de atualizar o navegador/SO

#### Restaurar Backup 📂

1. Clique em **"Restaurar Backup"**
2. Selecione o arquivo JSON
3. Os dados serão restaurados automaticamente
4. O navegador vai recarregar

---

## 🎨 Interface e Design

### Cores Significativas

```
🟡 Amarelo (#ffd700) → Ação principal, destaque
🟢 Verde (#22c55e)   → Sucesso, ativo
🔴 Vermelho (#ef4444) → Erro, inativo
🔵 Azul (#3b82f6)    → Informação, editar
⚪ Cinza (#aaa)      → Texto secundário
```

### Responsividade

- **Desktop (1200px+)**: Layout completo com menu lateral
- **Tablet (768px-1199px)**: Menu mobile com hamburguer
- **Celular (<768px)**: Interface otimizada touch

### Navegação

```
Menu Lateral (Sidebar)
├── 📊 Dashboard
├── 📦 Produtos
├── 🚚 Entregadores
├── 🛍️ Pedidos
├── 👥 Clientes
├── 📈 Relatórios
└── ⚙️ Configurações

Em mobile: ≡ (hamburguer)
```

---

## 🔔 Sistema de Notificações

Todas as ações mostram notificações:

```
✅ Sucesso - Verde (Produto adicionado com sucesso!)
❌ Erro - Vermelho (Preencha todos os campos!)
⚠️ Aviso - Amarelo (Tem certeza?)
ℹ️ Info - Azul (Dados carregados)
```

As notificações:
- Aparecem no topo da tela
- Somem automaticamente após 3-4 segundos
- Podem ser fechadas manualmente

---

## 💾 Armazenamento de Dados

### Onde os dados ficam?

Os dados são salvos no **localStorage** do seu navegador:
- ✅ Offline: Funciona sem internet
- ✅ Local: Dados não saem do seu computador
- ✅ Seguro: Só você acessa
- ✅ Rápido: Carregamento instantâneo

### Estrutura de Dados

```javascript
localStorage.getItem('universo_produtos')
→ [
    {id, nome, descrição, categoria, preço, estoque, imagem},
    ...
]

localStorage.getItem('universo_entregadores')
→ [
    {id, nome, telefone, email, zona, status, comissão, entregas},
    ...
]

localStorage.getItem('universo_pedidos')
→ [
    {id, cliente, valor, data, entregador, status},
    ...
]
```

---

## ⌨️ Atalhos e Dicas

### Dicas Úteis

1. **Busca Rápida**: Use Ctrl+F para buscar na tabela
2. **Copiar Dados**: Selecione e Ctrl+C
3. **Voltar ao Dashboard**: Clique no logo no topo
4. **Mobile**: Use 2 dedos para rolar as tabelas

### Validações

O sistema valida automaticamente:
- ✓ Campos obrigatórios preenchidos
- ✓ Formato de email válido
- ✓ Preços e quantidades numéricas
- ✓ URLs de imagens válidas

---

## 🆘 Resolução de Problemas

### Problema: Dados desapareceram

**Solução**: 
1. Restaure o último backup
2. Limpe o cache e tente novamente
3. Procure por outro arquivo de backup

### Problema: Não consigo fazer upload de imagem

**Solução**:
1. Use um URL direto (não local)
2. Certifique-se que a imagem existe
3. Tente com uma URL de teste

### Problema: Formulário não envia

**Solução**:
1. Verifique campos em vermelho
2. Recarregue a página
3. Tente em outro navegador

### Problema: Menu não aparece em mobile

**Solução**:
1. Clique no ≡ (hamburguer)
2. Tente rotacionar a tela
3. Limpe o cache do navegador

---

## 📞 Suporte

Para questões ou problemas:
1. Verifique a conexão de internet
2. Tente em outro navegador
3. Limpe o cache e cookies
4. Faça backup dos dados
5. Entre em contato com suporte

---

## 🎓 Tutoriais Rápidos

### Tutorial 1: Adicionar seu primeiro produto

```
1. Click em "Produtos"
2. Click "➕ Adicionar Novo Produto"
3. Nome: Meu Primeiro Produto
4. Descrição: Descrição bonita
5. Categoria: Jóias
6. Preço: 50
7. Estoque: 100
8. Imagem: (URL de uma imagem)
9. Click "Salvar"
✅ Pronto! Seu produto está no sistema
```

### Tutorial 2: Gerenciar um entregador

```
1. Click em "Entregadores"
2. Click "➕ Adicionar Novo Entregador"
3. Nome: João Silva
4. Telefone: +244 923 456 789
5. Email: joao@email.com
6. Zona: Centro
7. Status: Ativo
8. Comissão: 10%
9. Click "Salvar"
✅ Entregador adicionado e pronto para começar!
```

### Tutorial 3: Fazer backup

```
1. Click em "Configurações"
2. Role até "Segurança"
3. Click "Fazer Backup"
4. Arquivo será baixado automaticamente
5. Guarde em pasta segura
✅ Backup salvo! Dados protegidos!
```

---

## 📋 Checklist de Configuração Inicial

- [ ] Definir dados da loja
- [ ] Adicionar 2-3 categorias
- [ ] Adicionar 3-5 produtos de teste
- [ ] Adicionar entregadores
- [ ] Testar adicionar um pedido
- [ ] Fazer primeiro backup
- [ ] Testar restauração de backup
- [ ] Treinar toda a equipe

---

## ✅ Conclusão

Seu painel de administração está **100% funcional e pronto para usar**!

Se tiver dúvidas, consulte este guia ou faça um backup e experimente!

**Bom uso! 🎉**

---

**Versão**: 1.0  
**Última atualização**: 2025-01  
**Status**: ✅ Produção Pronta
