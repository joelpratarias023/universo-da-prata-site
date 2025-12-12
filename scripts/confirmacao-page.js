// scripts/confirmacao-page.js

// Inicializar EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init("3tODf0cATd2J3nsCZ");
}

// Preenche o resumo de produtos
document.addEventListener('DOMContentLoaded', function() {
  preencherResumo();
  const form = document.getElementById('form-confirmacao');
  if (form) {
    form.addEventListener('submit', enviarPedido);
  }
  
  atualizarContadorCarrinho();
});

function preencherResumo() {
  const produtos = JSON.parse(localStorage.getItem("carrinho")) || [];
  const resumo = document.getElementById("resumo-produtos");
  let lista = "<h2>Resumo da Compra:</h2><ul>";
  let total = 0;

  produtos.forEach(p => {
    lista += `<li>${p.nome} - ${p.preco}</li>`;
    const valor = parseFloat(p.preco.replace(/[^\d,]/g, '').replace(',', '.'));
    total += valor;
  });

  lista += `</ul><p><strong>Total:</strong> AKZ ${total.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}</p>`;
  resumo.innerHTML = lista;
}

function atualizarContadorCarrinho() {
  const todosContadores = document.querySelectorAll('.carrinho-count');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  todosContadores.forEach(span => {
    span.textContent = total;
  });

  const pontoHamburguer = document.getElementById('notificacaoHamburguer');
  if (pontoHamburguer) {
    pontoHamburguer.style.display = total > 0 ? 'block' : 'none';
  }
}

function enviarPedido(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const telefone = document.getElementById('whatsapp').value.trim();
  const dataEntrega = document.getElementById('dataEntrega').value.trim();
  const pagamento = document.getElementById('pagamento').value.trim();

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const mensagemErro = document.getElementById("mensagem-erro");
  mensagemErro.innerHTML = "";

  const erros = [];

  if (nome.length < 3) {
    erros.push("Nome inválido (mínimo 3 caracteres).");
  }

  if (!telefone.match(/^(\+244)?9\d{8}$/)) {
    erros.push("Número do WhatsApp inválido. Ex: +244923000000");
  }

  if (endereco.length < 5) {
    erros.push("Endereço de entrega incompleto.");
  }

  if (!dataEntrega) {
    erros.push("Data de entrega não selecionada.");
  }

  if (!pagamento) {
    erros.push("Selecione a forma de pagamento.");
  }

  if (carrinho.length === 0) {
    erros.push("Seu carrinho está vazio.");
  }

  if (erros.length > 0) {
    showError(erros.join(" "), 6000);
    return;
  }

  // EmailJS
  const templateParams = {
    nome: nome,
    telefone: telefone,
    endereco: endereco,
    dataEntrega: dataEntrega,
    pagamento: pagamento,
    itens: carrinho.map(item => `${item.nome} - ${item.preco}`).join("\n")
  };

  if (typeof emailjs !== 'undefined') {
    emailjs.send('service_us6no95', 'template_kk6zokl', templateParams)
      .then(function(response) {
        showSuccess('Pedido enviado com sucesso!', 3000);
      }, function(error) {
        showError('Falha ao enviar o pedido. Por favor, tente novamente.', 5000);
      });
  }

  // Monta a mensagem WhatsApp
  let mensagem = `🛍️ *Confirmação de Pedido - Universo da Prata* 🛍️\n\n`;
  mensagem += `👤 *Nome:* ${nome}\n`;
  mensagem += `📍 *Endereço:* ${endereco}\n`;
  mensagem += `📞 *Telefone:* ${telefone}\n`;
  mensagem += `📅 *Data de Entrega:* ${dataEntrega}\n`;
  mensagem += `💳 *Forma de Pagamento:* ${pagamento}\n\n`;
  mensagem += `📦 *Itens do Carrinho:*\n`;

  carrinho.forEach((item) => {
    mensagem += `• ${item.nome} - ${item.preco}\n`;
  });

  mensagem += `\n📝 *Observação:* Pagamento apenas após a entrega.\n`;
  mensagem += `\nAguarde nosso contato para confirmação do envio.`;

  const url = `https://wa.me/244934803197?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');

  localStorage.removeItem('carrinho');

  showSuccess("Pedido realizado! Redirecionando...", 2000);
  setTimeout(() => {
    window.location.href = "obrigado.html";
  }, 2000);
}
