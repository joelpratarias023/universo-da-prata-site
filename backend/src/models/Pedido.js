const supabase = require('../config/database');

class Pedido {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const {
      uuid,
      usuario_id,
      numero_pedido,
      valor_total,
      taxa_entrega,
      desconto,
      endereco_entrega,
      observacoes,
    } = dados;

    const { data, error } = await supabase
      .from('pedidos')
      .insert([
        {
          uuid,
          usuario_id,
          numero_pedido,
          valor_total,
          taxa_entrega: taxa_entrega || 0,
          desconto: desconto || 0,
          endereco_entrega,
          observacoes: observacoes || '',
          status: 'pendente'
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        usuarios!usuario_id(nome, email),
        usuarios_entregador:usuarios!entregador_id(nome, telefone),
        enderecos!endereco_entrega(endereco, numero, complemento, cidade, estado, cep)
      `)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      data.cliente_nome = data.usuarios?.nome;
      data.cliente_email = data.usuarios?.email;
      data.entregador_nome = data.usuarios_entregador?.nome;
      data.entregador_telefone = data.usuarios_entregador?.telefone;
      if (data.enderecos) {
        data.endereco = data.enderecos.endereco;
        data.numero = data.enderecos.numero;
        data.complemento = data.enderecos.complemento;
        data.cidade = data.enderecos.cidade;
        data.estado = data.enderecos.estado;
        data.cep = data.enderecos.cep;
      }
    }
    return data || null;
  }

  static async buscarPorNumero(numero) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('numero_pedido', numero)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('pedidos')
      .update(dados)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async listar(filtros = {}, pagina = 1, limite = 20) {
    let query = supabase
      .from('pedidos')
      .select(`
        *,
        usuarios!usuario_id(nome, email),
        usuarios_entregador:usuarios!entregador_id(nome)
      `);

    if (filtros.usuario_id) {
      query = query.eq('usuario_id', filtros.usuario_id);
    }

    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }

    if (filtros.entregador_id) {
      query = query.eq('entregador_id', filtros.entregador_id);
    }

    if (filtros.busca) {
      query = query.or(`numero_pedido.ilike.%${filtros.busca}%,usuarios.nome.ilike.%${filtros.busca}%,usuarios.email.ilike.%${filtros.busca}%`);
    }

    const offset = (pagina - 1) * limite;
    query = query.order('data_pedido', { ascending: false })
      .range(offset, offset + limite - 1);

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      cliente_nome: item.usuarios?.nome,
      cliente_email: item.usuarios?.email,
      entregador_nome: item.usuarios_entregador?.nome
    }));
  }

  static async buscarPorUsuario(usuario_id, pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;
    
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        usuarios!usuario_id(nome),
        usuarios_entregador:usuarios!entregador_id(nome)
      `)
      .eq('usuario_id', usuario_id)
      .order('data_pedido', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      cliente_nome: item.usuarios?.nome,
      entregador_nome: item.usuarios_entregador?.nome
    }));
  }

  static async contarPorStatus(status) {
    const { data, error, count } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (error) throw error;
    return count || 0;
  }

  static async obterTotal() {
    const { data, error, count } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }
}

module.exports = Pedido;

module.exports = Pedido;
