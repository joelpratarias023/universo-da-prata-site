// ===== CARD DE ENTREGADORES =====

function abrirCardEntregadores() {
  const modal = document.getElementById('modal-entregadores');
  if (modal) {
    modal.style.display = 'flex';
    carregarEntregadoresCard();
  }
}

function carregarEntregadoresCard() {
  const entregadores = JSON.parse(localStorage.getItem('universo_entregadores')) || [];
  const tbody = document.getElementById('lista-entregadores-card');
  
  if (!tbody) return;

  if (entregadores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum entregador adicionado ainda</td></tr>';
    atualizarResumoEntregadores(entregadores);
    return;
  }

  tbody.innerHTML = entregadores.map(entregador => `
    <tr>
      <td>${entregador.nome}</td>
      <td>${entregador.telefone}</td>
      <td><span class="badge-status status-${entregador.status}">${entregador.status}</span></td>
      <td>${entregador.entregas || 0}</td>
      <td>
        <button class="btn-pequeno" onclick="editarEntregadorCard('${entregador.id}')">Editar</button>
        <button class="btn-pequeno btn-danger" onclick="deletarEntregadorCard('${entregador.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumoEntregadores(entregadores);
}

function atualizarResumoEntregadores(entregadores) {
  const totalEntregadores = entregadores.length;
  const ativos = entregadores.filter(e => e.status === 'ativo').length;
  const totalEntregas = entregadores.reduce((total, e) => total + (parseInt(e.entregas) || 0), 0);

  const resumoTotal = document.getElementById('total-entregadores-resumo');
  const resumoAtivos = document.getElementById('entregadores-ativos');
  const resumoEntregas = document.getElementById('total-entregas');

  if (resumoTotal) resumoTotal.textContent = totalEntregadores;
  if (resumoAtivos) resumoAtivos.textContent = ativos;
  if (resumoEntregas) resumoEntregas.textContent = totalEntregas;
}

function filtrarEntregadoresCard() {
  const filtroNome = document.getElementById('filtro-entregadores-card')?.value.toLowerCase() || '';
  const filtroStatus = document.getElementById('filtro-status-entregador-card')?.value || '';
  const entregadores = JSON.parse(localStorage.getItem('universo_entregadores')) || [];
  
  const filtrados = entregadores.filter(e => {
    const nomeMatch = e.nome.toLowerCase().includes(filtroNome);
    const statusMatch = filtroStatus === '' || e.status === filtroStatus;
    return nomeMatch && statusMatch;
  });

  const tbody = document.getElementById('lista-entregadores-card');
  if (!tbody) return;

  tbody.innerHTML = filtrados.map(entregador => `
    <tr>
      <td>${entregador.nome}</td>
      <td>${entregador.telefone}</td>
      <td><span class="badge-status status-${entregador.status}">${entregador.status}</span></td>
      <td>${entregador.entregas || 0}</td>
      <td>
        <button class="btn-pequeno" onclick="editarEntregadorCard('${entregador.id}')">Editar</button>
        <button class="btn-pequeno btn-danger" onclick="deletarEntregadorCard('${entregador.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumoEntregadores(filtrados);
}

function editarEntregadorCard(id) {
  console.log('Editar entregador:', id);
}

function deletarEntregadorCard(id) {
  if (confirm('Tem certeza que deseja deletar este entregador?')) {
    let entregadores = JSON.parse(localStorage.getItem('universo_entregadores')) || [];
    entregadores = entregadores.filter(e => e.id !== id);
    localStorage.setItem('universo_entregadores', JSON.stringify(entregadores));
    carregarEntregadoresCard();
    atualizarDashboard();
  }
}
