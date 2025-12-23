const supabase = require('../config/database');

class ItensPedido {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, pedido_id, produto_id, quantidade, preco_unitario, subtotal } = dados;

    const { data, error } = await supabase
      .from('itens_pedido')
      .insert([
        {
          uuid,
          pedido_id,
          produto_id,
          quantidade,
          preco_unitario,
          subtotal
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async listarPorPedido(pedido_id) {
    const { data, error } = await supabase
      .from('itens_pedido')
      .select('*, produtos(nome, imagem_url)')
      .eq('pedido_id', pedido_id);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      produto_nome: item.produtos?.nome,
      imagem_url: item.produtos?.imagem_url
    }));
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('itens_pedido')
      .delete()
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }
}

module.exports = ItensPedido;
