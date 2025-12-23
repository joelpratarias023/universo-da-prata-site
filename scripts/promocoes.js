// scripts/promocoes.js
// Ao clicar em um produto em promoção, armazena o nome para a página detalhe-produto.html

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn-ver').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const nomeProduto = this.getAttribute('data-produto');
      if (nomeProduto) {
        localStorage.setItem('produtoSelecionado', nomeProduto);
      }
    });
  });
});
