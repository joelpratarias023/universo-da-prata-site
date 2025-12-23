function abrirModalReparacao() {
  document.getElementById('modalReparacao').style.display = 'flex';
}

function fecharModalReparacao() {
  const modal = document.getElementById('modalReparacao');
  if (modal) modal.style.display = 'none';
}

const formReparacao = document.getElementById('formReparacao');
if (formReparacao) formReparacao.addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const descricao = document.getElementById('descricao').value.trim();

  if (!nome || !telefone || !descricao) {
    showWarning("Por favor, preencha todos os campos.", 4000);
    return;
  }

  const msg = `Olá, gostaria de solicitar um serviço de *reparação*:\n\n Nome: ${nome}\n Telefone: ${telefone}\n Descrição: ${descricao}`;
  const url = `https://wa.me/244934803197?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showSuccess("Abrindo WhatsApp...", 2000);

  fecharModalReparacao();
  setTimeout(() => {
    window.location.href = 'obrigado.html';
  }, 400);
});
