// scripts/buscar-init.js
document.addEventListener('DOMContentLoaded', function() {
  // Estrelas
  const starsContainer = document.getElementById("stars-container");
  if (starsContainer) {
    for(let i = 0; i < 100; i++){
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${5 + Math.random() * 10}s`;
      star.style.opacity = Math.random();
      starsContainer.appendChild(star);
    }
  }

  // Contador carrinho
  atualizarContadorCarrinho();

  // Menu responsivo
  ajustarMenuParaTamanhoTela();
});

function atualizarContadorCarrinho() {
  const todosContadores = document.querySelectorAll('.carrinho-count');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  todosContadores.forEach(span => {
    span.textContent = total;
  });
}

// Atualiza quando a página é restaurada do cache (botão voltar)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    atualizarContadorCarrinho();
  }
});

// Funções de menu agora são carregadas de menu.js
// function toggleMenu() removido - usar o do menu.js
// function ajustarMenuParaTamanhoTela() removido - usar o do menu.js
