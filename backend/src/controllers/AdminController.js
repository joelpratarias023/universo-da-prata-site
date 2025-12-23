const path = require('path');
const fs = require('fs');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const supabase = require('../config/database');
const ConfiguracaoLoja = require('../models/ConfiguracaoLoja');

class AdminController {
  static async dashboard(req, res) {
    try {
      const limitePedidos = 1000;

      const { data: pedidos, error: erroPedidos } = await supabase
        .from('pedidos')
        .select('id, numero_pedido, status, valor_total, data_pedido, usuario_id, usuarios!usuario_id(nome, email)')
        .order('data_pedido', { ascending: false })
        .limit(limitePedidos);

      if (erroPedidos) throw erroPedidos;

      const { count: produtosAtivos, error: erroProdutos } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      if (erroProdutos) throw erroProdutos;

      const totalPedidos = (pedidos || []).length;
      const totalVendas = (pedidos || []).filter(p => p.status === 'entregue').length;
      const faturacaoTotal = (pedidos || [])
        .filter(p => p.status !== 'cancelado')
        .reduce((acc, p) => acc + (Number(p.valor_total) || 0), 0);

      const pendentes = (pedidos || []).filter(p => p.status === 'pendente').length;
      const entregues = (pedidos || []).filter(p => p.status === 'entregue').length;

      const ultimosPedidos = (pedidos || []).slice(0, 5).map(p => ({
        id: p.id,
        numero_pedido: p.numero_pedido,
        status: p.status,
        valor_total: p.valor_total,
        data_pedido: p.data_pedido,
        cliente_nome: p.usuarios?.nome,
        cliente_email: p.usuarios?.email,
      }));

      enviarSucesso(res, {
        total_vendas: totalVendas,
        total_pedidos: totalPedidos,
        faturacao_total: faturacaoTotal,
        produtos_ativos: produtosAtivos || 0,
        ultimos_pedidos: ultimosPedidos,
        status_rapido: {
          pendentes,
          entregues,
        }
      }, 'Dashboard carregado');
    } catch (erro) {
      console.error('Erro ao carregar dashboard:', erro);
      enviarErro(res, 'Erro ao carregar dashboard', 500, erro.message);
    }
  }

  static async obterConfig(req, res) {
    try {
      const config = await ConfiguracaoLoja.obter();
      enviarSucesso(res, config, 'Configurações recuperadas');
    } catch (erro) {
      console.error('Erro ao recuperar configurações:', erro);
      enviarErro(res, 'Erro ao recuperar configurações', 500, erro.message);
    }
  }

  static async salvarConfig(req, res) {
    try {
      const {
        nome,
        contacto,
        whatsapp,
        taxa_entrega,
        texto_home,
        texto_sobre,
      } = req.body;

      const config = await ConfiguracaoLoja.salvar({
        nome,
        contacto,
        whatsapp,
        taxa_entrega: taxa_entrega !== undefined ? Number(taxa_entrega) : 0,
        texto_home,
        texto_sobre,
      });

      enviarSucesso(res, config, 'Configurações salvas');
    } catch (erro) {
      console.error('Erro ao salvar configurações:', erro);
      enviarErro(res, 'Erro ao salvar configurações', 500, erro.message);
    }
  }

  static async uploadImagem(req, res) {
    try {
      if (!req.file) {
        return enviarErro(res, 'Nenhum arquivo enviado', 400);
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const publicUrl = `${baseUrl}/uploads/${encodeURIComponent(req.file.filename)}`;

      enviarSucesso(res, {
        filename: req.file.filename,
        url: publicUrl,
      }, 'Upload realizado com sucesso', 201);
    } catch (erro) {
      console.error('Erro no upload:', erro);
      enviarErro(res, 'Erro no upload', 500, erro.message);
    }
  }
}

module.exports = AdminController;
