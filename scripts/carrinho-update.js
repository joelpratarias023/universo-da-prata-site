// scripts/carrinho-update.js
document.addEventListener('DOMContentLoaded', function() {
  function atualizarNumeroCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const total = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);
    document.querySelectorAll('.carrinho-count').forEach(el => {
      el.textContent = total;
    });
  }
  atualizarNumeroCarrinho();
});
