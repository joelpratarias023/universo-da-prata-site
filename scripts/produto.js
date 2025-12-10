const produtos = [
  // Categoria de aneis para homens
  {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 22.000",
    imagem: "produto/anel-masculino1.png"
  },

    {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 22.000",
    imagem: "produto/anel-masculino1.png"
  },

    {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 22.000",
    imagem: "produto/anel-masculino1.png"
  },

    {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 22.000",
    imagem: "produto/anel-masculino1.png"
  },

    {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },  

  {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },
  
  {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },
  
  {
    id: "aneis-Homens",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },

  // Categoria de aneis para Mulheres
  {
    id: "aneis-Mulheres",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },
    {
    id: "aneis-Mulheres",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },
    {
    id: "aneis-Mulheres",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },

 // Categoria de aneis para Casais
  {
    id: "aneis-Casais",
    nome: "Anel Masculino Clássico2",
    descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
    preco: "AKZ 2.000",
    imagem: "produto/anel-masculino.jpg"
  },

// Categoria de aneis para Crianças
 {
  id: "aneis-Crianças",
  nome: "Anel Masculino Clássico3",
  descricao: "Anel em prata 925 com design refinado. Ideal para homens com estilo e presença.",
  preco: "AKZ 2.000",
  imagem: "produto/anel-masculino.jpg"
},

// Categoria de pulseiras para Mulheres
  {
    id: "pulseiras-Mulheres",
    nome: "Pulseira Feminina Elegante",
    descricao: "Pulseira delicada com acabamento espelhado. Perfeita para ocasiões especiais.",
    preco: "AKZ 18.500",
    imagem: "produto/pulseira-femina.png"
  },

  // Categoria de pingentes para Crianças
  {
    id: "pingentes-Crianças",
    nome: "Pingente Infantil Estrelinha",
    descricao: "Pingente divertido e seguro para crianças, em prata leve e polida.",
    preco: "AKZ 12.000",
    imagem: "produto/anel-masculino1.png"
  },

 // Categoria de Correntes para Casais
  {
    id: "Correntes-Casais",
    nome: "Correntes Duplas de Amor",
    descricao: "Conjunto de correntes para casais com pingente de conexão. Um símbolo do vínculo eterno.",
    preco: "AKZ 35.000",
    imagem: "produto/anel-masculino1.png"
  },
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
