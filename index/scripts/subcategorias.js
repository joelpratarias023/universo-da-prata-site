function obterCategoriaDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("categoria");
}

function carregarSubcategorias() {
  const categoria = obterCategoriaDaUrl();
  if (!categoria) {
    window.location.href = "categorias.html";
    return;
  }

  document.getElementById("subcategoria-titulo").innerText = `Peças para: ${categoria}`;
  const container = document.getElementById("subcategorias-container");
  container.innerHTML = "";

  const opcoes = ['Homens', 'Mulheres'];
  if (categoria !== "Piercings") {
    opcoes.push('Casais', 'Crianças');
  }

  opcoes.forEach(opcao => {
    const div = document.createElement("div");
    div.className = "subcard";
    div.innerText = opcao;
    div.onclick = () => abrirProdutos(categoria, opcao);
    container.appendChild(div);
  });
}

function abrirProdutos(categoria, publico) {
  const id = `${categoria}-${publico}`;
  localStorage.setItem("produtoSelecionado", id);
  localStorage.setItem("etapaAnterior", JSON.stringify({
    origem: "subcategorias",
    categoria: categoria,
    publico: publico
  }));

  registrarNavegacao("subcategorias.html");
  window.location.href = "produto.html";
}

function registrarNavegacao(pagina) {
  let historico = JSON.parse(localStorage.getItem("historicoNavegacao")) || [];
  historico.push(pagina);
  localStorage.setItem("historicoNavegacao", JSON.stringify(historico));
}

function voltarPorHistorico() {
  let historico = JSON.parse(localStorage.getItem("historicoNavegacao")) || [];
  historico.pop(); // tira a página atual
  if (historico.length > 0) {
    const anterior = historico.pop();
    localStorage.setItem("historicoNavegacao", JSON.stringify(historico));
    window.location.href = anterior;
  } else {
    window.location.href = "index.html";
  }
}

window.addEventListener("load", () => {
  registrarNavegacao("subcategorias.html");
  carregarSubcategorias();
});
