function toggleMenu() {
  const menu = document.querySelector('.menu-navegacao');
  const menuAberto = menu.classList.toggle('mobile-visivel');
  menu.classList.toggle('mobile-escondido');

  if (menuAberto) {
    criarOverlay(); // Ativa o clique fora
  } else {
    removerOverlay(); // Remove o clique fora
  }
}

function criarOverlay() {
  if (document.getElementById('menu-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'menu-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'transparent';
  overlay.style.zIndex = '998';
  overlay.addEventListener('click', toggleMenu);
  document.body.appendChild(overlay);
}

function removerOverlay() {
  const overlay = document.getElementById('menu-overlay');
  if (overlay) overlay.remove();
}

function ajustarMenuParaTamanhoTela() {
  const menu = document.querySelector('.menu-navegacao');
  if (window.innerWidth > 768) {
    menu.classList.remove('mobile-escondido', 'mobile-visivel');
  } else {
    menu.classList.add('mobile-escondido');
  }
}

window.addEventListener('load', ajustarMenuParaTamanhoTela);
window.addEventListener('resize', ajustarMenuParaTamanhoTela);

// Mostra o menu após o preloader
window.addEventListener('load', () => {
  document.querySelector('.menu-fixo').style.display = 'flex';
});

// Atualiza também o contador do menu lateral
const todosContadores = document.querySelectorAll('.carrinho-count');
todosContadores.forEach(span => {
  span.textContent = total;
});

