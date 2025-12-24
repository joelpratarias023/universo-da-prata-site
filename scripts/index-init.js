// scripts/index-init.js
document.addEventListener('DOMContentLoaded', function() {
  atualizarNumeroCarrinho();
});

function atualizarNumeroCarrinho() {
  const icone = document.querySelector('.carrinho-count');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  
  // Atualiza também o contador do menu lateral
  const todosContadores = document.querySelectorAll('.carrinho-count');
  todosContadores.forEach(span => {
    span.textContent = total;
  });

  const pontoHamburguer = document.getElementById('notificacaoHamburguer');
  if (pontoHamburguer) {
    pontoHamburguer.style.display = total > 0 ? 'block' : 'none';
  }
}

// Atualiza quando a página é restaurada do cache (botão voltar)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    atualizarNumeroCarrinho();
  }
});
