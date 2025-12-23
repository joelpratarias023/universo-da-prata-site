const supabase = require('../config/database');

class Categoria {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, nome, descricao, imagem_url, ordem, ativa } = dados;

    const { data, error } = await supabase
      .from('categorias')
      .insert([
        {
          uuid,
          nome,
          descricao,
          imagem_url,
          ordem: ordem || 0,
          ativa: ativa === undefined ? true : !!ativa
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .eq('ativa', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async buscarPorIdAdmin(id) {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('categorias')
      .update(dados)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('categorias')
      .update({ ativa: false })
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async listar() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('ativa', true)
      .order('ordem', { ascending: true })
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async listarAdmin() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('ordem', { ascending: true })
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

module.exports = Categoria;
