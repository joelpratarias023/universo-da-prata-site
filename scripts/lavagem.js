// scripts/lavagem.js

function abrirModal() {
  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function enviarWhatsApp() {
  const nome = document.getElementById('nome').value.trim();
  const localizacao = document.getElementById('localizacao').value.trim();
  const tipo = document.getElementById('tipoLavagem').value;
  const obs = document.getElementById('observacoes').value.trim();

  if (!nome || !localizacao) {
    showWarning("Preencha os campos obrigatórios.", 4000);
    return;
  }

  const mensagem = `Olá! Meu nome é ${nome}.\nGostaria de pedir o serviço de lavagem: ${tipo}.\nEstou em ${localizacao}.\nObservações: ${obs || 'Nenhuma'}`;
  const url = `https://wa.me/244934803197?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
  showSuccess("Abrindo WhatsApp...", 2000);
  fecharModal();
  setTimeout(() => {
    window.location.href = 'obrigado.html';
  }, 400);
}
