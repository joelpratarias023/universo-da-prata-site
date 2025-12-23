// ===== PAINEL ADMIN (BACKEND) =====

const state = {
  categorias: [],
  produtos: [],
  pedidos: [],
  utilizadores: [],
  produtoEmEdicaoId: null,
  categoriaEmEdicaoId: null,
  pedidoAtualId: null,
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await adminAuthGuard();
    inicializarAdmin();
    await carregarDashboard();
    mostrarSecao('dashboard');
  } catch (e) {
    console.error(e);
    showError('Falha ao iniciar o painel admin.', 4000);
  }
});

async function adminAuthGuard() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../admin-access.html';
    return;
  }

  if (typeof api !== 'function') {
    showError('Integração com backend não carregou (frontend-integration.js).', 6000);
    throw new Error('api() indisponível');
  }

  const perfil = await api('/auth/perfil');
  if (!perfil?.sucesso) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../admin-access.html';
    return;
  }

  const tipo = perfil?.dados?.usuario?.tipo;
  if (tipo !== 'admin') {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    showError('Acesso restrito a administradores.', 4000);
    window.location.href = '../admin-access.html';
  }
}

function adminLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '../admin-access.html';
}

function inicializarAdmin() {
  const formProduto = document.getElementById('form-produto');
  if (formProduto) {
    formProduto.addEventListener('submit', async (e) => {
      e.preventDefault();
      await salvarProduto();
    });
  }

  const formCategoria = document.getElementById('form-categoria');
  if (formCategoria) {
    formCategoria.addEventListener('submit', async (e) => {
      e.preventDefault();
      await salvarCategoria();
    });
  }

  const formCriarAdmin = document.getElementById('form-criar-admin');
  if (formCriarAdmin) {
    formCriarAdmin.addEventListener('submit', async (e) => {
      e.preventDefault();
      await criarAdmin();
    });
  }
}

// ===== NAVEGAÇÃO =====
function mostrarSecao(secaoId) {
  document.querySelectorAll('.admin-secao').forEach(secao => secao.classList.remove('ativa'));

  const secao = document.getElementById(secaoId);
  if (secao) secao.classList.add('ativa');

  const menuAdmin = document.getElementById('menu-admin');
  if (menuAdmin) menuAdmin.classList.remove('mobile-visivel');

  setTimeout(async () => {
    if (secaoId === 'produtos') {
      await carregarCategorias();
      await carregarProdutos();
    } else if (secaoId === 'categorias') {
      await carregarCategorias();
    } else if (secaoId === 'pedidos') {
      await carregarPedidos();
    } else if (secaoId === 'utilizadores') {
      await carregarUtilizadores();
    } else if (secaoId === 'configuracoes') {
      await carregarConfiguracoes();
    } else if (secaoId === 'faturacao') {
      await carregarFaturacao();
    } else if (secaoId === 'produtos-analytics') {
      await carregarProdutosAnalytics();
    } else if (secaoId === 'vendas-analytics') {
      await carregarVendasAnalytics();
    } else if (secaoId === 'pedidos-analytics') {
      await carregarPedidosAnalytics();
    }
  }, 50);
}

function abrirPedidosPorStatus(status) {
  const filtroStatus = document.getElementById('filtro-status-pedido');
  const filtroBusca = document.getElementById('filtro-pedidos');
  if (filtroStatus) filtroStatus.value = status || '';
  if (filtroBusca) filtroBusca.value = '';
  mostrarSecao('pedidos');
}

function toggleMenuAdmin() {
  const menu = document.getElementById('menu-admin');
  if (menu) menu.classList.toggle('mobile-visivel');
}

function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('ativo');
}

window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('ativo');
  }
});

function formatMoney(value) {
  const n = Number(value) || 0;
  return `${n.toFixed(2)} AKZ`;
}

function getTextSafe(value, fallback = '-') {
  const v = value === null || value === undefined || value === '' ? fallback : value;
  return String(v);
}

async function fetchAllPedidos({ status, limite = 200 } = {}) {
  // Busca em páginas (limite total), para gerar análises.
  const pageSize = 50;
  const maxPages = Math.ceil(limite / pageSize);
  const results = [];

  for (let pagina = 1; pagina <= maxPages; pagina++) {
    let url = `/pedidos?pagina=${pagina}&limite=${pageSize}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    const resp = await api(url);
    if (!resp?.sucesso) break;
    const dados = resp.dados || [];
    results.push(...dados);
    if (dados.length < pageSize) break;
    if (results.length >= limite) break;
  }

  return results.slice(0, limite);
}

function renderTableEmpty(tbodyId, colspan, text) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center;padding:20px;">${escapeHtml(text)}</td></tr>`;
}

function safeInnerHTML(el, html) {
  if (!el) return;
  el.innerHTML = html;
}

// ===== FATURAÇÃO / ANALYTICS =====
async function carregarFaturacao() {
  const tbody = document.getElementById('lista-faturacao');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">Carregando...</td></tr>';

  // Reaproveita dashboard para total geral
  const dash = await api('/admin/dashboard');
  if (dash?.sucesso) {
    setText('faturacao-total', formatMoney(dash.dados?.faturacao_total));
  }

  const pedidos = await fetchAllPedidos({ limite: 200 });
  if (!pedidos.length) {
    setText('faturacao-entregues', 0);
    renderTableEmpty('lista-faturacao', 7, 'Nenhum pedido');
    return;
  }

  const entregues = pedidos.filter(p => p.status === 'entregue');
  setText('faturacao-entregues', entregues.length);

  // Lista todos não cancelados (mais informativo para faturação)
  const lista = pedidos
    .filter(p => p.status !== 'cancelado')
    .sort((a, b) => new Date(b.data_pedido || 0) - new Date(a.data_pedido || 0));

  if (!tbody) return;
  if (!lista.length) {
    renderTableEmpty('lista-faturacao', 7, 'Sem dados de faturação');
    return;
  }

  tbody.innerHTML = lista.map(p => {
    const cliente = p.cliente_nome || p.cliente_email || '-';
    const entregador = p.entregador_nome || p.entregador_email || '-';
    return `
      <tr>
        <td>${escapeHtml(getTextSafe(p.numero_pedido || p.id))}</td>
        <td>${escapeHtml(formatDateTime(p.data_pedido))}</td>
        <td>${escapeHtml(cliente)}</td>
        <td>${escapeHtml(entregador)}</td>
        <td>${escapeHtml(getTextSafe(p.status))}</td>
        <td>${escapeHtml(formatMoney(p.valor_total))}</td>
        <td><button class="btn-primario" onclick="verDetalhesPedido('${p.id}')">Ver</button></td>
      </tr>
    `;
  }).join('');
}

async function carregarVendasAnalytics() {
  const tbody = document.getElementById('lista-vendas-entregues');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">Carregando...</td></tr>';

  const entregues = await fetchAllPedidos({ status: 'entregue', limite: 200 });
  setText('va-total-vendas', entregues.length);
  const total = entregues.reduce((acc, p) => acc + (Number(p.valor_total) || 0), 0);
  setText('va-faturacao-entregues', formatMoney(total));

  if (!tbody) return;
  if (!entregues.length) {
    renderTableEmpty('lista-vendas-entregues', 6, 'Nenhuma venda entregue');
    return;
  }

  const lista = entregues.sort((a, b) => new Date(b.data_pedido || 0) - new Date(a.data_pedido || 0));
  tbody.innerHTML = lista.map(p => {
    const cliente = p.cliente_nome || p.cliente_email || '-';
    const entregador = p.entregador_nome || p.entregador_email || '-';
    return `
      <tr>
        <td>${escapeHtml(getTextSafe(p.numero_pedido || p.id))}</td>
        <td>${escapeHtml(formatDateTime(p.data_pedido))}</td>
        <td>${escapeHtml(cliente)}</td>
        <td>${escapeHtml(entregador)}</td>
        <td>${escapeHtml(formatMoney(p.valor_total))}</td>
        <td><button class="btn-primario" onclick="verDetalhesPedido('${p.id}')">Ver</button></td>
      </tr>
    `;
  }).join('');
}

async function carregarPedidosAnalytics() {
  // Usa dashboard para status rápido e total
  const dash = await api('/admin/dashboard');
  if (dash?.sucesso) {
    const sr = dash.dados?.status_rapido || {};
    setText('pea-pendentes', sr.pendentes ?? 0);
    setText('pea-confirmados', sr.confirmados ?? 0);
    setText('pea-em-entrega', sr.em_entrega ?? 0);
    setText('pea-entregues', sr.entregues ?? 0);
    setText('pea-cancelados', sr.cancelados ?? 0);
  } else {
    // fallback: calcula de /pedidos
    const pedidos = await fetchAllPedidos({ limite: 200 });
    const counts = pedidos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    setText('pea-pendentes', counts.pendente || 0);
    setText('pea-confirmados', counts.confirmado || 0);
    setText('pea-em-entrega', counts.em_entrega || 0);
    setText('pea-entregues', counts.entregue || 0);
    setText('pea-cancelados', counts.cancelado || 0);
  }
}

async function carregarProdutosAnalytics() {
  renderTableEmpty('lista-top-produtos', 4, 'Carregando...');

  // Produtos (admin) para total/estoque
  const respProdutos = await api('/produtos/admin/todos?pagina=1&limite=500');
  const produtos = respProdutos?.sucesso ? (respProdutos.dados || []) : [];
  const totalProdutos = produtos.length;
  const ativos = produtos.filter(p => !!p.ativo).length;
  const estoqueTotal = produtos.reduce((acc, p) => acc + (Number(p.estoque) || 0), 0);

  setText('pa-total-produtos', totalProdutos);
  setText('pa-produtos-ativos', ativos);
  setText('pa-estoque-total', estoqueTotal);

  // Para vendidos/top: soma itens dos pedidos entregues
  const pedidosEntregues = await fetchAllPedidos({ status: 'entregue', limite: 200 });
  if (!pedidosEntregues.length) {
    setText('pa-unidades-vendidas', 0);
    renderTableEmpty('lista-top-produtos', 4, 'Sem pedidos entregues ainda');
    return;
  }

  const soldByProductId = new Map();
  let unidadesVendidas = 0;

  // Busca detalhes por pedido (melhor esforço; evita estourar)
  const detalhes = await Promise.all(
    pedidosEntregues.slice(0, 80).map(async (p) => {
      try {
        const det = await api(`/pedidos/${p.id}`);
        if (det?.sucesso) return det.dados;
      } catch {
        // ignore
      }
      return null;
    })
  );

  for (const d of detalhes) {
    const itens = d?.itens || [];
    for (const item of itens) {
      const pid = item.produto_id;
      const qtd = Number(item.quantidade) || 0;
      unidadesVendidas += qtd;
      soldByProductId.set(pid, (soldByProductId.get(pid) || 0) + qtd);
    }
  }

  setText('pa-unidades-vendidas', unidadesVendidas);

  // Top produtos
  const top = Array.from(soldByProductId.entries())
    .map(([produto_id, vendidos]) => ({ produto_id, vendidos }))
    .sort((a, b) => b.vendidos - a.vendidos)
    .slice(0, 20);

  if (!top.length) {
    renderTableEmpty('lista-top-produtos', 4, 'Sem itens de pedidos entregues');
    return;
  }

  const byId = new Map(produtos.map(p => [Number(p.id), p]));
  const tbody = document.getElementById('lista-top-produtos');
  if (!tbody) return;

  tbody.innerHTML = top.map(t => {
    const p = byId.get(Number(t.produto_id));
    const nome = p?.nome || `Produto #${t.produto_id}`;
    const categoria = p?.categoria_nome || '-';
    const estoque = p?.estoque ?? '-';
    return `
      <tr>
        <td>${escapeHtml(nome)}</td>
        <td>${escapeHtml(categoria)}</td>
        <td>${escapeHtml(t.vendidos)}</td>
        <td>${escapeHtml(estoque)}</td>
      </tr>
    `;
  }).join('');
}

function formatDateTime(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
}

async function apiUploadImagem(file) {
  const token = localStorage.getItem('token');
  const form = new FormData();
  form.append('imagem', file);

  const res = await fetch('http://localhost:3001/api/admin/upload/imagem', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form,
  });

  const dados = await res.json();
  if (!res.ok || !dados?.sucesso) {
    throw new Error(dados?.mensagem || 'Falha no upload');
  }
  return dados.dados.url;
}

// ===== DASHBOARD =====
async function carregarDashboard() {
  const resp = await api('/admin/dashboard');
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar dashboard', 4000);
    return;
  }

  const d = resp.dados;
  setText('dashboard-produtos-ativos', d.produtos_ativos);
  setText('dashboard-total-pedidos', d.total_pedidos);
  setText('dashboard-total-vendas', d.total_vendas);
  setText('dashboard-faturacao-total', formatMoney(d.faturacao_total));
  setText('dashboard-pedidos-pendentes', d.status_rapido?.pendentes ?? 0);
  setText('dashboard-pedidos-entregues', d.status_rapido?.entregues ?? 0);

  renderUltimosPedidos(d.ultimos_pedidos || []);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

function renderUltimosPedidos(pedidos) {
  const tbody = document.getElementById('lista-ultimos-pedidos');
  if (!tbody) return;
  if (!pedidos.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;">Nenhum pedido</td></tr>';
    return;
  }

  tbody.innerHTML = pedidos.map(p => {
    const cliente = p.cliente_nome || p.cliente_email || '-';
    return `
      <tr>
        <td>${escapeHtml(p.numero_pedido || p.id)}</td>
        <td>${escapeHtml(cliente)}</td>
        <td>${escapeHtml(formatMoney(p.valor_total))}</td>
        <td>${escapeHtml(p.status || '-')}</td>
        <td>
          <button class="btn-primario" onclick="verDetalhesPedido('${p.id}')">Ver</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== CATEGORIAS =====
async function carregarCategorias() {
  const resp = await api('/categorias/admin/todas');
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar categorias', 4000);
    return;
  }

  state.categorias = resp.dados || [];
  preencherSelectCategorias();
  renderCategorias();
}

function preencherSelectCategorias() {
  const selects = [
    document.getElementById('filtro-categoria'),
    document.getElementById('produto-categoria')
  ].filter(Boolean);

  for (const select of selects) {
    const atual = select.value;
    const isFiltro = select.id === 'filtro-categoria';

    select.innerHTML = isFiltro
      ? '<option value="">Todas as categorias</option>'
      : '<option value="">Selecione</option>';

    for (const c of state.categorias) {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nome;
      select.appendChild(opt);
    }

    if (atual) select.value = atual;
  }
}

function renderCategorias() {
  const tbody = document.getElementById('lista-categorias');
  if (!tbody) return;

  const filtro = (document.getElementById('filtro-categorias')?.value || '').toLowerCase();
  const categorias = (state.categorias || []).filter(c =>
    !filtro || (c.nome || '').toLowerCase().includes(filtro)
  );

  if (!categorias.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">Nenhuma categoria</td></tr>';
    return;
  }

  tbody.innerHTML = categorias.map(c => {
    const ativa = !!c.ativa;
    const btnToggle = ativa ? 'Desativar' : 'Ativar';
    return `
      <tr>
        <td>${escapeHtml(c.id)}</td>
        <td>${escapeHtml(c.nome || '')}</td>
        <td>${escapeHtml(c.ordem ?? 0)}</td>
        <td>${ativa ? 'Sim' : 'Não'}</td>
        <td>${c.imagem_url ? `<img src="${escapeAttr(c.imagem_url)}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">` : '-'}</td>
        <td>
          <button class="btn-secundario" onclick="abrirModalCategoria('${c.id}')">Editar</button>
          <button class="btn-primario" onclick="toggleCategoriaAtiva('${c.id}', ${!ativa})">${btnToggle}</button>
          <button class="btn-perigo" onclick="arquivarCategoria('${c.id}')">Arquivar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function filtrarCategorias() {
  renderCategorias();
}

function abrirModalCategoria(categoriaId = null) {
  state.categoriaEmEdicaoId = categoriaId;
  const modal = document.getElementById('modal-categoria');
  const form = document.getElementById('form-categoria');
  const titulo = document.getElementById('titulo-modal-categoria');
  if (!modal || !form || !titulo) return;

  form.reset();
  document.getElementById('categoria-imagem-file').value = '';

  if (categoriaId) {
    titulo.textContent = 'Editar Categoria';
    const c = (state.categorias || []).find(x => String(x.id) === String(categoriaId));
    if (c) {
      document.getElementById('categoria-nome').value = c.nome || '';
      document.getElementById('categoria-ordem').value = c.ordem ?? 0;
      document.getElementById('categoria-imagem-url').value = c.imagem_url || '';
    }
  } else {
    titulo.textContent = 'Adicionar Categoria';
  }

  modal.classList.add('ativo');
}

async function salvarCategoria() {
  const nome = document.getElementById('categoria-nome').value.trim();
  const ordem = Number(document.getElementById('categoria-ordem').value || 0);
  const file = document.getElementById('categoria-imagem-file').files?.[0] || null;
  const url = document.getElementById('categoria-imagem-url').value.trim();

  if (!nome) {
    showError('Nome da categoria é obrigatório.', 3000);
    return;
  }

  let imagem_url = url || null;
  if (file) {
    imagem_url = await apiUploadImagem(file);
  }

  const payload = { nome, ordem, imagem_url };
  const id = state.categoriaEmEdicaoId;

  const resp = id
    ? await api(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    : await api('/categorias', { method: 'POST', body: JSON.stringify(payload) });

  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao salvar categoria', 4000);
    return;
  }

  showSuccess('Categoria salva com sucesso.', 2500);
  fecharModal('modal-categoria');
  state.categoriaEmEdicaoId = null;
  await carregarCategorias();
}

async function toggleCategoriaAtiva(id, ativa) {
  const resp = await api(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify({ ativa }) });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao atualizar categoria', 4000);
    return;
  }
  await carregarCategorias();
}

async function arquivarCategoria(id) {
  const resp = await api(`/categorias/${id}`, { method: 'DELETE' });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao arquivar categoria', 4000);
    return;
  }
  showSuccess('Categoria arquivada.', 2000);
  await carregarCategorias();
}

// ===== PRODUTOS =====
async function carregarProdutos() {
  const resp = await api('/produtos/admin/todos?pagina=1&limite=200');
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar produtos', 4000);
    return;
  }
  state.produtos = resp.dados || [];
  renderProdutos();
}

function filtrarProdutos() {
  renderProdutos();
}

function renderProdutos() {
  const tbody = document.getElementById('lista-produtos');
  if (!tbody) return;

  const busca = (document.getElementById('filtro-produtos')?.value || '').toLowerCase();
  const categoriaId = document.getElementById('filtro-categoria')?.value || '';

  const produtos = (state.produtos || []).filter(p => {
    const matchBusca = !busca || (p.nome || '').toLowerCase().includes(busca);
    const matchCategoria = !categoriaId || String(p.categoria_id) === String(categoriaId);
    return matchBusca && matchCategoria;
  });

  if (!produtos.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:20px;">Nenhum produto</td></tr>';
    return;
  }

  tbody.innerHTML = produtos.map(p => {
    const ativo = !!p.ativo;
    const btnToggle = ativo ? 'Desativar' : 'Ativar';
    const promo = (p.preco_promocional !== null && p.preco_promocional !== undefined)
      ? formatMoney(p.preco_promocional)
      : '-';

    return `
      <tr>
        <td>${escapeHtml(p.id)}</td>
        <td>${escapeHtml(p.nome || '')}</td>
        <td>${escapeHtml(p.categoria_nome || '-')}</td>
        <td>${escapeHtml(formatMoney(p.preco))}</td>
        <td>${escapeHtml(promo)}</td>
        <td>${escapeHtml(p.estoque ?? 0)}</td>
        <td>${ativo ? 'Sim' : 'Não'}</td>
        <td>${p.imagem_url ? `<img src="${escapeAttr(p.imagem_url)}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">` : '-'}</td>
        <td>
          <button class="btn-secundario" onclick="abrirModalProduto('${p.id}')">Editar</button>
          <button class="btn-primario" onclick="toggleProdutoAtivo('${p.id}', ${!ativo})">${btnToggle}</button>
          <button class="btn-perigo" onclick="arquivarProduto('${p.id}')">Arquivar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function abrirModalProduto(produtoId = null) {
  state.produtoEmEdicaoId = produtoId;
  const modal = document.getElementById('modal-produto');
  const form = document.getElementById('form-produto');
  const titulo = document.getElementById('titulo-modal-produto');
  if (!modal || !form || !titulo) return;

  form.reset();
  document.getElementById('produto-imagem-file').value = '';

  if (produtoId) {
    titulo.textContent = 'Editar Produto';
    const p = (state.produtos || []).find(x => String(x.id) === String(produtoId));
    if (p) {
      document.getElementById('produto-nome').value = p.nome || '';
      document.getElementById('produto-descricao').value = p.descricao || '';
      document.getElementById('produto-categoria').value = p.categoria_id || '';
      document.getElementById('produto-preco').value = p.preco ?? 0;
      document.getElementById('produto-estoque').value = p.estoque ?? 0;
      document.getElementById('produto-preco-promocional').value = p.preco_promocional ?? '';
      document.getElementById('produto-imagem').value = p.imagem_url || '';
    }
  } else {
    titulo.textContent = 'Adicionar Novo Produto';
  }

  modal.classList.add('ativo');
}

async function salvarProduto() {
  const nome = document.getElementById('produto-nome').value.trim();
  const descricao = document.getElementById('produto-descricao').value.trim();
  const categoria_id = document.getElementById('produto-categoria').value;
  const preco = Number(document.getElementById('produto-preco').value);
  const estoque = Number(document.getElementById('produto-estoque').value);
  const preco_promocional_raw = document.getElementById('produto-preco-promocional').value;
  const preco_promocional = preco_promocional_raw === '' ? null : Number(preco_promocional_raw);
  const file = document.getElementById('produto-imagem-file').files?.[0] || null;
  const imagemUrlInput = document.getElementById('produto-imagem').value.trim();

  if (!nome || !descricao || !categoria_id || !Number.isFinite(preco) || preco <= 0) {
    showError('Preencha nome, descrição, categoria e preço.', 4000);
    return;
  }

  let imagem_url = imagemUrlInput || null;
  if (file) {
    imagem_url = await apiUploadImagem(file);
  }

  const payload = {
    nome,
    descricao,
    categoria_id: Number(categoria_id),
    preco,
    estoque: Number.isFinite(estoque) ? estoque : 0,
    imagem_url,
    preco_promocional,
  };

  const id = state.produtoEmEdicaoId;
  const resp = id
    ? await api(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    : await api('/produtos', { method: 'POST', body: JSON.stringify(payload) });

  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao salvar produto', 4000);
    return;
  }

  showSuccess('Produto salvo com sucesso.', 2500);
  fecharModal('modal-produto');
  state.produtoEmEdicaoId = null;
  await carregarProdutos();
  await carregarDashboard();
}

async function toggleProdutoAtivo(id, ativo) {
  const resp = await api(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify({ ativo }) });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao atualizar produto', 4000);
    return;
  }
  await carregarProdutos();
  await carregarDashboard();
}

async function arquivarProduto(id) {
  const resp = await api(`/produtos/${id}`, { method: 'DELETE' });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao arquivar produto', 4000);
    return;
  }
  showSuccess('Produto arquivado.', 2000);
  await carregarProdutos();
  await carregarDashboard();
}

// ===== PEDIDOS =====
async function carregarPedidos() {
  const busca = (document.getElementById('filtro-pedidos')?.value || '').trim();
  const status = (document.getElementById('filtro-status-pedido')?.value || '').trim();

  let url = `/pedidos?pagina=1&limite=20`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  if (busca) url += `&busca=${encodeURIComponent(busca)}`;

  const resp = await api(url);
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar pedidos', 4000);
    return;
  }

  const pedidos = resp.dados || [];

  // Melhor esforço: buscar itens para exibir quantidade de produtos (até 20 pedidos)
  const detalhados = await Promise.all(pedidos.map(async (p) => {
    try {
      const det = await api(`/pedidos/${p.id}`);
      if (det?.sucesso) {
        const itens = det?.dados?.itens || [];
        return { ...p, itens_count: itens.length };
      }
    } catch {
      // ignore
    }
    return { ...p, itens_count: null };
  }));

  state.pedidos = detalhados;
  renderPedidos();
}

function filtrarPedidos() {
  carregarPedidos();
}

function renderPedidos() {
  const tbody = document.getElementById('lista-pedidos');
  if (!tbody) return;

  if (!state.pedidos.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">Nenhum pedido</td></tr>';
    return;
  }

  tbody.innerHTML = state.pedidos.map(p => {
    const produtosResumo = p.itens_count === null ? '-' : `${p.itens_count} itens`;
    return `
      <tr>
        <td>${escapeHtml(p.numero_pedido || p.id)}</td>
        <td>${escapeHtml(p.cliente_nome || p.cliente_email || '-')}</td>
        <td>${escapeHtml(produtosResumo)}</td>
        <td>${escapeHtml(formatMoney(p.valor_total))}</td>
        <td>${escapeHtml(formatDateTime(p.data_pedido))}</td>
        <td>${escapeHtml(p.status || '-')}</td>
        <td>
          <button class="btn-primario" onclick="verDetalhesPedido('${p.id}')">Ver</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function verDetalhesPedido(pedidoId) {
  state.pedidoAtualId = pedidoId;
  const modal = document.getElementById('modal-pedido');
  if (!modal) return;

  const detalhesEl = document.getElementById('detalhes-pedido');
  const historicoEl = document.getElementById('pedido-historico');
  const obsEl = document.getElementById('pedido-observacoes-internas');
  if (detalhesEl) detalhesEl.innerHTML = 'Carregando...';
  if (historicoEl) historicoEl.textContent = 'Carregando...';
  if (obsEl) obsEl.value = '';

  modal.classList.add('ativo');

  const resp = await api(`/pedidos/${pedidoId}`);
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar pedido', 4000);
    return;
  }

  const p = resp.dados;
  if (obsEl) obsEl.value = p.observacoes_internas || '';

  if (detalhesEl) {
    const itens = p.itens || [];
    detalhesEl.innerHTML = `
      <p><strong>Nº do pedido:</strong> ${escapeHtml(p.numero_pedido || p.id)}</p>
      <p><strong>Cliente:</strong> ${escapeHtml(p.cliente_nome || p.cliente_email || '-')}</p>
      <p><strong>Status:</strong> ${escapeHtml(p.status || '-')}</p>
      <p><strong>Valor total:</strong> ${escapeHtml(formatMoney(p.valor_total))}</p>
      <p><strong>Data:</strong> ${escapeHtml(formatDateTime(p.data_pedido))}</p>
      <hr style="margin: 15px 0; opacity: 0.2;">
      <h3 style="margin: 0 0 10px 0;">Produtos</h3>
      <ul style="margin: 0; padding-left: 18px;">
        ${itens.map(i => `<li>${escapeHtml(i.produto_id)} — Qtd: ${escapeHtml(i.quantidade)} — ${escapeHtml(formatMoney(i.subtotal))}</li>`).join('') || '<li>-</li>'}
      </ul>
    `;
  }

  await carregarHistoricoPedido(pedidoId);
}

async function carregarHistoricoPedido(pedidoId) {
  const historicoEl = document.getElementById('pedido-historico');
  if (!historicoEl) return;

  const resp = await api(`/pedidos/${pedidoId}/historico`);
  if (!resp?.sucesso) {
    historicoEl.textContent = resp?.mensagem || 'Erro ao carregar histórico';
    return;
  }

  const items = resp.dados || [];
  if (!items.length) {
    historicoEl.textContent = 'Sem histórico.';
    return;
  }

  historicoEl.innerHTML = `
    <ul style="margin:0; padding-left:18px;">
      ${items.map(h => {
        const admin = h.admin_nome ? ` (${escapeHtml(h.admin_nome)})` : '';
        const when = h.data_criacao ? ` — ${escapeHtml(formatDateTime(h.data_criacao))}` : '';
        const msg = h.acao === 'status'
          ? `Status: ${escapeHtml(h.de_status)} → ${escapeHtml(h.para_status)}`
          : `Obs. internas atualizadas`;
        return `<li>${msg}${admin}${when}</li>`;
      }).join('')}
    </ul>
  `;
}

async function atualizarStatusPedido() {
  const pedidoId = state.pedidoAtualId;
  const status = document.getElementById('novo-status-pedido')?.value || '';
  if (!pedidoId || !status) {
    showError('Selecione um status.', 2500);
    return;
  }

  const resp = await api(`/pedidos/${pedidoId}`, { method: 'PUT', body: JSON.stringify({ status }) });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao atualizar status', 4000);
    return;
  }

  showSuccess('Status atualizado.', 2000);
  document.getElementById('novo-status-pedido').value = '';
  await carregarPedidos();
  await carregarDashboard();
  await carregarHistoricoPedido(pedidoId);
}

async function salvarObservacoesInternasPedido() {
  const pedidoId = state.pedidoAtualId;
  const observacoes_internas = document.getElementById('pedido-observacoes-internas')?.value || '';
  if (!pedidoId) return;

  const resp = await api(`/pedidos/${pedidoId}`, { method: 'PUT', body: JSON.stringify({ observacoes_internas }) });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao salvar observações', 4000);
    return;
  }

  showSuccess('Observações salvas.', 2000);
  await carregarHistoricoPedido(pedidoId);
}

// ===== UTILIZADORES =====
async function carregarUtilizadores() {
  const busca = (document.getElementById('filtro-utilizadores')?.value || '').trim();
  const tipo = (document.getElementById('filtro-tipo-utilizador')?.value || '').trim();

  let url = `/usuarios?pagina=1&limite=200`;
  if (busca) url += `&busca=${encodeURIComponent(busca)}`;
  if (tipo) url += `&tipo=${encodeURIComponent(tipo)}`;

  const resp = await api(url);
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar utilizadores', 4000);
    return;
  }

  state.utilizadores = resp.dados || [];
  renderUtilizadores();
}

function filtrarUtilizadores() {
  carregarUtilizadores();
}

function renderUtilizadores() {
  const tbody = document.getElementById('lista-utilizadores');
  if (!tbody) return;

  if (!state.utilizadores.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;">Nenhum utilizador</td></tr>';
    return;
  }

  tbody.innerHTML = state.utilizadores.map(u => {
    const status = u.status || '-';
    const isBloqueado = status === 'bloqueado';
    const btnStatus = isBloqueado ? 'Ativar' : 'Bloquear';
    const nextStatus = isBloqueado ? 'ativo' : 'bloqueado';

    return `
      <tr>
        <td>${escapeHtml(u.nome || '')}</td>
        <td>${escapeHtml(u.email || '')}</td>
        <td>${escapeHtml(u.tipo || '')}</td>
        <td>${escapeHtml(status)}</td>
        <td>
          <button class="btn-primario" onclick="atualizarStatusUtilizador('${u.id}', '${nextStatus}')">${btnStatus}</button>
          <button class="btn-secundario" onclick="verPedidosDoUtilizador('${escapeAttr(u.email || u.nome || '')}')">Ver pedidos</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function atualizarStatusUtilizador(id, status) {
  const resp = await api(`/usuarios/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao atualizar status', 4000);
    return;
  }
  showSuccess('Status atualizado.', 2000);
  await carregarUtilizadores();
}

function verPedidosDoUtilizador(termo) {
  // Sem criar modais/páginas extras: direciona para Pedidos e aplica busca.
  const input = document.getElementById('filtro-pedidos');
  if (input) input.value = termo || '';
  mostrarSecao('pedidos');
}

function abrirModalCriarAdmin() {
  const modal = document.getElementById('modal-criar-admin');
  const form = document.getElementById('form-criar-admin');
  if (form) form.reset();
  if (modal) modal.classList.add('ativo');
}

async function criarAdmin() {
  const nome = document.getElementById('admin-nome').value.trim();
  const email = document.getElementById('admin-email').value.trim();
  const senha = document.getElementById('admin-senha').value;
  const confirmar_senha = document.getElementById('admin-confirmar-senha').value;

  if (!nome || !email || !senha || !confirmar_senha) {
    showError('Preencha todos os campos.', 3000);
    return;
  }

  const resp = await api('/usuarios/admin', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha, confirmar_senha })
  });

  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao criar admin', 4000);
    return;
  }

  showSuccess('Admin criado com sucesso.', 2500);
  fecharModal('modal-criar-admin');
  await carregarUtilizadores();
}

// ===== CONFIGURAÇÕES =====
async function carregarConfiguracoes() {
  const resp = await api('/admin/config');
  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao carregar configurações', 4000);
    return;
  }
  const c = resp.dados || {};
  setInput('config-nome', c.nome || '');
  setInput('config-contacto', c.contacto || '');
  setInput('config-whatsapp', c.whatsapp || '');
  setInput('config-taxa-entrega', c.taxa_entrega ?? 0);
  setInput('config-texto-home', c.texto_home || '');
  setInput('config-texto-sobre', c.texto_sobre || '');
}

function setInput(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = value ?? '';
}

async function salvarConfiguracoes() {
  const payload = {
    nome: document.getElementById('config-nome')?.value || '',
    contacto: document.getElementById('config-contacto')?.value || '',
    whatsapp: document.getElementById('config-whatsapp')?.value || '',
    taxa_entrega: Number(document.getElementById('config-taxa-entrega')?.value || 0),
    texto_home: document.getElementById('config-texto-home')?.value || '',
    texto_sobre: document.getElementById('config-texto-sobre')?.value || '',
  };

  const resp = await api('/admin/config', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  if (!resp?.sucesso) {
    showError(resp?.mensagem || 'Erro ao salvar configurações', 4000);
    return;
  }

  showSuccess('Configurações salvas.', 2000);
}

// ===== HELPERS =====
function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll('`', '&#096;');
}

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
    let produtos = carregarDoStorage(STORAGE_KEYS.PRODUTOS, []);
    produtos = produtos.filter(p => p.id !== produtoId);
    salvarNoStorage(STORAGE_KEYS.PRODUTOS, produtos);
    
    showSuccess('Produto deletado com sucesso!', 3000);
    carregarProdutos();
    atualizarDashboard();
  }
}

function filtrarProdutos() {
  const termo = document.getElementById('filtro-produtos')?.value.toLowerCase() || '';
  const categoria = document.getElementById('filtro-categoria')?.value || '';
  const produtos = carregarDoStorage(STORAGE_KEYS.PRODUTOS, []);

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

  let entregadores = carregarDoStorage(STORAGE_KEYS.ENTREGADORES, []);
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
  salvarNoStorage(STORAGE_KEYS.ENTREGADORES, entregadores);

  showSuccess('Entregador adicionado com sucesso! 🚚', 3000);
  fecharModal('modal-entregador');
  carregarEntregadores();
  atualizarDashboard();
}

function carregarEntregadores() {
  const entregadores = carregarDoStorage(STORAGE_KEYS.ENTREGADORES, []);
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
    let entregadores = carregarDoStorage(STORAGE_KEYS.ENTREGADORES, []);
    entregadores = entregadores.filter(e => e.id !== entregadorId);
    salvarNoStorage(STORAGE_KEYS.ENTREGADORES, entregadores);
    
    showSuccess('Entregador deletado com sucesso!', 3000);
    carregarEntregadores();
    atualizarDashboard();
  }
}

function filtrarEntregadores() {
  const termo = document.getElementById('filtro-entregadores')?.value.toLowerCase() || '';
  const status = document.getElementById('filtro-status')?.value || '';
  const entregadores = carregarDoStorage(STORAGE_KEYS.ENTREGADORES, []);

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
  const pedidos = carregarDoStorage(STORAGE_KEYS.PEDIDOS, []);
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
  const pedidos = carregarDoStorage(STORAGE_KEYS.PEDIDOS, []);
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
    salvarNoStorage(STORAGE_KEYS.PEDIDOS, pedidos);
    
    showSuccess('Status do pedido atualizado com sucesso!', 3000);
    fecharModal('modal-pedido');
    carregarPedidos();
    atualizarDashboard();
  }
}

function filtrarPedidos() {
  const termo = document.getElementById('filtro-pedidos')?.value.toLowerCase() || '';
  const status = document.getElementById('filtro-status-pedido')?.value || '';
  const pedidos = carregarDoStorage(STORAGE_KEYS.PEDIDOS, []);

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
  const clientes = carregarDoStorage(STORAGE_KEYS.CLIENTES, []);
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
    let clientes = carregarDoStorage(STORAGE_KEYS.CLIENTES, []);
    clientes = clientes.filter(c => c.id !== clienteId);
    salvarNoStorage(STORAGE_KEYS.CLIENTES, clientes);
    
    showSuccess('Cliente deletado com sucesso!', 3000);
    carregarClientes();
  }
}

function filtrarClientes() {
  const termo = document.getElementById('filtro-clientes')?.value.toLowerCase() || '';
  const clientes = carregarDoStorage(STORAGE_KEYS.CLIENTES, []);

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
  const pedidos = carregarDoStorage(STORAGE_KEYS.PEDIDOS, []);
  const produtos = carregarDoStorage(STORAGE_KEYS.PRODUTOS, []);
  const entregadores = carregarDoStorage(STORAGE_KEYS.ENTREGADORES, []);

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

  salvarNoStorage(STORAGE_KEYS.CONFIGURACOES, config);
  showSuccess('Configurações salvas com sucesso! ⚙️', 3000);
}

function adicionarCategoria() {
  const nomeCategoria = document.getElementById('nome-categoria').value.trim();
  
  if (!nomeCategoria) {
    showWarning('Digite o nome da categoria!', 3000);
    return;
  }

  let categorias = carregarDoStorage('universo_categorias', []);
  
  if (categorias.find(c => c.toLowerCase() === nomeCategoria.toLowerCase())) {
    showWarning('Essa categoria já existe!', 3000);
    return;
  }

  categorias.push(nomeCategoria);
  salvarNoStorage('universo_categorias', categorias);

  document.getElementById('nome-categoria').value = '';
  exibirCategorias();
  showSuccess('Categoria adicionada com sucesso!', 3000);
}

function exibirCategorias() {
  const categorias = carregarDoStorage('universo_categorias', []);
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
  let categorias = carregarDoStorage('universo_categorias', []);
  categorias = categorias.filter(c => c !== categoria);
  salvarNoStorage('universo_categorias', categorias);
  exibirCategorias();
  showSuccess('Categoria deletada!', 2000);
}

// ===== UTILITÁRIOS =====
function carregarDados() {
  const config = carregarDoStorage(STORAGE_KEYS.CONFIGURACOES, {});
  
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

// Expor funções para handlers inline (onclick="...")
// Alguns browsers/combinações de scripts não resolvem bem nomes sem estarem no window.
try {
  if (typeof mostrarSecao === 'function') window.mostrarSecao = mostrarSecao;
  if (typeof toggleMenuAdmin === 'function') window.toggleMenuAdmin = toggleMenuAdmin;
  if (typeof adminLogout === 'function') window.adminLogout = adminLogout;
  if (typeof fecharModal === 'function') window.fecharModal = fecharModal;
  if (typeof scrollTo === 'function') window.scrollTo = scrollTo;

  if (typeof abrirPedidosPorStatus === 'function') window.abrirPedidosPorStatus = abrirPedidosPorStatus;

  if (typeof filtrarProdutos === 'function') window.filtrarProdutos = filtrarProdutos;
  if (typeof abrirModalProduto === 'function') window.abrirModalProduto = abrirModalProduto;
  if (typeof toggleProdutoAtivo === 'function') window.toggleProdutoAtivo = toggleProdutoAtivo;
  if (typeof arquivarProduto === 'function') window.arquivarProduto = arquivarProduto;

  if (typeof filtrarCategorias === 'function') window.filtrarCategorias = filtrarCategorias;
  if (typeof abrirModalCategoria === 'function') window.abrirModalCategoria = abrirModalCategoria;
  if (typeof toggleCategoriaAtiva === 'function') window.toggleCategoriaAtiva = toggleCategoriaAtiva;
  if (typeof arquivarCategoria === 'function') window.arquivarCategoria = arquivarCategoria;

  if (typeof filtrarPedidos === 'function') window.filtrarPedidos = filtrarPedidos;
  if (typeof verDetalhesPedido === 'function') window.verDetalhesPedido = verDetalhesPedido;
  if (typeof atualizarStatusPedido === 'function') window.atualizarStatusPedido = atualizarStatusPedido;
  if (typeof salvarObservacoesInternasPedido === 'function') window.salvarObservacoesInternasPedido = salvarObservacoesInternasPedido;

  if (typeof filtrarUtilizadores === 'function') window.filtrarUtilizadores = filtrarUtilizadores;
  if (typeof abrirModalCriarAdmin === 'function') window.abrirModalCriarAdmin = abrirModalCriarAdmin;
  if (typeof atualizarStatusUtilizador === 'function') window.atualizarStatusUtilizador = atualizarStatusUtilizador;
  if (typeof verPedidosDoUtilizador === 'function') window.verPedidosDoUtilizador = verPedidosDoUtilizador;

  if (typeof salvarConfiguracoes === 'function') window.salvarConfiguracoes = salvarConfiguracoes;
} catch (e) {
  // Não bloquear o painel por causa disso.
  console.warn('Falha ao expor handlers globais do admin:', e);
}
