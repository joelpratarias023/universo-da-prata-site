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
  configurarMetodoEntrega();
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

// Atualiza quando a página é restaurada do cache (botão voltar)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    atualizarContadorCarrinho();
  }
});

function configurarMetodoEntrega() {
  const selectPonto = document.getElementById('pontoEncontro');
  const campoOutroLocal = document.getElementById('campo-outro-local');
  const inputOutroLocal = document.getElementById('outroLocal');
  const textareaEndereco = document.getElementById('endereco');

  // Listener para o select de ponto de encontro
  if (selectPonto) {
    selectPonto.addEventListener('change', function() {
      if (this.value) {
        // Se selecionou um ponto, desabilita o endereço
        textareaEndereco.disabled = true;
        textareaEndereco.value = '';
        textareaEndereco.style.backgroundColor = '#f5f5f5';
        textareaEndereco.style.cursor = 'not-allowed';
        
        // Mostra campo "Outro" se necessário
        if (this.value === 'Outro') {
          campoOutroLocal.style.display = 'block';
          inputOutroLocal.setAttribute('required', 'required');
        } else {
          campoOutroLocal.style.display = 'none';
          inputOutroLocal.removeAttribute('required');
        }
      } else {
        // Se desmarcou, habilita o endereço
        textareaEndereco.disabled = false;
        textareaEndereco.style.backgroundColor = '#fff';
        textareaEndereco.style.cursor = 'text';
        campoOutroLocal.style.display = 'none';
        inputOutroLocal.removeAttribute('required');
      }
    });
  }

  // Listener para o campo de endereço
  if (textareaEndereco) {
    textareaEndereco.addEventListener('input', function() {
      if (this.value.trim().length > 0) {
        // Se começou a digitar endereço, desabilita o ponto de encontro
        selectPonto.disabled = true;
        selectPonto.value = '';
        selectPonto.style.backgroundColor = '#f5f5f5';
        selectPonto.style.cursor = 'not-allowed';
        campoOutroLocal.style.display = 'none';
        inputOutroLocal.removeAttribute('required');
      } else {
        // Se apagou o endereço, habilita o ponto de encontro
        selectPonto.disabled = false;
        selectPonto.style.backgroundColor = '#fff';
        selectPonto.style.cursor = 'pointer';
      }
    });
  }
}

function enviarPedido(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const telefone = document.getElementById('whatsapp').value.trim();
  const dataEntrega = document.getElementById('dataEntrega').value.trim();
  const pagamento = document.getElementById('pagamento').value.trim();
  
  // Capturar ponto de encontro
  const selectPonto = document.getElementById('pontoEncontro').value;
  let pontoEncontro = '';
  
  if (selectPonto === 'Outro') {
    const outroLocal = document.getElementById('outroLocal').value.trim();
    pontoEncontro = outroLocal || 'A combinar';
  } else {
    pontoEncontro = selectPonto;
  }

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

  // Validar que pelo menos um dos dois seja preenchido
  if (!selectPonto && endereco.length < 5) {
    erros.push("Por favor, selecione um ponto de encontro OU preencha o endereço de entrega.");
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
    pontoEncontro: pontoEncontro,
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
  
  // Inclui apenas o que foi preenchido
  if (pontoEncontro) {
    mensagem += `📍 *Ponto de Encontro:* ${pontoEncontro}\n`;
  }
  if (endereco) {
    mensagem += `📍 *Endereço de Entrega:* ${endereco}\n`;
  }
  
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
