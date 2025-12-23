const supabase = require('../config/database');

class PedidoHistorico {
  static async criar(dados) {
    const {
      uuid,
      pedido_id,
      admin_id,
      acao,
      de_status,
      para_status,
      observacao,
    } = dados;

    const { data, error } = await supabase
      .from('pedido_historico')
      .insert([
        {
          uuid,
          pedido_id,
          admin_id,
          acao,
          de_status: de_status || null,
          para_status: para_status || null,
          observacao: observacao || null,
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  }

  static async listarPorPedido(pedido_id, limite = 50) {
    const { data, error } = await supabase
      .from('pedido_historico')
      .select('*, usuarios!admin_id(nome, email)')
      .eq('pedido_id', pedido_id)
      .order('data_criacao', { ascending: false })
      .limit(limite);

    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      admin_nome: item.usuarios?.nome,
      admin_email: item.usuarios?.email,
    }));
  }
}

module.exports = PedidoHistorico;
