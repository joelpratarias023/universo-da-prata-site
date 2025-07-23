const produtos = [
  {
    id: "Anéis-Homens",
    nome: "Anel Masculino Clássico",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 22.000",
    imagem: "produto/anel-masculino1.png"
  },
  {
    id: "Anéis-Homens",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },
 
  {
    id: "Anéis-Homens",
    nome: "Anel Masculino Clássico3",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },

  
  {
    id: "Pulseiras-Mulheres",
    nome: "Pulseira Feminina Elegante",
    descricao: "Pulseira delicada com acabamento espelhado. Perfeita para ocasiões especiais.",
    preco: "AKZ 18.500",
    imagem: "produto/pulseira-femina.png"
  },
  {
    id: "Pingentes-Crianças",
    nome: "Pingente Infantil Estrelinha",
    descricao: "Pingente divertido e seguro para crianças, em prata leve e polida.",
    preco: "AKZ 12.000",
    imagem: "produto/pingente-crianca.jpg"
  },
  {
    id: "Correntes-Casais",
    nome: "Correntes Duplas de Amor",
    descricao: "Conjunto de correntes para casais com pingente de conexão. Um símbolo do vínculo eterno.",
    preco: "AKZ 35.000",
    imagem: "produto/correntes-casais.jpg"
  }
];

function mostrarAvisoCarrinho() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // O aviso desaparece após 3 segundos
  }
}
