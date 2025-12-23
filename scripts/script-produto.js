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
        <a href="https://wa.me/244934803197?text=Olá! Gostaria de fazer um pedido da peça: ${encodeURIComponent(produto.nome)}" target="_blank" class="botao-pedido">
          Fazer Pedido via WhatsApp
        </a>
      </div>
    `;
    container.appendChild(div);
  });
  } else {
    container.innerHTML = "<p>Produto não encontrado.</p>";
  }
}
