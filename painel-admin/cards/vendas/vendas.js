// ===== CARD DE VENDAS =====

function abrirCardVendas() {
  const modal = document.getElementById('modal-vendas');
  if (modal) {
    modal.style.display = 'flex';
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('filtro-data-vendas').value = hoje;
    carregarVendasCard();
  }
}

function carregarVendasCard() {
  const pedidos = JSON.parse(localStorage.getItem('universo_pedidos')) || [];
  const dataFiltro = document.getElementById('filtro-data-vendas')?.value || new Date().toISOString().split('T')[0];
  
  const vendas = pedidos.filter(p => p.data === dataFiltro && p.status !== 'cancelado');
  const tbody = document.getElementById('lista-vendas-card');
  
  if (!tbody) return;

  if (vendas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhuma venda neste dia</td></tr>';
    atualizarResumoVendas(vendas);
    return;
  }

  tbody.innerHTML = vendas.map(venda => `
    <tr>
      <td>#${venda.id}</td>
      <td>${venda.cliente}</td>
      <td>${venda.produtos || '1'} item(ns)</td>
      <td>${venda.valor} AKZ</td>
      <td>${venda.hora || '--:--'}</td>
    </tr>
  `).join('');

  atualizarResumoVendas(vendas);
}

function atualizarResumoVendas(vendas) {
  const totalVendas = vendas.length;
  const valorTotal = vendas.reduce((total, v) => total + (parseFloat(v.valor) || 0), 0);
  const ticketMedio = totalVendas > 0 ? (valorTotal / totalVendas) : 0;

  const resumoTotal = document.getElementById('total-vendas-resumo');
  const resumoValor = document.getElementById('valor-total-vendas');
  const resumoTicket = document.getElementById('ticket-medio-vendas');

  if (resumoTotal) resumoTotal.textContent = totalVendas;
  if (resumoValor) resumoValor.textContent = `${valorTotal.toFixed(2)} AKZ`;
  if (resumoTicket) resumoTicket.textContent = `${ticketMedio.toFixed(2)} AKZ`;
}

function filtrarVendasCard() {
  carregarVendasCard();
}
