// ===== CARD DE AVALIAÇÕES =====

function abrirCardAvaliacao() {
  const modal = document.getElementById('modal-avaliacoes');
  if (modal) {
    modal.style.display = 'flex';
    carregarAvaliacoesCard();
  }
}

function carregarAvaliacoesCard() {
  const avaliacoes = JSON.parse(localStorage.getItem('universo_avaliacoes')) || [];
  const container = document.getElementById('lista-avaliacoes-card');
  
  if (!container) return;

  if (avaliacoes.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Nenhuma avaliação registrada ainda</p>';
    atualizarResumoAvaliacoes(avaliacoes);
    return;
  }

  container.innerHTML = avaliacoes.map((avaliacao, idx) => `
    <div class="avaliacao-item">
      <div class="avaliacao-header">
        <strong>${avaliacao.cliente}</strong>
        <span class="avaliacao-estrelas">${'⭐'.repeat(avaliacao.estrelas)}${'☆'.repeat(5 - avaliacao.estrelas)}</span>
      </div>
      <p class="avaliacao-produto">Produto: ${avaliacao.produto}</p>
      <p class="avaliacao-comentario">${avaliacao.comentario}</p>
      <p class="avaliacao-data">${avaliacao.data}</p>
      <button class="btn-pequeno btn-danger" onclick="deletarAvaliacaoCard(${idx})">Deletar</button>
    </div>
  `).join('');

  atualizarResumoAvaliacoes(avaliacoes);
}

function atualizarResumoAvaliacoes(avaliacoes) {
  const totalAvaliacoes = avaliacoes.length;
  const mediaAvaliacoes = totalAvaliacoes > 0 
    ? (avaliacoes.reduce((total, a) => total + (parseInt(a.estrelas) || 0), 0) / totalAvaliacoes).toFixed(1)
    : 0;
  const avaliacoes5 = avaliacoes.filter(a => parseInt(a.estrelas) === 5).length;

  const resumoTotal = document.getElementById('total-avaliacoes-resumo');
  const resumoMedia = document.getElementById('media-avaliacoes');
  const resumo5 = document.getElementById('avaliacoes-5-resumo');

  if (resumoTotal) resumoTotal.textContent = totalAvaliacoes;
  if (resumoMedia) resumoMedia.textContent = `${mediaAvaliacoes}/5`;
  if (resumo5) resumo5.textContent = avaliacoes5;
}

function filtrarAvaliacoesCard() {
  const filtroEstrelas = document.getElementById('filtro-estrelas-card')?.value || '';
  const avaliacoes = JSON.parse(localStorage.getItem('universo_avaliacoes')) || [];
  
  const filtradas = filtroEstrelas === '' 
    ? avaliacoes 
    : avaliacoes.filter(a => parseInt(a.estrelas) === parseInt(filtroEstrelas));

  const container = document.getElementById('lista-avaliacoes-card');
  if (!container) return;

  if (filtradas.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Nenhuma avaliação com este filtro</p>';
    atualizarResumoAvaliacoes(filtradas);
    return;
  }

  container.innerHTML = filtradas.map((avaliacao, idx) => `
    <div class="avaliacao-item">
      <div class="avaliacao-header">
        <strong>${avaliacao.cliente}</strong>
        <span class="avaliacao-estrelas">${'⭐'.repeat(avaliacao.estrelas)}${'☆'.repeat(5 - avaliacao.estrelas)}</span>
      </div>
      <p class="avaliacao-produto">Produto: ${avaliacao.produto}</p>
      <p class="avaliacao-comentario">${avaliacao.comentario}</p>
      <p class="avaliacao-data">${avaliacao.data}</p>
      <button class="btn-pequeno btn-danger" onclick="deletarAvaliacaoCard(${idx})">Deletar</button>
    </div>
  `).join('');

  atualizarResumoAvaliacoes(filtradas);
}

function deletarAvaliacaoCard(idx) {
  if (confirm('Tem certeza que deseja deletar esta avaliação?')) {
    let avaliacoes = JSON.parse(localStorage.getItem('universo_avaliacoes')) || [];
    avaliacoes.splice(idx, 1);
    localStorage.setItem('universo_avaliacoes', JSON.stringify(avaliacoes));
    carregarAvaliacoesCard();
    atualizarDashboard();
  }
}
