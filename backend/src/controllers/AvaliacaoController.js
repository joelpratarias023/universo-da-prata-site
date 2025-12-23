const { v4: uuidv4 } = require('uuid');
const Avaliacao = require('../models/Avaliacao');
const Produto = require('../models/Produto');
const { enviarSucesso, enviarErro } = require('../utils/respostas');

class AvaliacaoController {
  static async criar(req, res) {
    try {
      const { produto_id, estrelas, comentario } = req.body;
      const usuario_id = req.usuario.id;

      if (!produto_id || !estrelas) {
        return enviarErro(res, 'Produto e número de estrelas são obrigatórios', 400);
      }

      if (estrelas < 1 || estrelas > 5) {
        return enviarErro(res, 'Estrelas deve ser entre 1 e 5', 400);
      }

      const produto = await Produto.buscarPorId(produto_id);
      if (!produto) {
        return enviarErro(res, 'Produto não encontrado', 404);
      }

      const uuid = uuidv4();
      const resultado = await Avaliacao.criar({
        uuid,
        produto_id,
        usuario_id,
        estrelas,
        comentario: comentario || '',
      });
      // Recalcular média de avaliações
      await Avaliacao.calcularMedia(produto_id);

      const criado = resultado?.id || resultado?.insertId || resultado?.uuid;
      const avaliacao = await Avaliacao.buscarPorId(criado);
      enviarSucesso(res, avaliacao, 'Avaliação criada com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao criar avaliação:', erro);
      enviarErro(res, 'Erro ao criar avaliação', 500, erro.message);
    }
  }

  static async buscar(req, res) {
    try {
      const { id } = req.params;

      const avaliacao = await Avaliacao.buscarPorId(id);
      if (!avaliacao) {
        return enviarErro(res, 'Avaliação não encontrada', 404);
      }

      enviarSucesso(res, avaliacao, 'Avaliação recuperada');
    } catch (erro) {
      console.error('Erro ao buscar avaliação:', erro);
      enviarErro(res, 'Erro ao buscar avaliação', 500, erro.message);
    }
  }

  static async listarPorProduto(req, res) {
    try {
      const { produto_id } = req.params;
      const { pagina = 1, limite = 10 } = req.query;

      const produto = await Produto.buscarPorId(produto_id);
      if (!produto) {
        return enviarErro(res, 'Produto não encontrado', 404);
      }

      const avaliacoes = await Avaliacao.listarPorProduto(produto_id, parseInt(pagina), parseInt(limite));
      enviarSucesso(res, avaliacoes, 'Avaliações recuperadas');
    } catch (erro) {
      console.error('Erro ao listar avaliações:', erro);
      enviarErro(res, 'Erro ao listar avaliações', 500, erro.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { estrelas, comentario } = req.body;
      const usuario_id = req.usuario.id;

      const avaliacao = await Avaliacao.buscarPorId(id);
      if (!avaliacao) {
        return enviarErro(res, 'Avaliação não encontrada', 404);
      }

      if (avaliacao.usuario_id !== usuario_id && req.usuario.tipo !== 'admin') {
        return enviarErro(res, 'Acesso não autorizado', 403);
      }

      const dados = {};
      if (estrelas !== undefined) {
        if (estrelas < 1 || estrelas > 5) {
          return enviarErro(res, 'Estrelas deve ser entre 1 e 5', 400);
        }
        dados.estrelas = estrelas;
      }
      if (comentario !== undefined) dados.comentario = comentario;

      if (Object.keys(dados).length === 0) {
        return enviarErro(res, 'Nenhum dado para atualizar', 400);
      }

      await Avaliacao.atualizar(id, dados);

      // Recalcular média
      await Avaliacao.calcularMedia(avaliacao.produto_id);

      const avaliacaoAtualizada = await Avaliacao.buscarPorId(id);
      enviarSucesso(res, avaliacaoAtualizada, 'Avaliação atualizada com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar avaliação:', erro);
      enviarErro(res, 'Erro ao atualizar avaliação', 500, erro.message);
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const avaliacao = await Avaliacao.buscarPorId(id);
      if (!avaliacao) {
        return enviarErro(res, 'Avaliação não encontrada', 404);
      }

      if (avaliacao.usuario_id !== usuario_id && req.usuario.tipo !== 'admin') {
        return enviarErro(res, 'Acesso não autorizado', 403);
      }

      await Avaliacao.deletar(id);

      // Recalcular média
      await Avaliacao.calcularMedia(avaliacao.produto_id);

      enviarSucesso(res, null, 'Avaliação deletada com sucesso');
    } catch (erro) {
      console.error('Erro ao deletar avaliação:', erro);
      enviarErro(res, 'Erro ao deletar avaliação', 500, erro.message);
    }
  }
}

module.exports = AvaliacaoController;
