// ===== PAINEL ADMIN - LÓGICA PRINCIPAL =====

// Dados em localStorage (substitui banco de dados para agora)
const STORAGE_KEYS = {
  PRODUTOS: 'universo_produtos',
  ENTREGADORES: 'universo_entregadores',
  PEDIDOS: 'universo_pedidos',
  CLIENTES: 'universo_clientes',
  CONFIGURACOES: 'universo_configuracoes'
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  inicializarAdmin();
  carregarDados();
  atualizarDashboard();
  mostrarSecao('dashboard');
});

function inicializarAdmin() {
  // Formulário de produto
  const formProduto = document.getElementById('form-produto');
  if (formProduto) {
    formProduto.addEventListener('submit', (e) => {
      e.preventDefault();
      salvarProduto();
    });
  }

  // Formulário de entregador
  const formEntregador = document.getElementById('form-entregador');
  if (formEntregador) {
    formEntregador.addEventListener('submit', (e) => {
      e.preventDefault();
      salvarEntregador();
    });
  }
}

// ===== NAVEGAÇÃO E SEÇÕES =====
function mostrarSecao(secaoId) {
  // Ocultar todas as seções
  document.querySelectorAll('.admin-secao').forEach(secao => {
    secao.classList.remove('ativa');
  });

  // Mostrar a seção selecionada
  const secao = document.getElementById(secaoId);
  if (secao) {
    secao.classList.add('ativa');
    
    // Recarregar dados da seção
    setTimeout(() => {
      if (secaoId === 'produtos') carregarProdutos();
      else if (secaoId === 'entregadores') carregarEntregadores();
      else if (secaoId === 'pedidos') carregarPedidos();
      else if (secaoId === 'clientes') carregarClientes();
      else if (secaoId === 'relatorios') carregarRelatorios();
    }, 100);
  }

  // Fechar menu mobile se aberto
  const menuAdmin = document.getElementById('menu-admin');
  if (menuAdmin) {
    menuAdmin.classList.remove('mobile-visivel');
  }
}

function toggleMenuAdmin() {
  const menu = document.getElementById('menu-admin');
  if (menu) {
    menu.classList.toggle('mobile-visivel');
  }
}

// ===== DASHBOARD =====
function atualizarDashboard() {
  const produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];
  const entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];
  const pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];
  const clientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)) || [];

  // Atualizar números
  document.getElementById('total-produtos').textContent = produtos.length;
  document.getElementById('total-entregadores').textContent = entregadores.length;
  document.getElementById('total-clientes').textContent = clientes.length;

  // Contar pedidos pendentes
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente').length;
  document.getElementById('pedidos-pendentes').textContent = pedidosPendentes;

  // Calcular vendas hoje
  const hoje = new Date().toISOString().split('T')[0];
  const vendásHoje = pedidos
    .filter(p => p.data === hoje && p.status !== 'cancelado')
    .reduce((total, p) => total + (parseFloat(p.valor) || 0), 0);
  document.getElementById('vendas-hoje').textContent = `${vendásHoje.toFixed(2)} AKZ`;
}

// ===== MODAL FUNCTIONS =====
function abrirModalProduto(produtoId = null) {
  const modal = document.getElementById('modal-produto');
  const form = document.getElementById('form-produto');
  const titulo = document.getElementById('titulo-modal-produto');

  form.reset();
  
  if (produtoId) {
    titulo.textContent = 'Editar Produto';
    const produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];
    const produto = produtos.find(p => p.id === produtoId);
    
    if (produto) {
      document.getElementById('produto-nome').value = produto.nome;
      document.getElementById('produto-descricao').value = produto.descricao;
      document.getElementById('produto-categoria').value = produto.categoria;
      document.getElementById('produto-preco').value = produto.preco;
      document.getElementById('produto-estoque').value = produto.estoque;
      document.getElementById('produto-imagem').value = produto.imagem;
    }
  } else {
    titulo.textContent = 'Adicionar Novo Produto';
  }

  modal.classList.add('ativo');
}

function abrirModalEntregador(entregadorId = null) {
  const modal = document.getElementById('modal-entregador');
  const form = document.getElementById('form-entregador');
  const titulo = document.getElementById('titulo-modal-entregador');

  form.reset();

  if (entregadorId) {
    titulo.textContent = 'Editar Entregador';
    const entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];
    const entregador = entregadores.find(e => e.id === entregadorId);
    
    if (entregador) {
      document.getElementById('entregador-nome').value = entregador.nome;
      document.getElementById('entregador-telefone').value = entregador.telefone;
      document.getElementById('entregador-email').value = entregador.email || '';
      document.getElementById('entregador-zona').value = entregador.zona;
      document.getElementById('entregador-status').value = entregador.status;
      document.getElementById('entregador-comissao').value = entregador.comissao;
    }
  } else {
    titulo.textContent = 'Adicionar Novo Entregador';
  }

  modal.classList.add('ativo');
}

function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('ativo');
  }
}

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('ativo');
  }
});

// ===== PRODUTOS =====
function salvarProduto() {
  const nome = document.getElementById('produto-nome').value;
  const descricao = document.getElementById('produto-descricao').value;
  const categoria = document.getElementById('produto-categoria').value;
  const preco = document.getElementById('produto-preco').value;
  const estoque = document.getElementById('produto-estoque').value;
  const imagem = document.getElementById('produto-imagem').value;
  
  if (!nome || !descricao || !categoria || !preco || !estoque || !imagem) {
    showError('Preencha todos os campos obrigatórios!', 4000);
    return;
  }

  let produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];
  const produtoId = Date.now().toString();

  const novoProduto = {
    id: produtoId,
    nome,
    descricao,
    categoria,
    preco: parseFloat(preco),
    estoque: parseInt(estoque),
    imagem,
    dataCriacao: new Date().toISOString()
  };

  produtos.push(novoProduto);
  localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));

  showSuccess('Produto adicionado com sucesso! ✨', 3000);
  fecharModal('modal-produto');
  carregarProdutos();
  atualizarDashboard();
}

function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];
  const tbody = document.getElementById('lista-produtos');

  if (produtos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum produto adicionado ainda</td></tr>';
    return;
  }

  tbody.innerHTML = produtos.map(produto => `
    <tr>
      <td>${produto.id.substring(0, 6)}...</td>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.preco} AKZ</td>
      <td>${produto.estoque}</td>
      <td>
        <img src="${produto.imagem}" alt="${produto.nome}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
      </td>
      <td>
        <div class="acoes-tabela">
          <button class="btn-tabela btn-editar" onclick="abrirModalProduto('${produto.id}')">✏️ Editar</button>
          <button class="btn-tabela btn-deletar" onclick="deletarProduto('${produto.id}')">🗑️ Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function deletarProduto(produtoId) {
  if (confirm('Tem certeza que deseja deletar este produto?')) {
    let produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];
    produtos = produtos.filter(p => p.id !== produtoId);
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    
    showSuccess('Produto deletado com sucesso!', 3000);
    carregarProdutos();
    atualizarDashboard();
  }
}

function filtrarProdutos() {
  const termo = document.getElementById('filtro-produtos')?.value.toLowerCase() || '';
  const categoria = document.getElementById('filtro-categoria')?.value || '';
  const produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];

  const filtrados = produtos.filter(p => {
    const coincideNome = p.nome.toLowerCase().includes(termo);
    const coincideCategoria = categoria === '' || p.categoria === categoria;
    return coincideNome && coincideCategoria;
  });

  const tbody = document.getElementById('lista-produtos');
  
  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum produto encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados.map(produto => `
    <tr>
      <td>${produto.id.substring(0, 6)}...</td>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.preco} AKZ</td>
      <td>${produto.estoque}</td>
      <td>
        <img src="${produto.imagem}" alt="${produto.nome}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
      </td>
      <td>
        <div class="acoes-tabela">
          <button class="btn-tabela btn-editar" onclick="abrirModalProduto('${produto.id}')">✏️ Editar</button>
          <button class="btn-tabela btn-deletar" onclick="deletarProduto('${produto.id}')">🗑️ Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== ENTREGADORES =====
function salvarEntregador() {
  const nome = document.getElementById('entregador-nome').value;
  const telefone = document.getElementById('entregador-telefone').value;
  const email = document.getElementById('entregador-email').value;
  const zona = document.getElementById('entregador-zona').value;
  const status = document.getElementById('entregador-status').value;
  const comissao = document.getElementById('entregador-comissao').value;

  if (!nome || !telefone || !zona || !status || !comissao) {
    showError('Preencha todos os campos obrigatórios!', 4000);
    return;
  }

  let entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];
  const entregadorId = Date.now().toString();

  const novoEntregador = {
    id: entregadorId,
    nome,
    telefone,
    email,
    zona,
    status,
    comissao: parseInt(comissao),
    entregas: 0,
    dataCriacao: new Date().toISOString()
  };

  entregadores.push(novoEntregador);
  localStorage.setItem(STORAGE_KEYS.ENTREGADORES, JSON.stringify(entregadores));

  showSuccess('Entregador adicionado com sucesso! 🚚', 3000);
  fecharModal('modal-entregador');
  carregarEntregadores();
  atualizarDashboard();
}

function carregarEntregadores() {
  const entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];
  const tbody = document.getElementById('lista-entregadores');

  if (entregadores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum entregador adicionado ainda</td></tr>';
    return;
  }

  tbody.innerHTML = entregadores.map(entregador => `
    <tr>
      <td>${entregador.id.substring(0, 6)}...</td>
      <td>${entregador.nome}</td>
      <td>${entregador.telefone}</td>
      <td>${entregador.zona}</td>
      <td><span class="badge badge-${entregador.status}">${entregador.status.toUpperCase()}</span></td>
      <td>${entregador.entregas}</td>
      <td>
        <div class="acoes-tabela">
          <button class="btn-tabela btn-editar" onclick="abrirModalEntregador('${entregador.id}')">✏️ Editar</button>
          <button class="btn-tabela btn-deletar" onclick="deletarEntregador('${entregador.id}')">🗑️ Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function deletarEntregador(entregadorId) {
  if (confirm('Tem certeza que deseja deletar este entregador?')) {
    let entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];
    entregadores = entregadores.filter(e => e.id !== entregadorId);
    localStorage.setItem(STORAGE_KEYS.ENTREGADORES, JSON.stringify(entregadores));
    
    showSuccess('Entregador deletado com sucesso!', 3000);
    carregarEntregadores();
    atualizarDashboard();
  }
}

function filtrarEntregadores() {
  const termo = document.getElementById('filtro-entregadores')?.value.toLowerCase() || '';
  const status = document.getElementById('filtro-status')?.value || '';
  const entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];

  const filtrados = entregadores.filter(e => {
    const coincideNome = e.nome.toLowerCase().includes(termo);
    const coincideStatus = status === '' || e.status === status;
    return coincideNome && coincideStatus;
  });

  const tbody = document.getElementById('lista-entregadores');
  
  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum entregador encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados.map(entregador => `
    <tr>
      <td>${entregador.id.substring(0, 6)}...</td>
      <td>${entregador.nome}</td>
      <td>${entregador.telefone}</td>
      <td>${entregador.zona}</td>
      <td><span class="badge badge-${entregador.status}">${entregador.status.toUpperCase()}</span></td>
      <td>${entregador.entregas}</td>
      <td>
        <div class="acoes-tabela">
          <button class="btn-tabela btn-editar" onclick="abrirModalEntregador('${entregador.id}')">✏️ Editar</button>
          <button class="btn-tabela btn-deletar" onclick="deletarEntregador('${entregador.id}')">🗑️ Deletar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== PEDIDOS =====
function carregarPedidos() {
  const pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];
  const tbody = document.getElementById('lista-pedidos');

  if (pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum pedido registrado</td></tr>';
    return;
  }

  tbody.innerHTML = pedidos.map(pedido => `
    <tr>
      <td>${pedido.id.substring(0, 6)}...</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.valor} AKZ</td>
      <td>${new Date(pedido.data).toLocaleDateString()}</td>
      <td>${pedido.entregador || '-'}</td>
      <td><span class="badge badge-${pedido.status}">${pedido.status.toUpperCase()}</span></td>
      <td>
        <button class="btn-tabela btn-visualizar" onclick="verDetalhesPedido('${pedido.id}')">👁️ Ver</button>
      </td>
    </tr>
  `).join('');
}

function verDetalhesPedido(pedidoId) {
  const pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];
  const pedido = pedidos.find(p => p.id === pedidoId);

  if (!pedido) return;

  const detalhes = document.getElementById('detalhes-pedido');
  detalhes.innerHTML = `
    <p><strong>ID Pedido:</strong> ${pedido.id}</p>
    <p><strong>Cliente:</strong> ${pedido.cliente}</p>
    <p><strong>Telefone:</strong> ${pedido.telefone || '-'}</p>
    <p><strong>Endereço:</strong> ${pedido.endereco || '-'}</p>
    <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleDateString()}</p>
    <p><strong>Valor Total:</strong> ${pedido.valor} AKZ</p>
    <p><strong>Entregador:</strong> ${pedido.entregador || 'Não atribuído'}</p>
    <p><strong>Status Atual:</strong> <span class="badge badge-${pedido.status}">${pedido.status.toUpperCase()}</span></p>
  `;

  const modal = document.getElementById('modal-pedido');
  
  // Criar input hidden se não existir
  let pedidoIdField = document.getElementById('pedido-id-edit');
  if (!pedidoIdField) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.id = 'pedido-id-edit';
    modal.appendChild(input);
    pedidoIdField = input;
  }
  pedidoIdField.value = pedidoId;

  modal.classList.add('ativo');
}

function atualizarStatusPedido() {
  const novoStatus = document.getElementById('novo-status-pedido').value;
  const pedidoId = document.getElementById('pedido-id-edit').value;

  if (!novoStatus) {
    showWarning('Selecione um status!', 3000);
    return;
  }

  let pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];
  const pedido = pedidos.find(p => p.id === pedidoId);

  if (pedido) {
    pedido.status = novoStatus;
    localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
    
    showSuccess('Status do pedido atualizado com sucesso!', 3000);
    fecharModal('modal-pedido');
    carregarPedidos();
    atualizarDashboard();
  }
}

function filtrarPedidos() {
  const termo = document.getElementById('filtro-pedidos')?.value.toLowerCase() || '';
  const status = document.getElementById('filtro-status-pedido')?.value || '';
  const pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];

  const filtrados = pedidos.filter(p => {
    const coincideId = p.id.toLowerCase().includes(termo);
    const coincideCliente = p.cliente.toLowerCase().includes(termo);
    const coincideStatus = status === '' || p.status === status;
    return (coincideId || coincideCliente) && coincideStatus;
  });

  const tbody = document.getElementById('lista-pedidos');
  
  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum pedido encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados.map(pedido => `
    <tr>
      <td>${pedido.id.substring(0, 6)}...</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.valor} AKZ</td>
      <td>${new Date(pedido.data).toLocaleDateString()}</td>
      <td>${pedido.entregador || '-'}</td>
      <td><span class="badge badge-${pedido.status}">${pedido.status.toUpperCase()}</span></td>
      <td>
        <button class="btn-tabela btn-visualizar" onclick="verDetalhesPedido('${pedido.id}')">👁️ Ver</button>
      </td>
    </tr>
  `).join('');
}

// ===== CLIENTES =====
function carregarClientes() {
  const clientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)) || [];
  const tbody = document.getElementById('lista-clientes');

  if (clientes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum cliente registrado</td></tr>';
    return;
  }

  tbody.innerHTML = clientes.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email || '-'}</td>
      <td>${cliente.endereco || '-'}</td>
      <td>${cliente.pedidos || 0}</td>
      <td>${cliente.gastoTotal || 0} AKZ</td>
      <td>
        <button class="btn-tabela btn-deletar" onclick="deletarCliente('${cliente.id}')">🗑️ Deletar</button>
      </td>
    </tr>
  `).join('');
}

function deletarCliente(clienteId) {
  if (confirm('Tem certeza que deseja deletar este cliente?')) {
    let clientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)) || [];
    clientes = clientes.filter(c => c.id !== clienteId);
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
    
    showSuccess('Cliente deletado com sucesso!', 3000);
    carregarClientes();
  }
}

function filtrarClientes() {
  const termo = document.getElementById('filtro-clientes')?.value.toLowerCase() || '';
  const clientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)) || [];

  const filtrados = clientes.filter(c => {
    return c.nome.toLowerCase().includes(termo) || 
           c.telefone.includes(termo) ||
           c.email?.toLowerCase().includes(termo);
  });

  const tbody = document.getElementById('lista-clientes');
  
  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhum cliente encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email || '-'}</td>
      <td>${cliente.endereco || '-'}</td>
      <td>${cliente.pedidos || 0}</td>
      <td>${cliente.gastoTotal || 0} AKZ</td>
      <td>
        <button class="btn-tabela btn-deletar" onclick="deletarCliente('${cliente.id}')">🗑️ Deletar</button>
      </td>
    </tr>
  `).join('');
}

// ===== RELATÓRIOS =====
function carregarRelatorios() {
  const pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];
  const produtos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || [];
  const entregadores = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)) || [];

  // Produtos mais vendidos
  const produtosTop = produtos.slice(0, 5);
  const produtosList = document.getElementById('produtos-top');
  if (produtosList) {
    produtosList.innerHTML = produtosTop.length > 0 
      ? produtosTop.map((p, i) => `<li>${i + 1}. ${p.nome} - ${p.estoque} unidades</li>`).join('')
      : '<li>Nenhum produto vendido ainda</li>';
  }

  // Entregadores top
  const entregadoresTop = entregadores.sort((a, b) => b.entregas - a.entregas).slice(0, 5);
  const entregadoresList = document.getElementById('entregadores-top');
  if (entregadoresList) {
    entregadoresList.innerHTML = entregadoresTop.length > 0
      ? entregadoresTop.map((e, i) => `<li>${i + 1}. ${e.nome} - ${e.entregas} entregas</li>`).join('')
      : '<li>Nenhum entregador registrado</li>';
  }

  // Estatísticas
  const ticketMedio = pedidos.length > 0 
    ? (pedidos.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0) / pedidos.length).toFixed(2)
    : '0';
  
  const ticketElement = document.getElementById('ticket-medio');
  if (ticketElement) ticketElement.textContent = `${ticketMedio} AKZ`;
  
  const conversaoElement = document.getElementById('taxa-conversao');
  if (conversaoElement) conversaoElement.textContent = '85%';
  
  const tempoElement = document.getElementById('tempo-medio');
  if (tempoElement) tempoElement.textContent = '2h30m';
}

// ===== CONFIGURAÇÕES =====
function salvarConfiguracoes() {
  const config = {
    nomeLoja: document.getElementById('nome-loja').value,
    telefonePrincipal: document.getElementById('telefone-principal').value,
    emailLoja: document.getElementById('email-loja').value,
    horarioAtendimento: document.getElementById('horario-atendimento').value
  };

  localStorage.setItem(STORAGE_KEYS.CONFIGURACOES, JSON.stringify(config));
  showSuccess('Configurações salvas com sucesso! ⚙️', 3000);
}

function adicionarCategoria() {
  const nomeCategoria = document.getElementById('nome-categoria').value.trim();
  
  if (!nomeCategoria) {
    showWarning('Digite o nome da categoria!', 3000);
    return;
  }

  let categorias = JSON.parse(localStorage.getItem('universo_categorias')) || [];
  
  if (categorias.find(c => c.toLowerCase() === nomeCategoria.toLowerCase())) {
    showWarning('Essa categoria já existe!', 3000);
    return;
  }

  categorias.push(nomeCategoria);
  localStorage.setItem('universo_categorias', JSON.stringify(categorias));

  document.getElementById('nome-categoria').value = '';
  exibirCategorias();
  showSuccess('Categoria adicionada com sucesso!', 3000);
}

function exibirCategorias() {
  const categorias = JSON.parse(localStorage.getItem('universo_categorias')) || [];
  const listaCategorias = document.getElementById('lista-categorias');

  if (listaCategorias) {
    listaCategorias.innerHTML = categorias.map(cat => `
      <div class="tag-categoria">
        ${cat}
        <button onclick="deletarCategoria('${cat}')">×</button>
      </div>
    `).join('');
  }
}

function deletarCategoria(categoria) {
  let categorias = JSON.parse(localStorage.getItem('universo_categorias')) || [];
  categorias = categorias.filter(c => c !== categoria);
  localStorage.setItem('universo_categorias', JSON.stringify(categorias));
  exibirCategorias();
  showSuccess('Categoria deletada!', 2000);
}

// ===== UTILITÁRIOS =====
function carregarDados() {
  const config = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIGURACOES)) || {};
  
  const nomeLoja = document.getElementById('nome-loja');
  const telefonePrincipal = document.getElementById('telefone-principal');
  const emailLoja = document.getElementById('email-loja');
  const horarioAtendimento = document.getElementById('horario-atendimento');

  if (config.nomeLoja) {
    if (nomeLoja) nomeLoja.value = config.nomeLoja;
    if (telefonePrincipal) telefonePrincipal.value = config.telefonePrincipal || '';
    if (emailLoja) emailLoja.value = config.emailLoja || '';
    if (horarioAtendimento) horarioAtendimento.value = config.horarioAtendimento || '';
  }

  exibirCategorias();
}

function confirmarAcao(mensagem, acao) {
  if (confirm(mensagem)) {
    if (acao === 'limparCache') {
      localStorage.clear();
      showSuccess('Cache limpo com sucesso!', 3000);
      location.reload();
    } else if (acao === 'fazerBackup') {
      fazerBackupDados();
    } else if (acao === 'restaurarBackup') {
      restaurarBackupDados();
    }
  }
}

function fazerBackupDados() {
  const backup = {
    timestamp: new Date().toISOString(),
    produtos: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)),
    entregadores: JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTREGADORES)),
    pedidos: JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)),
    clientes: JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)),
    configuracoes: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIGURACOES))
  };

  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup-universo-prata-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  showSuccess('Backup baixado com sucesso! 💾', 3000);
}

function restaurarBackupDados() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        
        if (backup.produtos) localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(backup.produtos));
        if (backup.entregadores) localStorage.setItem(STORAGE_KEYS.ENTREGADORES, JSON.stringify(backup.entregadores));
        if (backup.pedidos) localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(backup.pedidos));
        if (backup.clientes) localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(backup.clientes));
        if (backup.configuracoes) localStorage.setItem(STORAGE_KEYS.CONFIGURACOES, JSON.stringify(backup.configuracoes));
        
        showSuccess('Backup restaurado com sucesso! ✅', 3000);
        location.reload();
      } catch (error) {
        showError('Erro ao restaurar backup. Arquivo inválido!', 4000);
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

function scrollTo(selector) {
  try {
    const element = document.querySelector(selector);
    if (element) {
      // Use setTimeout to ensure the action is complete before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  } catch (error) {
    console.log('Scroll error:', error);
  }
}
