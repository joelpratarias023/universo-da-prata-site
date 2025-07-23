document.addEventListener("DOMContentLoaded", () => {
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const resultadosDiv = document.getElementById("resultados-pesquisa");

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
        item.className = "item-resultado";
        item.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <h3>${produto.nome}</h3>
          <p>${produto.preco}</p>
        `;
        item.addEventListener("click", () => {
          sessionStorage.setItem("produtoSelecionado", JSON.stringify(produto));
          window.location.href = "produto.html";
        });
        resultadosDiv.appendChild(item);
      });
    }
  });
});
