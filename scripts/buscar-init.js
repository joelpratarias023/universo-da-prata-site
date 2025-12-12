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
  const todosContadores = document.querySelectorAll('.carrinho-count');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  todosContadores.forEach(span => {
    span.textContent = total;
  });

  // Menu responsivo
  ajustarMenuParaTamanhoTela();
});

function toggleMenu(){
  const menu = document.querySelector('.menu-navegacao');
  menu.classList.toggle('mobile-escondido');
  menu.classList.toggle('mobile-visivel');
}

function ajustarMenuParaTamanhoTela(){
  const menu = document.querySelector('.menu-navegacao');
  if(window.innerWidth > 768){
    menu.classList.remove('mobile-escondido', 'mobile-visivel');
  } else {
    menu.classList.add('mobile-escondido');
  }
}

window.addEventListener('load', ajustarMenuParaTamanhoTela);
window.addEventListener('resize', ajustarMenuParaTamanhoTela);
