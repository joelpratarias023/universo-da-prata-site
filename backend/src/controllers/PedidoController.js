const { v4: uuidv4 } = require('uuid');
const Pedido = require('../models/Pedido');
const ItensPedido = require('../models/ItensPedido');
const Produto = require('../models/Produto');
const Endereco = require('../models/Endereco');
const PedidoHistorico = require('../models/PedidoHistorico');
const { enviarSucesso, enviarErro } = require('../utils/respostas');

class PedidoController {
  static async criar(req, res) {
    try {
      const { itens, endereco_id, observacoes, taxa_entrega, desconto } = req.body;
      const usuario_id = req.usuario.id;

      if (!itens || itens.length === 0) {
        return enviarErro(res, 'Nenhum item no pedido', 400);
      }

      if (!endereco_id) {
        return enviarErro(res, 'Endereço de entrega é obrigatório', 400);
      }

      // Verificar endereço
      const endereco = await Endereco.buscarPorId(endereco_id);
      if (!endereco) {
        return enviarErro(res, 'Endereço não encontrado', 404);
      }

      let valor_total = 0;
      for (const item of itens) {
        const produto = await Produto.buscarPorId(item.produto_id);
        if (!produto) {
          return enviarErro(res, `Produto ${item.produto_id} não encontrado`, 404);
        }

        if (produto.estoque < item.quantidade) {
          return enviarErro(res, `Estoque insuficiente para ${produto.nome}`, 400);
        }

        valor_total += produto.preco * item.quantidade;
      }

      valor_total += (taxa_entrega || 0);
      valor_total -= (desconto || 0);

      // Gerar número único do pedido
      const numero_pedido = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const uuid = uuidv4();
      const resultado = await Pedido.criar({
        uuid,
        usuario_id,
        numero_pedido,
        valor_total,
        taxa_entrega: taxa_entrega || 0,
        desconto: desconto || 0,
        endereco_entrega: endereco_id,
        observacoes: observacoes || '',
      });

      const pedidoId = resultado?.id || resultado?.insertId || resultado?.uuid;

      // Adicionar itens do pedido
      for (const item of itens) {
        const produto = await Produto.buscarPorId(item.produto_id);
        const subtotal = produto.preco * item.quantidade;

        await ItensPedido.criar({
          uuid: uuidv4(),
          pedido_id: pedidoId,
          produto_id: produto.id,
          quantidade: item.quantidade,
          preco_unitario: produto.preco,
          subtotal,
        });

        // Atualizar estoque
        await Produto.atualizarEstoque(produto.id, -item.quantidade);
      }

      const pedido = await Pedido.buscarPorId(pedidoId);
      enviarSucesso(res, pedido, 'Pedido criado com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao criar pedido:', erro);
      enviarErro(res, 'Erro ao criar pedido', 500, erro.message);
    }
  }

  static async buscar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const pedido = await Pedido.buscarPorId(id);
      if (!pedido) {
        return enviarErro(res, 'Pedido não encontrado', 404);
      }

      // Verificar se o usuário é o dono do pedido ou admin
      if (pedido.usuario_id !== usuario_id && req.usuario.tipo !== 'admin') {
        return enviarErro(res, 'Acesso não autorizado', 403);
      }

      const itens = await ItensPedido.listarPorPedido(pedido.id);

      enviarSucesso(res, { ...pedido, itens }, 'Pedido recuperado');
    } catch (erro) {
      console.error('Erro ao buscar pedido:', erro);
      enviarErro(res, 'Erro ao buscar pedido', 500, erro.message);
    }
  }

  static async listar(req, res) {
    try {
      const { status, busca, pagina = 1, limite = 10 } = req.query;
      const usuario_id = req.usuario.id;

      let filtros = { pagina: parseInt(pagina), limite: parseInt(limite) };

      // Se não for admin, listar apenas seus pedidos
      if (req.usuario.tipo !== 'admin') {
        filtros.usuario_id = usuario_id;
      }

      if (status) {
        filtros.status = status;
      }

      if (busca) {
        filtros.busca = busca;
      }

      const pedidos = await Pedido.listar(filtros, filtros.pagina, filtros.limite);
      enviarSucesso(res, pedidos, 'Pedidos recuperados');
    } catch (erro) {
      console.error('Erro ao listar pedidos:', erro);
      enviarErro(res, 'Erro ao listar pedidos', 500, erro.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { status, entregador_id, observacoes_internas } = req.body;
      const admin_id = req.usuario?.id;

      const pedido = await Pedido.buscarPorId(id);
      if (!pedido) {
        return enviarErro(res, 'Pedido não encontrado', 404);
      }

      const dados = {};
      if (status) dados.status = status;
      if (entregador_id) dados.entregador_id = entregador_id;
      if (observacoes_internas !== undefined) dados.observacoes_internas = observacoes_internas;

      if (Object.keys(dados).length === 0) {
        return enviarErro(res, 'Nenhum dado para atualizar', 400);
      }

      if (status === 'entregue') {
        dados.data_entrega = new Date();
      }

      await Pedido.atualizar(id, dados);

      // Registrar histórico (melhor esforço)
      try {
        if (status && status !== pedido.status) {
          await PedidoHistorico.criar({
            uuid: uuidv4(),
            pedido_id: pedido.id,
            admin_id,
            acao: 'status',
            de_status: pedido.status,
            para_status: status,
            observacao: null,
          });
        }

        if (observacoes_internas !== undefined) {
          await PedidoHistorico.criar({
            uuid: uuidv4(),
            pedido_id: pedido.id,
            admin_id,
            acao: 'observacoes_internas',
            de_status: null,
            para_status: null,
            observacao: String(observacoes_internas || ''),
          });
        }
      } catch (e) {
        console.warn('Falha ao registrar histórico do pedido:', e.message);
      }

      const pedidoAtualizado = await Pedido.buscarPorId(id);
      enviarSucesso(res, pedidoAtualizado, 'Pedido atualizado com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar pedido:', erro);
      enviarErro(res, 'Erro ao atualizar pedido', 500, erro.message);
    }
  }

  static async historico(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Pedido.buscarPorId(id);
      if (!pedido) {
        return enviarErro(res, 'Pedido não encontrado', 404);
      }

      const historico = await PedidoHistorico.listarPorPedido(pedido.id);
      enviarSucesso(res, historico, 'Histórico recuperado');
    } catch (erro) {
      console.error('Erro ao recuperar histórico:', erro);
      enviarErro(res, 'Erro ao recuperar histórico', 500, erro.message);
    }
  }

  static async meusPedidos(req, res) {
    try {
      const usuario_id = req.usuario.id;
      const { pagina = 1, limite = 10 } = req.query;

      const pedidos = await Pedido.buscarPorUsuario(usuario_id, parseInt(pagina), parseInt(limite));
      
      // Adicionar itens a cada pedido
      const pedidosComItens = await Promise.all(
        pedidos.map(async (pedido) => {
          const itens = await ItensPedido.listarPorPedido(pedido.id);
          return { ...pedido, itens };
        })
      );

      enviarSucesso(res, pedidosComItens, 'Pedidos recuperados');
    } catch (erro) {
      console.error('Erro ao listar pedidos do usuário:', erro);
      enviarErro(res, 'Erro ao listar pedidos', 500, erro.message);
    }
  }
}

module.exports = PedidoController;
