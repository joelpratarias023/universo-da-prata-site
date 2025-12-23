const supabase = require('../config/database');

class Produto {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, nome, descricao, preco, categoria_id, imagem_url, estoque, preco_promocional, ativo } = dados;

    const { data, error } = await supabase
      .from('produtos')
      .insert([
        {
          uuid,
          nome,
          descricao,
          preco,
          preco_promocional: preco_promocional ?? null,
          categoria_id,
          imagem_url,
          estoque: estoque || 0,
          ativo: ativo === undefined ? true : !!ativo
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .eq('ativo', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (data && data.categorias) {
      data.categoria_nome = data.categorias.nome;
    }
    return data || null;
  }

  static async buscarPorIdAdmin(id) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (data && data.categorias) {
      data.categoria_nome = data.categorias.nome;
    }
    return data || null;
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('produtos')
      .update(dados)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('produtos')
      .update({ ativo: false })
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async listar(filtros = {}, pagina = 1, limite = 12) {
    let query = supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('ativo', true);

    if (filtros.categoria_id) {
      query = query.eq('categoria_id', filtros.categoria_id);
    }

    if (filtros.busca) {
      query = query.or(`nome.ilike.%${filtros.busca}%,descricao.ilike.%${filtros.busca}%`);
    }

    if (filtros.preco_min) {
      query = query.gte('preco', filtros.preco_min);
    }

    if (filtros.preco_max) {
      query = query.lte('preco', filtros.preco_max);
    }

    const offset = (pagina - 1) * limite;
    query = query.order('data_criacao', { ascending: false })
      .range(offset, offset + limite - 1);

    const { data, error } = await query;
    
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      categoria_nome: item.categorias?.nome
    }));
  }

  static async listarAdmin(filtros = {}, pagina = 1, limite = 50) {
    let query = supabase
      .from('produtos')
      .select('*, categorias(nome)');

    if (filtros.categoria_id) {
      query = query.eq('categoria_id', filtros.categoria_id);
    }

    if (filtros.busca) {
      query = query.or(`nome.ilike.%${filtros.busca}%,descricao.ilike.%${filtros.busca}%`);
    }

    const offset = (pagina - 1) * limite;
    query = query.order('data_criacao', { ascending: false })
      .range(offset, offset + limite - 1);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      categoria_nome: item.categorias?.nome
    }));
  }

  static async buscarPorCategoria(categoria_id, pagina = 1, limite = 12) {
    const offset = (pagina - 1) * limite;
    
    const { data, error } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('categoria_id', categoria_id)
      .eq('ativo', true)
      .order('data_criacao', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      categoria_nome: item.categorias?.nome
    }));
  }

  static async atualizarEstoque(produto_id, quantidade) {
    const { data: produto, error: erroGet } = await supabase
      .from('produtos')
      .select('estoque')
      .eq('id', produto_id)
      .single();

    if (erroGet) throw erroGet;

    const novoEstoque = (produto.estoque || 0) + quantidade;
    const { data, error } = await supabase
      .from('produtos')
      .update({ estoque: novoEstoque })
      .eq('id', produto_id)
      .select();

    if (error) throw error;
    return { affectedRows: data?.length || 0 };
  }

  static async buscarMaisVendidos(limite = 10) {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categorias(nome),
        itens_pedido(count)
      `)
      .eq('ativo', true)
      .order('avaliacao_media', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      categoria_nome: item.categorias?.nome,
      total_vendido: item.itens_pedido?.length || 0
    }));
  }
}

module.exports = Produto;
