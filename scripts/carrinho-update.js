// scripts/carrinho-update.js
function atualizarNumeroCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);
  document.querySelectorAll('.carrinho-count').forEach(el => {
    el.textContent = total;
  });
}

// Atualiza quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarNumeroCarrinho);

// Atualiza quando a página é restaurada do cache (botão voltar)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Página foi restaurada do cache (bfcache)
    atualizarNumeroCarrinho();
  }
});

// Atualiza quando o localStorage muda em outra aba/janela
window.addEventListener('storage', function(e) {
  if (e.key === 'carrinho') {
    atualizarNumeroCarrinho();
  }
});
