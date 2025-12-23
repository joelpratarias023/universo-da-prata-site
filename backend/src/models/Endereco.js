const supabase = require('../config/database');

class Endereco {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, usuario_id, endereco, numero, complemento, bairro, cidade, estado, cep, principal } = dados;

    const { data, error } = await supabase
      .from('enderecos')
      .insert([
        {
          uuid,
          usuario_id,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          cep,
          principal: principal || false
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('enderecos')
      .select('*')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('enderecos')
      .update(dados)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('enderecos')
      .delete()
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async listarPorUsuario(usuario_id) {
    const { data, error } = await supabase
      .from('enderecos')
      .select('*')
      .eq('usuario_id', usuario_id)
      .order('principal', { ascending: false })
      .order('data_criacao', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

module.exports = Endereco;
