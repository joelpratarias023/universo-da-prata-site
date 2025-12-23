document.addEventListener("DOMContentLoaded", () => {
  const subcategoriasContainer = document.querySelector('#subcategorias .grid');
  const categoriasContainer = document.getElementById('categorias');
  const subcategoriasSection = document.getElementById('subcategorias');
  const titulo = document.getElementById('subcategoria-titulo');
  // If required DOM elements are missing, define safe no-op handlers
  if (!subcategoriasContainer || !categoriasContainer || !subcategoriasSection || !titulo) {
    window.mostrarSubcategorias = function() { return; };
    window.voltarCategorias = function() { return; };
    window.abrirProdutos = function(categoria, publico) {
      const id = `${categoria}-${publico}`;
      localStorage.setItem('produtoSelecionado', id);
      window.location.href = 'produto.html';
    };
    return;
  }

  window.mostrarSubcategorias = function(nomeCategoria) {
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

    categoriasContainer.style.display = 'none';
    subcategoriasSection.style.display = 'block';
    titulo.innerText = `Peças para: ${nomeCategoria}`;
  };

  window.voltarCategorias = function() {
    subcategoriasSection.style.display = 'none';
    categoriasContainer.style.display = 'block';
  };

  window.abrirProdutos = function(categoria, publico) {
    const id = `${categoria}-${publico}`;
    localStorage.setItem('produtoSelecionado', id);
    window.location.href = 'produto.html';
  };
});
