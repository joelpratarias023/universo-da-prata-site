// Função para carregar e exibir os itens do carrinho
function carregarCarrinho() {
  const carrinhoContainer = document.getElementById("carrinho-itens");
  const totalSpan = document.getElementById("total-carrinho");

  // Obtém os itens salvos no localStorage
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  carrinhoContainer.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    if (carrinhoContainer) {
      carrinhoContainer.innerHTML = `
        <div class="carrinho-vazio">
          <img src="imagens/carrinho-vazio.png" alt="Carrinho vazio" />
        </div>
      `;
    }
    if (totalSpan) totalSpan.textContent = "0 Kz";
    return;
  }

  carrinho.forEach((produto, index) => {
    // Criação do item visual
    const item = document.createElement("div");
    item.className = "item-carrinho";

    item.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <div class="detalhes">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <strong>${produto.preco}</strong>
        <button class="remover" data-index="${index}">Remover</button>
      </div>
    `;

    carrinhoContainer.appendChild(item);

    // Soma ao total (remove "AKZ", pontos e espaços)
    const precoStr = (produto.preco == null) ? '0' : String(produto.preco);
    const precoNumerico = parseFloat(precoStr.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    total += precoNumerico;
  });

  if (totalSpan) {
    totalSpan.textContent = `AKZ ${total.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Adiciona eventos de remoção
  document.querySelectorAll(".remover").forEach(botao => {
    botao.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      carrinho.splice(index, 1);
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      carregarCarrinho();
    });
  });
}

// Ao carregar a página, executa
document.addEventListener("DOMContentLoaded", carregarCarrinho);
