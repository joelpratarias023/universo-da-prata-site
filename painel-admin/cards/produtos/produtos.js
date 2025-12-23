// ===== CARD DE PRODUTOS =====

function abrirCardProdutos() {
  const modal = document.getElementById('modal-produtos');
  if (modal) {
    modal.style.display = 'flex';
    carregarProdutosCard();
  }
}

function carregarProdutosCard() {
  const produtos = JSON.parse(localStorage.getItem('universo_produtos')) || [];
  const tbody = document.getElementById('lista-produtos-card');
  
  if (!tbody) return;

  if (produtos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum produto adicionado ainda</td></tr>';
    atualizarResumo(produtos);
    return;
  }

  tbody.innerHTML = produtos.map(produto => `
    <tr>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.preco} AKZ</td>
      <td style="color: ${parseInt(produto.estoque) < 5 ? '#ef4444' : '#22c55e'}">${produto.estoque}</td>
      <td>
        <button class="btn-pequeno" onclick="editarProdutoCard('${produto.id}')">Editar</button>
        <button class="btn-pequeno btn-danger" onclick="deletarProdutoCard('${produto.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumo(produtos);
}

function atualizarResumo(produtos) {
  const totalProdutos = produtos.length;
  const valorEstoque = produtos.reduce((total, p) => total + (parseFloat(p.preco) * parseInt(p.estoque) || 0), 0);
  const baixoEstoque = produtos.filter(p => parseInt(p.estoque) < 5).length;

  const resumoTotal = document.getElementById('total-produtos-resumo');
  const resumoValor = document.getElementById('valor-estoque');
  const resumoBaixo = document.getElementById('baixo-estoque');

  if (resumoTotal) resumoTotal.textContent = totalProdutos;
  if (resumoValor) resumoValor.textContent = `${valorEstoque.toFixed(2)} AKZ`;
  if (resumoBaixo) resumoBaixo.textContent = baixoEstoque;
}

function filtrarProdutosCard() {
  const filtroNome = document.getElementById('filtro-produtos-card')?.value.toLowerCase() || '';
  const filtroCategoria = document.getElementById('filtro-categoria-card')?.value || '';
  const produtos = JSON.parse(localStorage.getItem('universo_produtos')) || [];
  
  const filtrados = produtos.filter(p => {
    const nomeMatch = p.nome.toLowerCase().includes(filtroNome);
    const categoriaMatch = filtroCategoria === '' || p.categoria === filtroCategoria;
    return nomeMatch && categoriaMatch;
  });

  const tbody = document.getElementById('lista-produtos-card');
  if (!tbody) return;

  tbody.innerHTML = filtrados.map(produto => `
    <tr>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.preco} AKZ</td>
      <td style="color: ${parseInt(produto.estoque) < 5 ? '#ef4444' : '#22c55e'}">${produto.estoque}</td>
      <td>
        <button class="btn-pequeno" onclick="editarProdutoCard('${produto.id}')">Editar</button>
        <button class="btn-pequeno btn-danger" onclick="deletarProdutoCard('${produto.id}')">Deletar</button>
      </td>
    </tr>
  `).join('');

  atualizarResumo(filtrados);
}

function editarProdutoCard(id) {
  // Implementar edição
  console.log('Editar produto:', id);
}

function deletarProdutoCard(id) {
  if (confirm('Tem certeza que deseja deletar este produto?')) {
    let produtos = JSON.parse(localStorage.getItem('universo_produtos')) || [];
    produtos = produtos.filter(p => p.id !== id);
    localStorage.setItem('universo_produtos', JSON.stringify(produtos));
    carregarProdutosCard();
    atualizarDashboard();
  }
}
