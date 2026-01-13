function getMenuElemento() {
  return document.querySelector('.menu-navegacao');
}

function menuEstaAberto(menu) {
  return !!menu && menu.classList.contains('mobile-visivel') && window.innerWidth <= 768;
}

function abrirMenu() {
  const menu = getMenuElemento();
  if (!menu) return;
  menu.classList.add('mobile-visivel');
  menu.classList.remove('mobile-escondido');
  criarOverlay();
}

function fecharMenu() {
  const menu = getMenuElemento();
  if (!menu) return;
  menu.classList.remove('mobile-visivel');
  menu.classList.add('mobile-escondido');
  removerOverlay();
}

function toggleMenu() {
  const menu = getMenuElemento();
  if (!menu) return;
  if (menuEstaAberto(menu)) {
    fecharMenu();
  } else {
    abrirMenu();
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
  overlay.style.zIndex = '10000';
  overlay.addEventListener('click', fecharMenu);
  document.body.appendChild(overlay);
}

function removerOverlay() {
  const overlay = document.getElementById('menu-overlay');
  if (overlay) overlay.remove();
}

function ajustarMenuParaTamanhoTela() {
  const menu = document.querySelector('.menu-navegacao');
  if (!menu) return;
  if (window.innerWidth > 768) {
    // Modo desktop - remove todas as classes mobile e overlay
    menu.classList.remove('mobile-escondido', 'mobile-visivel');
    menu.style.left = ''; // Remove inline styles
    removerOverlay();
  } else {
    // Modo mobile - adiciona classe escondido apenas se não tiver nenhuma classe mobile
    if (!menu.classList.contains('mobile-visivel') && !menu.classList.contains('mobile-escondido')) {
      menu.classList.add('mobile-escondido');
    }
  }
}

// Debounce para evitar múltiplas chamadas durante resize
let resizeTimer;
function ajustarMenuComDebounce() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(ajustarMenuParaTamanhoTela, 100);
}

window.addEventListener('load', ajustarMenuParaTamanhoTela);
window.addEventListener('resize', ajustarMenuComDebounce);
window.addEventListener('orientationchange', () => {
  setTimeout(ajustarMenuParaTamanhoTela, 200);
});

// Fecha o menu ao clicar fora (mais robusto que só overlay)
function instalarFechamentoPorCliqueFora() {
  if (window.__menuCloseHandlersInstalled) return;
  window.__menuCloseHandlersInstalled = true;

  const handler = (e) => {
    const menu = getMenuElemento();
    if (!menuEstaAberto(menu)) return;

    const alvo = e.target;
    // Verifica se clicou no menu, no hambúrguer, ou em um link do menu
    if (alvo && alvo.closest) {
      if (alvo.closest('.menu-navegacao') || alvo.closest('.menu-hamburguer')) {
        // Se clicou em um link do menu, não fecha aqui (deixa o outro handler cuidar)
        const link = alvo.closest('.menu-navegacao a');
        if (link) return;
        // Se clicou no menu mas não em um link, retorna sem fechar
        return;
      }
    }
    fecharMenu();
  };

  document.addEventListener('mousedown', handler);
  document.addEventListener('touchstart', handler, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = getMenuElemento();
      if (menuEstaAberto(menu)) fecharMenu();
    }
  });

  // Fecha ao clicar num link do menu
  document.addEventListener('click', (e) => {
    const menu = getMenuElemento();
    if (!menuEstaAberto(menu)) return;
    const link = e.target && e.target.closest ? e.target.closest('.menu-navegacao a') : null;
    if (link && link.href) {
      // Garante que o link não seja # (anchor) ou javascript:
      const href = link.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        // Permite que a navegação aconteça naturalmente
        // O menu será fechado pela nova página que carregar
        return;
      }
      // Para links # ou vazios, apenas fecha o menu
      setTimeout(() => {
        fecharMenu();
      }, 50);
    }
  }, true); // useCapture = true para executar antes de outros handlers
}

// Mostra o menu após o preloader
window.addEventListener('load', () => {
  const menuFixo = document.querySelector('.menu-fixo');
  if (menuFixo) {
    menuFixo.style.display = 'flex';
  }
});

// Atualiza também o contador do menu lateral
document.addEventListener('DOMContentLoaded', () => {
  instalarFechamentoPorCliqueFora();

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  const todosContadores = document.querySelectorAll('.carrinho-count');
  todosContadores.forEach(span => {
    span.textContent = total;
  });
});

