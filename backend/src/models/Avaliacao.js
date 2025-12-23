const supabase = require('../config/database');

class Avaliacao {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, produto_id, usuario_id, estrelas, comentario } = dados;

    const { data, error } = await supabase
      .from('avaliacoes')
      .insert([
        {
          uuid,
          produto_id,
          usuario_id,
          estrelas,
          comentario: comentario || ''
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*, usuarios(nome)')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      data.usuario_nome = data.usuarios?.nome;
    }
    return data || null;
  }

  static async listarPorProduto(produto_id, pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;
    
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*, usuarios(nome)')
      .eq('produto_id', produto_id)
      .order('data_criacao', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      usuario_nome: item.usuarios?.nome
    }));
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('avaliacoes')
      .update(dados)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('avaliacoes')
      .delete()
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async calcularMedia(produto_id) {
    const { data: avaliacoes, error } = await supabase
      .from('avaliacoes')
      .select('estrelas')
      .eq('produto_id', produto_id);

    if (error) throw error;

    if (avaliacoes && avaliacoes.length > 0) {
      const media = avaliacoes.reduce((sum, av) => sum + av.estrelas, 0) / avaliacoes.length;
      
      const { error: updateError } = await supabase
        .from('produtos')
        .update({
          avaliacao_media: parseFloat(media.toFixed(2)),
          numero_avaliacoes: avaliacoes.length
        })
        .eq('id', produto_id);

      if (updateError) throw updateError;

      return { media: parseFloat(media.toFixed(2)), total: avaliacoes.length };
    }

    return { media: 0, total: 0 };
  }
}

module.exports = Avaliacao;
