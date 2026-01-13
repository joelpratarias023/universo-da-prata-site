const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Fornecedor = require('../models/Fornecedor');
const { gerarToken } = require('../config/jwt');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const validacoes = require('../utils/validacoes');
const supabase = require('../config/database');

class FornecedorController {
  // Login de fornecedor
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return enviarErro(res, 'Email e senha são obrigatórios', 400);
      }

      const fornecedor = await Fornecedor.buscarPorEmail(email.toLowerCase());

      if (!fornecedor) {
        return enviarErro(res, 'Email ou senha incorretos', 401);
      }

      const senhaValida = await bcrypt.compare(senha, fornecedor.senha);

      if (!senhaValida) {
        return enviarErro(res, 'Email ou senha incorretos', 401);
      }

      if (fornecedor.status !== 'ativo') {
        return enviarErro(res, 'Conta inativa ou bloqueada. Entre em contato com o suporte.', 403);
      }

      const token = gerarToken({ 
        id: fornecedor.id, 
        uuid: fornecedor.uuid,
        email: fornecedor.email, 
        tipo: 'fornecedor' 
      });

      // Remove a senha antes de enviar
      delete fornecedor.senha;

      return enviarSucesso(res, { 
        mensagem: 'Login realizado com sucesso',
        fornecedor,
        token 
      });
    } catch (error) {
      console.error('Erro no login do fornecedor:', error);
      return enviarErro(res, 'Erro ao fazer login', 500);
    }
  }

  // Obter dashboard do fornecedor
  static async obterDashboard(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;

      const estatisticas = await Fornecedor.obterEstatisticas(fornecedorId);
      const financeiro = await Fornecedor.obterDadosFinanceiros(fornecedorId);

      return enviarSucesso(res, {
        estatisticas,
        financeiro
      });
    } catch (error) {
      console.error('Erro ao obter dashboard:', error);
      return enviarErro(res, 'Erro ao obter dados do dashboard', 500);
    }
  }

  // Listar produtos do fornecedor
  static async listarProdutos(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;

      const { data: produtos, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias(nome)
        `)
        .eq('fornecedor_id', fornecedorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar histórico de vendas de cada produto
      const produtosComHistorico = await Promise.all(produtos.map(async (produto) => {
        const { data: vendas, error: errorVendas } = await supabase
          .from('itens_pedido')
          .select(`
            quantidade,
            preco_unitario,
            pedidos!inner(created_at, status)
          `)
          .eq('produto_id', produto.id)
          .in('pedidos.status', ['entregue', 'concluido']);

        if (errorVendas) throw errorVendas;

        const totalVendido = vendas?.reduce((sum, v) => sum + v.quantidade, 0) || 0;

        return {
          ...produto,
          categoria_nome: produto.categorias?.nome,
          total_vendido: totalVendido,
          historico_vendas: vendas || []
        };
      }));

      return enviarSucesso(res, { produtos: produtosComHistorico });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return enviarErro(res, 'Erro ao listar produtos', 500);
    }
  }

  // Obter detalhes de um produto específico
  static async obterProduto(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;
      const { id } = req.params;

      const { data: produto, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias(nome)
        `)
        .or(`id.eq.${id},uuid.eq.${id}`)
        .eq('fornecedor_id', fornecedorId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!produto) {
        return enviarErro(res, 'Produto não encontrado', 404);
      }

      // Buscar histórico de vendas
      const { data: vendas, error: errorVendas } = await supabase
        .from('itens_pedido')
        .select(`
          quantidade,
          preco_unitario,
          pedidos!inner(id, created_at, status)
        `)
        .eq('produto_id', produto.id)
        .order('pedidos(created_at)', { ascending: false });

      if (errorVendas) throw errorVendas;

      produto.categoria_nome = produto.categorias?.nome;
      produto.historico_vendas = vendas || [];

      return enviarSucesso(res, { produto });
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      return enviarErro(res, 'Erro ao obter produto', 500);
    }
  }

  // Histórico de vendas do fornecedor
  static async historicoVendas(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;

      const { data: vendas, error } = await supabase
        .from('itens_pedido')
        .select(`
          id,
          quantidade,
          preco_unitario,
          produtos!inner(id, nome, fornecedor_id),
          pedidos!inner(id, created_at, status, usuarios(nome, email))
        `)
        .eq('produtos.fornecedor_id', fornecedorId)
        .order('pedidos(created_at)', { ascending: false });

      if (error) throw error;

      const vendasFormatadas = vendas?.map(v => ({
        id: v.id,
        produto_nome: v.produtos.nome,
        produto_id: v.produtos.id,
        quantidade: v.quantidade,
        preco_unitario: v.preco_unitario,
        valor_total: v.quantidade * v.preco_unitario,
        data_venda: v.pedidos.created_at,
        status_pagamento: ['entregue', 'concluido'].includes(v.pedidos.status) ? 'pago' : 'pendente',
        status_pedido: v.pedidos.status,
        cliente_nome: v.pedidos.usuarios?.nome,
        cliente_email: v.pedidos.usuarios?.email
      })) || [];

      return enviarSucesso(res, { vendas: vendasFormatadas });
    } catch (error) {
      console.error('Erro ao obter histórico de vendas:', error);
      return enviarErro(res, 'Erro ao obter histórico de vendas', 500);
    }
  }

  // Resumo financeiro
  static async resumoFinanceiro(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;

      const financeiro = await Fornecedor.obterDadosFinanceiros(fornecedorId);

      // Buscar histórico de pagamentos (se existir tabela de pagamentos)
      // Por enquanto, retornando array vazio
      const historicoPagamentos = [];

      return enviarSucesso(res, {
        ...financeiro,
        historico_pagamentos: historicoPagamentos
      });
    } catch (error) {
      console.error('Erro ao obter resumo financeiro:', error);
      return enviarErro(res, 'Erro ao obter resumo financeiro', 500);
    }
  }

  // Perfil do fornecedor
  static async obterPerfil(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;

      const fornecedor = await Fornecedor.buscarPorId(fornecedorId);

      if (!fornecedor) {
        return enviarErro(res, 'Fornecedor não encontrado', 404);
      }

      delete fornecedor.senha;

      return enviarSucesso(res, { fornecedor });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return enviarErro(res, 'Erro ao obter perfil', 500);
    }
  }

  // Atualizar perfil
  static async atualizarPerfil(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;
      const { nome, telefone, endereco } = req.body;

      const dadosAtualizados = {};
      if (nome) dadosAtualizados.nome = validacoes.limpar(nome);
      if (telefone) dadosAtualizados.telefone = telefone;
      if (endereco) dadosAtualizados.endereco = endereco;

      if (Object.keys(dadosAtualizados).length === 0) {
        return enviarErro(res, 'Nenhum campo para atualizar', 400);
      }

      const fornecedor = await Fornecedor.atualizar(fornecedorId, dadosAtualizados);

      if (!fornecedor) {
        return enviarErro(res, 'Erro ao atualizar perfil', 500);
      }

      delete fornecedor.senha;

      return enviarSucesso(res, { 
        mensagem: 'Perfil atualizado com sucesso',
        fornecedor 
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return enviarErro(res, 'Erro ao atualizar perfil', 500);
    }
  }

  // Alterar senha
  static async alterarSenha(req, res) {
    try {
      const fornecedorId = req.fornecedor.id;
      const { senha_atual, nova_senha, confirmar_senha } = req.body;

      if (!senha_atual || !nova_senha || !confirmar_senha) {
        return enviarErro(res, 'Todos os campos são obrigatórios', 400);
      }

      if (nova_senha !== confirmar_senha) {
        return enviarErro(res, 'As senhas não correspondem', 400);
      }

      const fornecedor = await Fornecedor.buscarPorId(fornecedorId);
      const senhaValida = await bcrypt.compare(senha_atual, fornecedor.senha);

      if (!senhaValida) {
        return enviarErro(res, 'Senha atual incorreta', 401);
      }

      const novaSenhaHash = await bcrypt.hash(nova_senha, 10);
      await Fornecedor.atualizarSenha(fornecedorId, novaSenhaHash);

      return enviarSucesso(res, { mensagem: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return enviarErro(res, 'Erro ao alterar senha', 500);
    }
  }
}

module.exports = FornecedorController;
