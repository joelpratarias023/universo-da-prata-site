/**
 * 📱 Arquivo de Integração Frontend com Backend
 * 
 * Este arquivo mostra como conectar o Frontend ao Backend Node.js/MySQL
 * Copie as funções para seu projeto frontend
 */

// ===================================
// CONFIGURAÇÃO GLOBAL DA API
// ===================================

const API_URL = 'http://localhost:3001/api';

// Função genérica para requisições
const api = async (endpoint, opcoes = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...opcoes.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...opcoes,
      headers
    });

    const dados = await response.json();
    
    if (!response.ok && dados.mensagem === 'Token inválido ou expirado') {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/index.html';
    }

    return dados;
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    return { sucesso: false, mensagem: 'Erro de conexão com o servidor' };
  }
};

// ===================================
// AUTENTICAÇÃO
// ===================================

const Auth = {
  // Registrar novo usuário
  async registrar(nome, email, cpf, telefone, senha, confirmar_senha) {
    const resultado = await api('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        email,
        cpf,
        telefone,
        senha,
        confirmar_senha
      })
    });

    if (resultado.sucesso) {
      localStorage.setItem('token', resultado.dados.token);
      localStorage.setItem('usuario', JSON.stringify(resultado.dados.usuario));
    }

    return resultado;
  },

  // Fazer login
  async login(email, senha) {
    const resultado = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });

    if (resultado.sucesso) {
      localStorage.setItem('token', resultado.dados.token);
      localStorage.setItem('usuario', JSON.stringify(resultado.dados.usuario));
    }

    return resultado;
  },

  // Obter perfil do usuário
  async obterPerfil() {
    return await api('/auth/perfil');
  },

  // Atualizar perfil
  async atualizarPerfil(nome, telefone) {
    return await api('/auth/perfil', {
      method: 'PUT',
      body: JSON.stringify({ nome, telefone })
    });
  },

  // Alterar senha
  async alterarSenha(senha_atual, senha_nova, confirmar_senha) {
    return await api('/auth/alterar-senha', {
      method: 'POST',
      body: JSON.stringify({
        senha_atual,
        senha_nova,
        confirmar_senha
      })
    });
  },

  // Fazer logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/index.html';
  }
};

// ===================================
// PRODUTOS
// ===================================

const Produtos = {
  // Listar produtos com filtros
  async listar(pagina = 1, limite = 12, filtros = {}) {
    let url = `/produtos?pagina=${pagina}&limite=${limite}`;
    
    if (filtros.busca) url += `&busca=${encodeURIComponent(filtros.busca)}`;
    if (filtros.categoria_id) url += `&categoria_id=${filtros.categoria_id}`;
    if (filtros.preco_min) url += `&preco_min=${filtros.preco_min}`;
    if (filtros.preco_max) url += `&preco_max=${filtros.preco_max}`;

    return await api(url);
  },

  // Buscar produto específico
  async buscar(id) {
    return await api(`/produtos/${id}`);
  },

  // Produtos por categoria
  async porCategoria(categoria_id, pagina = 1, limite = 12) {
    return await api(`/produtos/categoria/${categoria_id}?pagina=${pagina}&limite=${limite}`);
  },

  // Produtos mais vendidos
  async maisVendidos(limite = 10) {
    return await api(`/produtos/mais-vendidos?limite=${limite}`);
  },

  // Criar produto (admin)
  async criar(nome, descricao, preco, categoria_id, imagem_url, estoque) {
    return await api('/produtos', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        descricao,
        preco,
        categoria_id,
        imagem_url,
        estoque
      })
    });
  },

  // Atualizar produto (admin)
  async atualizar(id, dados) {
    return await api(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });
  },

  // Deletar produto (admin)
  async deletar(id) {
    return await api(`/produtos/${id}`, {
      method: 'DELETE'
    });
  }
};

// ===================================
// CATEGORIAS
// ===================================

const Categorias = {
  // Listar todas as categorias
  async listar() {
    return await api('/categorias');
  },

  // Buscar categoria específica
  async buscar(id) {
    return await api(`/categorias/${id}`);
  },

  // Criar categoria (admin)
  async criar(nome, descricao, imagem_url, ordem) {
    return await api('/categorias', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        descricao,
        imagem_url,
        ordem
      })
    });
  },

  // Atualizar categoria (admin)
  async atualizar(id, dados) {
    return await api(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });
  },

  // Deletar categoria (admin)
  async deletar(id) {
    return await api(`/categorias/${id}`, {
      method: 'DELETE'
    });
  }
};

// ===================================
// PEDIDOS
// ===================================

const Pedidos = {
  // Criar novo pedido
  async criar(itens, endereco_id, taxa_entrega = 0, desconto = 0, observacoes = '') {
    return await api('/pedidos', {
      method: 'POST',
      body: JSON.stringify({
        itens,
        endereco_id,
        taxa_entrega,
        desconto,
        observacoes
      })
    });
  },

  // Obter meus pedidos
  async meusPedidos(pagina = 1, limite = 10) {
    return await api(`/pedidos/meus-pedidos?pagina=${pagina}&limite=${limite}`);
  },

  // Buscar pedido específico
  async buscar(id) {
    return await api(`/pedidos/${id}`);
  },

  // Listar pedidos (admin)
  async listar(pagina = 1, limite = 20, status = null) {
    let url = `/pedidos?pagina=${pagina}&limite=${limite}`;
    if (status) url += `&status=${status}`;
    return await api(url);
  },

  // Atualizar pedido (admin)
  async atualizar(id, status, entregador_id = null) {
    return await api(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        entregador_id
      })
    });
  }
};

// ===================================
// ENDEREÇOS
// ===================================

const Enderecos = {
  // Listar endereços do usuário
  async listar() {
    return await api('/enderecos');
  },

  // Buscar endereço específico
  async buscar(id) {
    return await api(`/enderecos/${id}`);
  },

  // Criar novo endereço
  async criar(endereco, numero, complemento, bairro, cidade, estado, cep, principal = false) {
    return await api('/enderecos', {
      method: 'POST',
      body: JSON.stringify({
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        principal
      })
    });
  },

  // Atualizar endereço
  async atualizar(id, dados) {
    return await api(`/enderecos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });
  },

  // Deletar endereço
  async deletar(id) {
    return await api(`/enderecos/${id}`, {
      method: 'DELETE'
    });
  }
};

// ===================================
// AVALIAÇÕES
// ===================================

const Avaliacoes = {
  // Criar avaliação
  async criar(produto_id, estrelas, comentario = '') {
    return await api('/avaliacoes', {
      method: 'POST',
      body: JSON.stringify({
        produto_id,
        estrelas,
        comentario
      })
    });
  },

  // Listar avaliações do produto
  async porProduto(produto_id, pagina = 1, limite = 10) {
    return await api(`/avaliacoes/produto/${produto_id}?pagina=${pagina}&limite=${limite}`);
  },

  // Buscar avaliação específica
  async buscar(id) {
    return await api(`/avaliacoes/${id}`);
  },

  // Atualizar avaliação
  async atualizar(id, estrelas, comentario) {
    return await api(`/avaliacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        estrelas,
        comentario
      })
    });
  },

  // Deletar avaliação
  async deletar(id) {
    return await api(`/avaliacoes/${id}`, {
      method: 'DELETE'
    });
  }
};

// ===================================
// EXEMPLOS DE USO
// ===================================

/*
// REGISTRAR USUÁRIO
Auth.registrar(
  'João Silva',
  'joao@email.com',
  '12345678900',
  '+244912345678',
  'Senha123!',
  'Senha123!'
).then(resultado => {
  if (resultado.sucesso) {
    console.log('Usuário registrado:', resultado.dados.usuario);
  } else {
    console.error('Erro:', resultado.mensagem);
  }
});

// FAZER LOGIN
Auth.login('joao@email.com', 'Senha123!').then(resultado => {
  if (resultado.sucesso) {
    console.log('Logado como:', resultado.dados.usuario.nome);
  }
});

// LISTAR PRODUTOS
Produtos.listar(1, 12, { categoria_id: 1, busca: 'broche' }).then(resultado => {
  console.log('Produtos:', resultado.dados);
});

// CRIAR PEDIDO
Pedidos.criar(
  [
    { produto_id: 1, quantidade: 2 },
    { produto_id: 3, quantidade: 1 }
  ],
  1, // endereco_id
  50, // taxa_entrega
  10  // desconto
).then(resultado => {
  if (resultado.sucesso) {
    console.log('Pedido criado:', resultado.dados.numero_pedido);
  }
});

// ADICIONAR AVALIAÇÃO
Avaliacoes.criar(1, 5, 'Produto excelente!').then(resultado => {
  console.log('Avaliação salva');
});
*/

// ===================================
// EXPORTAR PARA USO
// ===================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    api,
    Auth,
    Produtos,
    Categorias,
    Pedidos,
    Enderecos,
    Avaliacoes
  };
}
