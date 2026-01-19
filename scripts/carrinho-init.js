// scripts/carrinho-init.js
document.addEventListener('DOMContentLoaded', function() {
  const botaoFinalizar = document.getElementById("finalizar-compra");
  if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", function() {
      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

      if (carrinho.length === 0) {
        mostrarModalCarrinhoVazio();
      } else {
        window.location.href = "confirmacao.html";
      }
    });
  }

  // Event listeners para o modal de carrinho vazio
  const modalCarrinhoVazio = document.getElementById('carrinho-vazio-modal');
  const btnFechar = document.getElementById('carrinho-modal-fechar');
  const btnComprar = document.getElementById('carrinho-modal-comprar');

  if (btnFechar) {
    btnFechar.addEventListener('click', () => {
      fecharModalCarrinhoVazio();
    });
  }

  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      window.location.href = 'categorias.html';
    });
  }

  if (modalCarrinhoVazio) {
    modalCarrinhoVazio.addEventListener('click', (e) => {
      if (e.target === modalCarrinhoVazio) {
        fecharModalCarrinhoVazio();
      }
    });
  }

  atualizarNumeroCarrinho();
});

function mostrarModalCarrinhoVazio() {
  const modal = document.getElementById('carrinho-vazio-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function fecharModalCarrinhoVazio() {
  const modal = document.getElementById('carrinho-vazio-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function atualizarNumeroCarrinho() {
  const icone = document.querySelector('.carrinho-count');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  if (icone) icone.textContent = total;
}

function voltarParaOrigem() {
  const etapa = JSON.parse(localStorage.getItem("etapaAnterior"));

  if (etapa?.origem === "subcategorias") {
    window.location.href = `subcategorias.html?categoria=${encodeURIComponent(etapa.categoria)}`;
  } else if (etapa?.origem === "categorias") {
    window.location.href = "categorias.html";
  } else {
    window.history.back();
  }
}
