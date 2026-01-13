const supabase = require('../config/database');

class Fornecedor {
  static async criarTabela() {
    // No Supabase, as tabelas são criadas via dashboard ou SQL editor
    console.log('✅ Tabelas gerenciadas pelo Supabase');
  }

  static async criar(dados) {
    const { uuid, nome, email, cnpj, telefone, senhaHash, endereco, taxa_comissao = 0 } = dados;
    
    const { data, error } = await supabase
      .from('fornecedores')
      .insert([
        {
          uuid,
          nome,
          email,
          cnpj: cnpj || null,
          telefone: telefone || null,
          senha: senhaHash,
          endereco: endereco || null,
          taxa_comissao: taxa_comissao,
          status: 'ativo'
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || { insertId: data?.[0]?.id };
  }

  static async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('email', email)
      .neq('status', 'bloqueado')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .or(`id.eq.${id},uuid.eq.${id}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  static async atualizar(id, dados) {
    const camposAtualizaveis = {
      nome: dados.nome,
      telefone: dados.telefone,
      endereco: dados.endereco,
      taxa_comissao: dados.taxa_comissao
    };

    // Remove campos undefined
    Object.keys(camposAtualizaveis).forEach(key => 
      camposAtualizaveis[key] === undefined && delete camposAtualizaveis[key]
    );

    const { data, error } = await supabase
      .from('fornecedores')
      .update(camposAtualizaveis)
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  }

  static async atualizarSenha(id, senhaHash) {
    const { data, error } = await supabase
      .from('fornecedores')
      .update({ senha: senhaHash })
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  }

  static async listarTodos() {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('id, uuid, nome, email, cnpj, telefone, endereco, taxa_comissao, status, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async alterarStatus(id, status) {
    const { data, error } = await supabase
      .from('fornecedores')
      .update({ status })
      .or(`id.eq.${id},uuid.eq.${id}`)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  }

  // Estatísticas do fornecedor
  static async obterEstatisticas(fornecedorId) {
    // Total de produtos
    const { count: totalProdutos, error: errorProdutos } = await supabase
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .eq('fornecedor_id', fornecedorId);

    if (errorProdutos) throw errorProdutos;

    // Produtos em estoque
    const { count: produtosEstoque, error: errorEstoque } = await supabase
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .eq('fornecedor_id', fornecedorId)
      .gt('estoque', 0);

    if (errorEstoque) throw errorEstoque;

    // Produtos vendidos (somando os itens dos pedidos)
    const { data: vendasData, error: errorVendas } = await supabase
      .from('itens_pedido')
      .select(`
        quantidade,
        produtos!inner(fornecedor_id),
        pedidos!inner(status)
      `)
      .eq('produtos.fornecedor_id', fornecedorId)
      .in('pedidos.status', ['entregue', 'concluido']);

    if (errorVendas) throw errorVendas;

    const pecasVendidas = vendasData?.reduce((sum, item) => sum + item.quantidade, 0) || 0;

    return {
      totalProdutos: totalProdutos || 0,
      produtosEstoque: produtosEstoque || 0,
      pecasVendidas
    };
  }

  // Dados financeiros do fornecedor
  static async obterDadosFinanceiros(fornecedorId) {
    const { data: vendasData, error } = await supabase
      .from('itens_pedido')
      .select(`
        quantidade,
        preco_unitario,
        produtos!inner(fornecedor_id),
        pedidos!inner(status, created_at)
      `)
      .eq('produtos.fornecedor_id', fornecedorId);

    if (error) throw error;

    const vendas = vendasData || [];
    const totalFaturado = vendas.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);
    
    // Obter taxa de comissão do fornecedor
    const fornecedor = await this.buscarPorId(fornecedorId);
    const taxaComissao = fornecedor?.taxa_comissao || 0;
    
    const comissaoPlataforma = totalFaturado * (taxaComissao / 100);
    const valorLiquido = totalFaturado - comissaoPlataforma;

    // Filtrar vendas pagas/pendentes (exemplo simples)
    const vendasPagas = vendas.filter(v => ['entregue', 'concluido'].includes(v.pedidos.status));
    const valorBrutoPago = vendasPagas.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);
    const valorPago = valorBrutoPago - (valorBrutoPago * (taxaComissao / 100));

    return {
      totalFaturado,
      comissaoPlataforma,
      valorLiquido,
      valorPago: valorPago || 0,
      valorPendente: valorLiquido - (valorPago || 0)
    };
  }
}

module.exports = Fornecedor;
