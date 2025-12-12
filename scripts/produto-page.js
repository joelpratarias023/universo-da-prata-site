// scripts/produto-page.js

document.addEventListener("DOMContentLoaded", function () {
  const produtoId = localStorage.getItem("produtoSelecionado");
  const container = document.getElementById("produto-detalhes");

  const produtosFiltrados = produtos.filter(p => p.id === produtoId);

  if (produtosFiltrados.length > 0) {
    produtosFiltrados.forEach(produto => {
      const div = document.createElement("div");
      div.className = "produto-detalhes";
      div.innerHTML = `
        <div class="produto-imagem">
          <img src="${produto.imagem}" alt="${produto.nome}" />
        </div>
        <div class="produto-info">
          <h2>${produto.nome}</h2>
          <p class="descricao">${produto.descricao}</p>
          <p class="preco">${produto.preco}</p>
          <div class="botoes-container">
            <a href="https://wa.me/244934803197?text=Olá! Gostaria de fazer um pedido da peça: ${encodeURIComponent(produto.nome)}" target="_blank" class="botao-pedido">
              Fazer Pedido via WhatsApp
            </a>
            <button class="botao-pedido add-carrinho" data-produto='${JSON.stringify(produto)}'>🛒 Adicionar ao Carrinho</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = "<p>Produto não encontrado.</p>";
  }

  // Event delegation para adicionar ao carrinho
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-carrinho')) {
      const produto = JSON.parse(e.target.dataset.produto);
      adicionarAoCarrinho(produto);
    }
  });
});

function mostrarAvisoCarrinho() {
  showSuccess("Produto adicionado ao carrinho! 🛒", 3000);
}

function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  mostrarAvisoCarrinho();
  atualizarNumeroCarrinho();
}

function atualizarNumeroCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  
  const todosContadores = document.querySelectorAll('.carrinho-count');
  todosContadores.forEach(span => {
    span.textContent = total;
  });

  const pontoHamburguer = document.getElementById('notificacaoHamburguer');
  if (pontoHamburguer) {
    pontoHamburguer.style.display = total > 0 ? 'block' : 'none';
  }
}

// Inicializa o contador ao carregar
atualizarNumeroCarrinho();

function voltarPorHistorico() {
  const etapa = JSON.parse(localStorage.getItem("etapaAnterior"));
  if (etapa && etapa.origem === "subcategorias") {
    window.location.href = `subcategorias.html?categoria=${encodeURIComponent(etapa.categoria)}`;
  } else {
    window.location.href = "index.html";
  }
}
