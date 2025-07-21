function toggleMenu() {
  const menu = document.querySelector('.menu-navegacao');
  menu.classList.toggle('mobile-escondido');
  menu.classList.toggle('mobile-visivel');
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
