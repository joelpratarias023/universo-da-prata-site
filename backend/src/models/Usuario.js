const supabase = require('../config/database');

class Usuario {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, nome, email, cpf, telefone, senhaHash, tipo = 'cliente' } = dados;
    
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          uuid,
          nome,
          email,
          cpf: cpf || null,
          telefone: telefone || null,
          senha: senhaHash,
          tipo,
          status: 'ativo'
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .neq('status', 'bloqueado')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(dados)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ status: 'inativo' })
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async listar(filtros = {}, pagina = 1, limite = 10) {
    let query = supabase
      .from('usuarios')
      .select('*')
      .neq('status', 'inativo');

    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }

    if (filtros.busca) {
      query = query.or(`nome.ilike.%${filtros.busca}%,email.ilike.%${filtros.busca}%`);
    }

    const offset = (pagina - 1) * limite;
    query = query.order('data_criacao', { ascending: false })
      .range(offset, offset + limite - 1);

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}

module.exports = Usuario;
