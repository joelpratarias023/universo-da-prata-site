const produtoId = localStorage.getItem("produtoSelecionado");
const produto = produtos.find(p => p.id === produtoId);
const container = document.getElementById("produto-detalhes");

if (produto) {
  container.innerHTML = `
    <div class="produto-imagem">
      <img src="${produto.imagem}" alt="${produto.nome}" />
    </div>
    <div class="produto-info">
      <h2>${produto.nome}</h2>
      <p class="descricao">${produto.descricao}</p>
      <p class="preco">${produto.preco}</p>
      <a href="https://wa.me/244934803197?text=Olá! Gostaria de fazer um pedido da ${encodeURIComponent(produto.nome)}." target="_blank" class="botao-pedido">
        Fazer Pedido via WhatsApp
      </a>
    </div>
  `;
} else {
  container.innerHTML = "<p>Produto não encontrado.</p>";
}
