// scripts/detalhe-produto.js

document.addEventListener("DOMContentLoaded", function () {
  const produtoNome = localStorage.getItem("produtoSelecionado");
  const container = document.getElementById("detalhe-produto");

  // Busca o produto pelo NOME (não ID, para ser único)
  const produtoEncontrado = produtos.find(p => p.nome === produtoNome);

  if (produtoEncontrado) {
    const div = document.createElement("div");
    div.className = "detalhe-unico";
    div.innerHTML = `
      <div class="detalhe-imagem">
        <img src="${produtoEncontrado.imagem}" alt="${produtoEncontrado.nome}" />
      </div>
      <div class="detalhe-info">
        <h2>${produtoEncontrado.nome}</h2>
        <p class="detalhe-descricao">${produtoEncontrado.descricao}</p>
        <p class="detalhe-preco">${produtoEncontrado.preco}</p>
        <div class="botoes-container">
          <a href="https://wa.me/244934803197?text=Olá! Gostaria de fazer um pedido da peça: ${encodeURIComponent(produtoEncontrado.nome)}" target="_blank" class="botao-pedido">
            Fazer Pedido via WhatsApp
          </a>
          <button class="botao-pedido add-carrinho" data-produto='${JSON.stringify(produtoEncontrado)}'>🛒 Adicionar ao Carrinho</button>
        </div>
      </div>
    `;
    container.appendChild(div);
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
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  
  // Verifica se produto já existe no carrinho
  const produtoExistente = carrinho.find(item => item.nome === produto.nome);
  
  if (produtoExistente) {
    produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
  } else {
    produto.quantidade = 1;
    carrinho.push(produto);
  }
  
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarNumeroCarrinho();
  mostrarAvisoCarrinho();
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
