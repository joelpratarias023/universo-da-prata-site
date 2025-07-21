// Esconde preloader e mostra menu após 5 segundos
setTimeout(() => {
  document.getElementById('preloader').style.display = 'none';
  document.getElementById('menu-fixo').style.display = 'block';
}, 5000);

// Geração de estrelas animadas
const starsContainer = document.getElementById("stars-container");
for (let i = 0; i < 100; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.animationDuration = `${5 + Math.random() * 10}s`;
  star.style.opacity = Math.random();
  starsContainer.appendChild(star);
}

// Alterna menu hambúrguer
function toggleMenu() {
  const menu = document.querySelector('.menu-navegacao');
  menu.classList.toggle('mobile-escondido');
  menu.classList.toggle('mobile-visivel');
}

// Ajusta visibilidade do menu conforme o tamanho da tela
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

// Restaura rolagem se existir
window.addEventListener("load", function () {
  const scroll = localStorage.getItem("scrollPos");
  if (scroll) {
    window.scrollTo(0, parseInt(scroll));
    localStorage.removeItem("scrollPos");
  }
});

// Funções relacionadas às categorias/subcategorias
function mostrarSubcategorias(nomeCategoria) {
  const subcategoriasContainer = document.querySelector('#subcategorias .grid');
  subcategoriasContainer.innerHTML = '';

  const opcoes = ['Homens', 'Mulheres'];
  if (nomeCategoria !== 'Piercings') {
    opcoes.push('Casais', 'Crianças');
  }

  opcoes.forEach(opcao => {
    const div = document.createElement('div');
    div.className = 'subcard';
    div.innerText = opcao;
    div.onclick = () => abrirProdutos(nomeCategoria, opcao);
    subcategoriasContainer.appendChild(div);
  });

  document.getElementById('categorias').style.display = 'none';
  document.getElementById('subcategorias').style.display = 'block';
  document.getElementById('subcategoria-titulo').innerText = `Peças para: ${nomeCategoria}`;
}

function voltarCategorias() {
  document.getElementById('subcategorias').style.display = 'none';
  document.getElementById('categorias').style.display = 'block';
}

function abrirProdutos(categoria, publico) {
  const id = `${categoria}-${publico}`;
  localStorage.setItem("produtoSelecionado", id);

  localStorage.setItem("etapaAnterior", JSON.stringify({
    categoria: categoria,
    publico: publico,
    origem: "index"
  }));

  window.location.href = "produto.html";
}

// Restaura última etapa se tiver vindo de produto.html
window.addEventListener("load", () => {
  if (window.location.hash === "#restaurar") {
    const etapa = JSON.parse(localStorage.getItem("etapaAnterior"));
    if (etapa) {
      mostrarSubcategorias(etapa.categoria);
      setTimeout(() => {
        abrirProdutos(etapa.categoria, etapa.publico);
      }, 500);
    }
  }
});

// Navegação personalizada
function registrarNavegacao(pagina) {
  let historico = JSON.parse(localStorage.getItem("historicoNavegacao")) || [];
  historico.push(pagina);
  localStorage.setItem("historicoNavegacao", JSON.stringify(historico));
}

function voltarPorHistorico() {
  let historico = JSON.parse(localStorage.getItem("historicoNavegacao")) || [];
  historico.pop(); // Remove a página atual

  if (historico.length > 0) {
    const anterior = historico.pop();
    localStorage.setItem("historicoNavegacao", JSON.stringify(historico));
    window.location.href = anterior;
  } else {
    window.location.href = "index.html";
  }
}
