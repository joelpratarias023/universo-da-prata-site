function abrirModalReparacao() {
  document.getElementById('modalReparacao').style.display = 'flex';
}

document.getElementById('formReparacao').addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const descricao = document.getElementById('descricao').value.trim();

  const msg = `Olá, gostaria de solicitar um serviço de *reparação*:\n\n👤 Nome: ${nome}\n📞 Telefone: ${telefone}\n🔧 Descrição: ${descricao}`;
  const url = `https://wa.me/244931549615?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});
