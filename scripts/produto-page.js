// scripts/produto-page.js

import { produtos } from './produto.js';

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("produto-detalhes");
  const params = new URLSearchParams(window.location.search);
  const nome = params.get("nome");

  if (!nome) {
    container.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  const produto = produtos.find(p => p.nome === nome);

  if (!produto) {
    container.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  container.innerHTML = `
    <div class="produto-detalhado">
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
      <strong>${produto.preco}</strong>
      <br /><br />
      <button onclick="history.back()">← Voltar</button>
    </div>
  `;
});
