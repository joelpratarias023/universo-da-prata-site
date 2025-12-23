// ===== CARD DE PEDIDOS =====

function abrirCardPedidos() {
  const modal = document.getElementById('modal-pedidos');
  if (modal) {
    modal.style.display = 'flex';
    carregarPedidosCard();
  }
}

function carregarPedidosCard() {
  const pedidos = JSON.parse(localStorage.getItem('universo_pedidos')) || [];
  const tbody = document.getElementById('lista-pedidos-card');
  
  if (!tbody) return;

  if (pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum pedido ainda</td></tr>';
    atualizarResumoPedidos(pedidos);
    return;
  }

  tbody.innerHTML = pedidos.map(pedido => `
    <tr>
      <td>#${pedido.id}</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.valor} AKZ</td>
      <td>${pedido.data}</td>
      <td><span class="badge-status status-${pedido.status}">${pedido.status}</span></td>
      <td>
        <button class="btn-pequeno" onclick="verPedidoCard('${pedido.id}')">Ver</button>
        <button class="btn-pequeno btn-danger" onclick="deletarPedidoCard('${pedido.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumoPedidos(pedidos);
}

function atualizarResumoPedidos(pedidos) {
  const totalPedidos = pedidos.length;
  const valorTotal = pedidos.reduce((total, p) => total + (parseFloat(p.valor) || 0), 0);
  const pendentes = pedidos.filter(p => p.status === 'pendente').length;

  const resumoTotal = document.getElementById('total-pedidos-resumo');
  const resumoValor = document.getElementById('valor-total-pedidos');
  const resumoPendentes = document.getElementById('pedidos-pendentes-resumo');

  if (resumoTotal) resumoTotal.textContent = totalPedidos;
  if (resumoValor) resumoValor.textContent = `${valorTotal.toFixed(2)} AKZ`;
  if (resumoPendentes) resumoPendentes.textContent = pendentes;
}

function filtrarPedidosCard() {
  const filtroId = document.getElementById('filtro-pedidos-card')?.value.toLowerCase() || '';
  const filtroStatus = document.getElementById('filtro-status-pedido-card')?.value || '';
  const pedidos = JSON.parse(localStorage.getItem('universo_pedidos')) || [];
  
  const filtrados = pedidos.filter(p => {
    const idMatch = p.id.toString().toLowerCase().includes(filtroId);
    const statusMatch = filtroStatus === '' || p.status === filtroStatus;
    return idMatch && statusMatch;
  });

  const tbody = document.getElementById('lista-pedidos-card');
  if (!tbody) return;

  tbody.innerHTML = filtrados.map(pedido => `
    <tr>
      <td>#${pedido.id}</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.valor} AKZ</td>
      <td>${pedido.data}</td>
      <td><span class="badge-status status-${pedido.status}">${pedido.status}</span></td>
      <td>
        <button class="btn-pequeno" onclick="verPedidoCard('${pedido.id}')">Ver</button>
        <button class="btn-pequeno btn-danger" onclick="deletarPedidoCard('${pedido.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumoPedidos(filtrados);
}

function verPedidoCard(id) {
  console.log('Ver pedido:', id);
}

function deletarPedidoCard(id) {
  if (confirm('Tem certeza que deseja deletar este pedido?')) {
    let pedidos = JSON.parse(localStorage.getItem('universo_pedidos')) || [];
    pedidos = pedidos.filter(p => p.id !== id);
    localStorage.setItem('universo_pedidos', JSON.stringify(pedidos));
    carregarPedidosCard();
    atualizarDashboard();
  }
}
