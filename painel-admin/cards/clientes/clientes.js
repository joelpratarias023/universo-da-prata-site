// ===== CARD DE CLIENTES =====

function abrirCardClientes() {
  const modal = document.getElementById('modal-clientes');
  if (modal) {
    modal.style.display = 'flex';
    carregarClientesCard();
  }
}

function carregarClientesCard() {
  const clientes = JSON.parse(localStorage.getItem('universo_clientes')) || [];
  const tbody = document.getElementById('lista-clientes-card');
  
  if (!tbody) return;

  if (clientes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum cliente registrado</td></tr>';
    atualizarResumoClientes(clientes);
    return;
  }

  tbody.innerHTML = clientes.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email}</td>
      <td>${cliente.pedidos || 0}</td>
      <td>${cliente.gasto_total || 0} AKZ</td>
      <td>
        <button class="btn-pequeno" onclick="verClienteCard('${cliente.id}')">Ver</button>
        <button class="btn-pequeno btn-danger" onclick="deletarClienteCard('${cliente.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumoClientes(clientes);
}

function atualizarResumoClientes(clientes) {
  const totalClientes = clientes.length;
  const gastoTotal = clientes.reduce((total, c) => total + (parseFloat(c.gasto_total) || 0), 0);
  const ticketMedio = totalClientes > 0 ? (gastoTotal / totalClientes) : 0;

  const resumoTotal = document.getElementById('total-clientes-resumo');
  const resumoGasto = document.getElementById('gasto-total-clientes');
  const resumoTicket = document.getElementById('ticket-medio-clientes');

  if (resumoTotal) resumoTotal.textContent = totalClientes;
  if (resumoGasto) resumoGasto.textContent = `${gastoTotal.toFixed(2)} AKZ`;
  if (resumoTicket) resumoTicket.textContent = `${ticketMedio.toFixed(2)} AKZ`;
}

function filtrarClientesCard() {
  const filtroNome = document.getElementById('filtro-clientes-card')?.value.toLowerCase() || '';
  const clientes = JSON.parse(localStorage.getItem('universo_clientes')) || [];
  
  const filtrados = clientes.filter(c => {
    const nomeMatch = c.nome.toLowerCase().includes(filtroNome);
    return nomeMatch;
  });

  const tbody = document.getElementById('lista-clientes-card');
  if (!tbody) return;

  tbody.innerHTML = filtrados.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email}</td>
      <td>${cliente.pedidos || 0}</td>
      <td>${cliente.gasto_total || 0} AKZ</td>
      <td>
        <button class="btn-pequeno" onclick="verClienteCard('${cliente.id}')">Ver</button>
        <button class="btn-pequeno btn-danger" onclick="deletarClienteCard('${cliente.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumoClientes(filtrados);
}

function verClienteCard(id) {
  console.log('Ver cliente:', id);
}

function deletarClienteCard(id) {
  if (confirm('Tem certeza que deseja deletar este cliente?')) {
    let clientes = JSON.parse(localStorage.getItem('universo_clientes')) || [];
    clientes = clientes.filter(c => c.id !== id);
    localStorage.setItem('universo_clientes', JSON.stringify(clientes));
    carregarClientesCard();
    atualizarDashboard();
  }
}
