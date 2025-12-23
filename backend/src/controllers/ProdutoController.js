const { v4: uuidv4 } = require('uuid');
const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const validacoes = require('../utils/validacoes');

class ProdutoController {
  // CRUD de Produtos
  static async criar(req, res) {
    try {
      const { nome, descricao, preco, categoria_id, imagem_url, estoque, preco_promocional, ativo } = req.body;

      if (!nome || !preco || !categoria_id) {
        return enviarErro(res, 'Nome, preço e categoria são obrigatórios', 400);
      }

      if (isNaN(preco) || preco <= 0) {
        return enviarErro(res, 'Preço inválido', 400);
      }

      // Verificar se categoria existe
      const categoria = await Categoria.buscarPorId(categoria_id);
      if (!categoria) {
        return enviarErro(res, 'Categoria não encontrada', 404);
      }

      const uuid = uuidv4();
      const resultado = await Produto.criar({
        uuid,
        nome: validacoes.limpar(nome),
        descricao: descricao || '',
        preco: parseFloat(preco),
        categoria_id,
        imagem_url: imagem_url || null,
        estoque: parseInt(estoque) || 0,
        preco_promocional: preco_promocional !== undefined && preco_promocional !== null && preco_promocional !== '' ? parseFloat(preco_promocional) : null,
        ativo: ativo === undefined ? true : !!ativo,
      });
      const criado = resultado?.id || resultado?.insertId || resultado?.uuid;
      const produto = await Produto.buscarPorId(criado);
      enviarSucesso(res, produto, 'Produto criado com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao criar produto:', erro);
      enviarErro(res, 'Erro ao criar produto', 500, erro.message);
    }
  }

  static async buscar(req, res) {
    try {
      const { id } = req.params;

      const produto = await Produto.buscarPorId(id);
      if (!produto) {
        return enviarErro(res, 'Produto não encontrado', 404);
      }

      enviarSucesso(res, produto, 'Produto recuperado');
    } catch (erro) {
      console.error('Erro ao buscar produto:', erro);
      enviarErro(res, 'Erro ao buscar produto', 500, erro.message);
    }
  }

  static async listarAdmin(req, res) {
    try {
      const { categoria_id, busca, pagina = 1, limite = 50 } = req.query;

      const filtros = {
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        busca: busca || null,
      };

      const produtos = await Produto.listarAdmin(filtros, parseInt(pagina), parseInt(limite));
      enviarSucesso(res, produtos, 'Produtos (admin) recuperados');
    } catch (erro) {
      console.error('Erro ao listar produtos (admin):', erro);
      enviarErro(res, 'Erro ao listar produtos', 500, erro.message);
    }
  }

  static async listar(req, res) {
    try {
      const { categoria_id, busca, preco_min, preco_max, pagina = 1, limite = 12 } = req.query;

      const filtros = {
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        busca: busca || null,
        preco_min: preco_min ? parseFloat(preco_min) : null,
        preco_max: preco_max ? parseFloat(preco_max) : null,
      };

      const produtos = await Produto.listar(filtros, parseInt(pagina), parseInt(limite));
      enviarSucesso(res, produtos, 'Produtos recuperados');
    } catch (erro) {
      console.error('Erro ao listar produtos:', erro);
      enviarErro(res, 'Erro ao listar produtos', 500, erro.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, categoria_id, imagem_url, estoque, preco_promocional, ativo } = req.body;

      const produto = await Produto.buscarPorIdAdmin(id);
      if (!produto) {
        return enviarErro(res, 'Produto não encontrado', 404);
      }

      const dados = {};
      if (nome) dados.nome = validacoes.limpar(nome);
      if (descricao !== undefined) dados.descricao = descricao;
      if (preco) dados.preco = parseFloat(preco);
      if (categoria_id) dados.categoria_id = categoria_id;
      if (imagem_url !== undefined) dados.imagem_url = imagem_url;
      if (estoque !== undefined) dados.estoque = parseInt(estoque);
      if (preco_promocional !== undefined) {
        dados.preco_promocional = (preco_promocional === null || preco_promocional === '') ? null : parseFloat(preco_promocional);
      }
      if (ativo !== undefined) dados.ativo = !!ativo;

      if (Object.keys(dados).length === 0) {
        return enviarErro(res, 'Nenhum dado para atualizar', 400);
      }

      await Produto.atualizar(id, dados);

      const produtoAtualizado = await Produto.buscarPorIdAdmin(id);
      enviarSucesso(res, produtoAtualizado, 'Produto atualizado com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar produto:', erro);
      enviarErro(res, 'Erro ao atualizar produto', 500, erro.message);
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;

      const produto = await Produto.buscarPorIdAdmin(id);
      if (!produto) {
        return enviarErro(res, 'Produto não encontrado', 404);
      }

      await Produto.deletar(id);
      enviarSucesso(res, null, 'Produto deletado com sucesso');
    } catch (erro) {
      console.error('Erro ao deletar produto:', erro);
      enviarErro(res, 'Erro ao deletar produto', 500, erro.message);
    }
  }

  // Produtos por categoria
  static async buscarPorCategoria(req, res) {
    try {
      const { categoria_id } = req.params;
      const { pagina = 1, limite = 12 } = req.query;

      const categoria = await Categoria.buscarPorId(categoria_id);
      if (!categoria) {
        return enviarErro(res, 'Categoria não encontrada', 404);
      }

      const produtos = await Produto.buscarPorCategoria(categoria_id, parseInt(pagina), parseInt(limite));
      enviarSucesso(res, produtos, 'Produtos da categoria recuperados');
    } catch (erro) {
      console.error('Erro ao buscar produtos por categoria:', erro);
      enviarErro(res, 'Erro ao buscar produtos', 500, erro.message);
    }
  }

  // Produtos mais vendidos
  static async maisVendidos(req, res) {
    try {
      const { limite = 10 } = req.query;

      const produtos = await Produto.buscarMaisVendidos(parseInt(limite));
      enviarSucesso(res, produtos, 'Produtos mais vendidos recuperados');
    } catch (erro) {
      console.error('Erro ao buscar produtos mais vendidos:', erro);
      enviarErro(res, 'Erro ao buscar produtos', 500, erro.message);
    }
  }
}

module.exports = ProdutoController;
