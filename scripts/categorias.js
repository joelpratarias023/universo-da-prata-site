function abrirSubcategorias(categoria) {
  localStorage.setItem("categoriaSelecionada", categoria);
  registrarNavegacao("categorias.html");
  window.location.href = `subcategorias.html?categoria=${encodeURIComponent(categoria)}`;
}

function registrarNavegacao(pagina) {
  let historico = JSON.parse(localStorage.getItem("historicoNavegacao")) || [];
  historico.push(pagina);
  localStorage.setItem("historicoNavegacao", JSON.stringify(historico));
}

window.addEventListener("load", function () {
  registrarNavegacao("categorias.html");
});
