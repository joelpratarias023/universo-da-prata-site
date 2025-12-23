const { v4: uuidv4 } = require('uuid');
const Categoria = require('../models/Categoria');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const validacoes = require('../utils/validacoes');

class CategoriaController {
  static async criar(req, res) {
    try {
      const { nome, descricao, imagem_url, ordem, ativa } = req.body;

      if (!nome) {
        return enviarErro(res, 'Nome da categoria é obrigatório', 400);
      }

      const uuid = uuidv4();
      const resultado = await Categoria.criar({
        uuid,
        nome: validacoes.limpar(nome),
        descricao: descricao || '',
        imagem_url: imagem_url || null,
        ordem: ordem || 0,
        ativa: ativa === undefined ? true : !!ativa,
      });
      const criado = resultado?.id || resultado?.insertId || resultado?.uuid;
      const categoria = await Categoria.buscarPorId(criado);
      enviarSucesso(res, categoria, 'Categoria criada com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao criar categoria:', erro);
      enviarErro(res, 'Erro ao criar categoria', 500, erro.message);
    }
  }

  static async buscar(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.buscarPorId(id);
      if (!categoria) {
        return enviarErro(res, 'Categoria não encontrada', 404);
      }

      enviarSucesso(res, categoria, 'Categoria recuperada');
    } catch (erro) {
      console.error('Erro ao buscar categoria:', erro);
      enviarErro(res, 'Erro ao buscar categoria', 500, erro.message);
    }
  }

  static async listar(req, res) {
    try {
      const categorias = await Categoria.listar();
      enviarSucesso(res, categorias, 'Categorias recuperadas');
    } catch (erro) {
      console.error('Erro ao listar categorias:', erro);
      enviarErro(res, 'Erro ao listar categorias', 500, erro.message);
    }
  }

  static async listarAdmin(req, res) {
    try {
      const categorias = await Categoria.listarAdmin();
      enviarSucesso(res, categorias, 'Categorias (admin) recuperadas');
    } catch (erro) {
      console.error('Erro ao listar categorias (admin):', erro);
      enviarErro(res, 'Erro ao listar categorias', 500, erro.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, imagem_url, ordem, ativa } = req.body;

      const categoria = await Categoria.buscarPorIdAdmin(id);
      if (!categoria) {
        return enviarErro(res, 'Categoria não encontrada', 404);
      }

      const dados = {};
      if (nome) dados.nome = validacoes.limpar(nome);
      if (descricao !== undefined) dados.descricao = descricao;
      if (imagem_url !== undefined) dados.imagem_url = imagem_url;
      if (ordem !== undefined) dados.ordem = ordem;
      if (ativa !== undefined) dados.ativa = !!ativa;

      if (Object.keys(dados).length === 0) {
        return enviarErro(res, 'Nenhum dado para atualizar', 400);
      }

      await Categoria.atualizar(id, dados);

      const categoriaAtualizada = await Categoria.buscarPorIdAdmin(id);
      enviarSucesso(res, categoriaAtualizada, 'Categoria atualizada com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar categoria:', erro);
      enviarErro(res, 'Erro ao atualizar categoria', 500, erro.message);
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.buscarPorIdAdmin(id);
      if (!categoria) {
        return enviarErro(res, 'Categoria não encontrada', 404);
      }

      await Categoria.deletar(id);
      enviarSucesso(res, null, 'Categoria deletada com sucesso');
    } catch (erro) {
      console.error('Erro ao deletar categoria:', erro);
      enviarErro(res, 'Erro ao deletar categoria', 500, erro.message);
    }
  }
}

module.exports = CategoriaController;
