const produtoId = localStorage.getItem("produtoSelecionado");
const container = document.getElementById("produto-detalhes");

if (!container) {
  console.warn('produto-detalhes container não encontrado');
} else if (typeof produtos === 'undefined' || !Array.isArray(produtos)) {
  container.innerHTML = "<p>Produtos não disponíveis.</p>";
} else {
  const produtosFiltrados = produtos.filter(p => p.id === produtoId);

  if (produtosFiltrados.length > 0) {
  produtosFiltrados.forEach(produto => {
    const div = document.createElement("div");
    div.className = "produto-container";
    div.innerHTML = `
      <div class="produto-imagem">
        <img src="${produto.imagem}" alt="${produto.nome}" />
      </div>
      <div class="produto-info">
        <h2>${produto.nome}</h2>
        <p class="descricao">${produto.descricao}</p>
        <p class="preco">${produto.preco}</p>
        <button class="botao-pedido add-carrinho" data-produto='${JSON.stringify(produto)}'>🛒 Adicionar ao Carrinho</button>
      </div>
    `;
    container.appendChild(div);
  });
  } else {
    container.innerHTML = "<p>Produto não encontrado.</p>";
  }
}

// Event delegation para adicionar ao carrinho
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-carrinho')) {
    const produto = JSON.parse(e.target.dataset.produto);
    
    // Adiciona ao carrinho
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produtoExistente = carrinho.find(item => item.nome === produto.nome);
    
    if (produtoExistente) {
      produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
    } else {
      produto.quantidade = 1;
      carrinho.push(produto);
    }
    
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    
    if (typeof showSuccess === 'function') {
      showSuccess("Produto adicionado ao carrinho! 🛒", 3000);
    } else {
      alert("Produto adicionado ao carrinho!");
    }
    
    if (typeof atualizarNumeroCarrinho === 'function') {
      atualizarNumeroCarrinho();
    }
  }
});
