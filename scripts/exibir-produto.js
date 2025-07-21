document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id || !Array.isArray(produtos)) {
    console.error("Produto não encontrado.");
    return;
  }

  const produto = produtos.find(p => p.nome === id);

  if (produto) {
    document.getElementById("nomeProduto").textContent = produto.nome;
    document.getElementById("descricaoProduto").textContent = produto.descricao;
    document.getElementById("precoProduto").textContent = produto.preco;
    document.getElementById("imagemProduto").src = produto.imagem;
    document.getElementById("imagemProduto").alt = produto.nome;
  } else {
    console.error("Produto não encontrado com ID:", id);
  }
});
