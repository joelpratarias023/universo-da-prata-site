document.addEventListener("DOMContentLoaded", () => {
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const resultadosDiv = document.getElementById("resultados-pesquisa");

  if (!campoPesquisa || !resultadosDiv) return;

  campoPesquisa.addEventListener("input", () => {
    const termo = campoPesquisa.value.toLowerCase();
    resultadosDiv.innerHTML = "";

    if (termo.trim() === "") return;

    const resultados = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(termo)
    );

    if (resultados.length === 0) {
      resultadosDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
    } else {
      resultados.forEach(produto => {
        const item = document.createElement("div");
        item.className = "resultado-item"; // ✅ AGORA BATE COM O CSS

        item.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <h3>${produto.nome}</h3>
          <p>${produto.preco}</p>
        `;

        item.addEventListener("click", () => {
      localStorage.setItem("produtoSelecionado", produto.nome);
      window.location.href = "detalhe-produto.html";
        });

        resultadosDiv.appendChild(item);
      });
    }
  });
});

function abrirPesquisaNormal() {
  document.getElementById("pesquisaNormal").style.display = "block";
  document.getElementById("pedidoPersonalizado").style.display = "none";
  document.querySelector(".escolha-pesquisa").style.display = "none";
}

function abrirPedidoPersonalizado() {
  document.getElementById("pedidoPersonalizado").style.display = "block";
  document.getElementById("pesquisaNormal").style.display = "none";
  document.querySelector(".escolha-pesquisa").style.display = "none";
}
