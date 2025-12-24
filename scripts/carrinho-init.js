// scripts/carrinho-init.js
document.addEventListener('DOMContentLoaded', function() {
  const botaoFinalizar = document.getElementById("finalizar-compra");
  if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", function() {
      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

      if (carrinho.length === 0) {
        showWarning("O seu carrinho está vazio! 🛒");
      } else {
        window.location.href = "confirmacao.html";
      }
    });
  }

  atualizarNumeroCarrinho();
});

function atualizarNumeroCarrinho() {
  const icone = document.querySelector('.carrinho-count');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  if (icone) icone.textContent = total;
}

// Atualiza quando a página é restaurada do cache (botão voltar)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    atualizarNumeroCarrinho();
  }
});

function voltarParaOrigem() {
  const etapa = JSON.parse(localStorage.getItem("etapaAnterior"));

  if (etapa?.origem === "subcategorias") {
    window.location.href = `subcategorias.html?categoria=${encodeURIComponent(etapa.categoria)}`;
  } else if (etapa?.origem === "categorias") {
    window.location.href = "categorias.html";
  } else {
    window.history.back();
  }
}
