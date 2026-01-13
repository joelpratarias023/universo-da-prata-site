const supabase = require('../config/database');

class AdminPagamentoController {
    /**
     * Listar pagamentos pendentes de fornecedores
     */
    static async listarPagamentosFornecedores(req, res) {
        try {
            const { status, fornecedor_id } = req.query;

            let query = supabase
                .from('pagamentos_fornecedores')
                .select(`
                    *,
                    fornecedores (nome, email, telefone)
                `)
                .order('data_criacao', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            if (fornecedor_id) {
                query = query.eq('fornecedor_id', fornecedor_id);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Calcular totais
            const totalPendente = data
                .filter(p => p.status === 'pendente')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            const totalPago = data
                .filter(p => p.status === 'pago')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            res.json({
                sucesso: true,
                pagamentos: data,
                totais: {
                    pendente: totalPendente.toFixed(2),
                    pago: totalPago.toFixed(2)
                }
            });

        } catch (erro) {
            console.error('Erro ao listar pagamentos:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar pagamentos'
            });
        }
    }

    /**
     * Listar pagamentos pendentes de entregadores
     */
    static async listarPagamentosEntregadores(req, res) {
        try {
            const { status, entregador_id } = req.query;

            let query = supabase
                .from('pagamentos_entregadores')
                .select(`
                    *,
                    entregadores (nome, email, telefone, dados_bancarios)
                `)
                .order('data_criacao', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            if (entregador_id) {
                query = query.eq('entregador_id', entregador_id);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Calcular totais
            const totalPendente = data
                .filter(p => p.status === 'pendente')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            const totalPago = data
                .filter(p => p.status === 'pago')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            res.json({
                sucesso: true,
                pagamentos: data,
                totais: {
                    pendente: totalPendente.toFixed(2),
                    pago: totalPago.toFixed(2)
                }
            });

        } catch (erro) {
            console.error('Erro ao listar pagamentos:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar pagamentos'
            });
        }
    }

    /**
     * PROCESSAR pagamento de fornecedor
     */
    static async processarPagamentoFornecedor(req, res) {
        try {
            const { id } = req.params;
            const { metodo_pagamento, comprovante_url } = req.body;

            if (!metodo_pagamento) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Método de pagamento é obrigatório'
                });
            }

            // Buscar pagamento
            const { data: pagamento, error: erroPagamento } = await supabase
                .from('pagamentos_fornecedores')
                .select('*')
                .eq('id', id)
                .single();

            if (erroPagamento || !pagamento) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Pagamento não encontrado'
                });
            }

            if (pagamento.status === 'pago') {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Pagamento já foi processado'
                });
            }

            // Processar
            const { data, error } = await supabase
                .from('pagamentos_fornecedores')
                .update({
                    status: 'pago',
                    metodo_pagamento,
                    comprovante_url,
                    data_pagamento: new Date().toISOString(),
                    processado_por: req.usuario.id
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'processar_pagamento_fornecedor',
                entidade_tipo: 'pagamento_fornecedor',
                entidade_id: id,
                dados: { 
                    fornecedor_id: pagamento.fornecedor_id,
                    valor: pagamento.valor,
                    metodo_pagamento 
                }
            }]);

            // Notificar fornecedor
            await supabase.from('notificacoes').insert([{
                usuario_id: pagamento.fornecedor_id,
                tipo: 'pagamento_processado',
                titulo: '💰 Pagamento Processado',
                mensagem: `Seu pagamento de €${pagamento.valor} foi processado via ${metodo_pagamento}.`,
                lida: false
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Pagamento processado com sucesso',
                pagamento: data
            });

        } catch (erro) {
            console.error('Erro ao processar pagamento:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao processar pagamento'
            });
        }
    }

    /**
     * PROCESSAR pagamento de entregador
     */
    static async processarPagamentoEntregador(req, res) {
        try {
            const { id } = req.params;
            const { metodo_pagamento, comprovante_url } = req.body;

            if (!metodo_pagamento) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Método de pagamento é obrigatório'
                });
            }

            const { data: pagamento, error: erroPagamento } = await supabase
                .from('pagamentos_entregadores')
                .select('*')
                .eq('id', id)
                .single();

            if (erroPagamento || !pagamento) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Pagamento não encontrado'
                });
            }

            if (pagamento.status === 'pago') {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Pagamento já foi processado'
                });
            }

            const { data, error } = await supabase
                .from('pagamentos_entregadores')
                .update({
                    status: 'pago',
                    metodo_pagamento,
                    comprovante_url,
                    data_pagamento: new Date().toISOString(),
                    processado_por: req.usuario.id
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'processar_pagamento_entregador',
                entidade_tipo: 'pagamento_entregador',
                entidade_id: id,
                dados: { 
                    entregador_id: pagamento.entregador_id,
                    valor: pagamento.valor,
                    metodo_pagamento 
                }
            }]);

            // Notificar entregador
            await supabase.from('notificacoes_entregadores').insert([{
                entregador_id: pagamento.entregador_id,
                tipo: 'pagamento',
                titulo: '💰 Pagamento Processado',
                mensagem: `Seu pagamento de €${pagamento.valor} foi processado via ${metodo_pagamento}.`,
                lida: false
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Pagamento processado com sucesso',
                pagamento: data
            });

        } catch (erro) {
            console.error('Erro ao processar pagamento:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao processar pagamento'
            });
        }
    }

    /**
     * GERAR pagamento para fornecedor (período)
     */
    static async gerarPagamentoFornecedor(req, res) {
        try {
            const { fornecedor_id, periodo_inicio, periodo_fim } = req.body;

            if (!fornecedor_id || !periodo_inicio || !periodo_fim) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Fornecedor e período são obrigatórios'
                });
            }

            // Buscar vendas do período
            const { data: vendas, error: erroVendas } = await supabase
                .from('itens_pedido')
                .select(`
                    *,
                    produtos!inner(fornecedor_id, preco),
                    pedidos!inner(data_pedido, status)
                `)
                .eq('produtos.fornecedor_id', fornecedor_id)
                .eq('pedidos.status', 'concluido')
                .gte('pedidos.data_pedido', periodo_inicio)
                .lte('pedidos.data_pedido', periodo_fim);

            if (erroVendas) throw erroVendas;

            if (!vendas || vendas.length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Nenhuma venda encontrada no período'
                });
            }

            // Calcular valor total
            const valorTotal = vendas.reduce((sum, item) => {
                return sum + (parseFloat(item.preco) * item.quantidade);
            }, 0);

            // Buscar taxa de comissão do fornecedor
            const { data: fornecedor } = await supabase
                .from('fornecedores')
                .select('taxa_comissao')
                .eq('id', fornecedor_id)
                .single();

            const taxaComissao = fornecedor.taxa_comissao || 10;
            const valorComissao = valorTotal * (taxaComissao / 100);
            const valorLiquido = valorTotal - valorComissao;

            // Criar pagamento
            const { data, error } = await supabase
                .from('pagamentos_fornecedores')
                .insert([{
                    fornecedor_id,
                    valor: valorLiquido,
                    valor_bruto: valorTotal,
                    valor_comissao: valorComissao,
                    taxa_comissao: taxaComissao,
                    periodo_inicio,
                    periodo_fim,
                    quantidade_vendas: vendas.length,
                    status: 'pendente',
                    gerado_por: req.usuario.id
                }])
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'gerar_pagamento_fornecedor',
                entidade_tipo: 'pagamento_fornecedor',
                entidade_id: data.id,
                dados: { fornecedor_id, valor: valorLiquido, vendas: vendas.length }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Pagamento gerado com sucesso',
                pagamento: data
            });

        } catch (erro) {
            console.error('Erro ao gerar pagamento:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao gerar pagamento'
            });
        }
    }

    /**
     * GERAR pagamento para entregador (período)
     */
    static async gerarPagamentoEntregador(req, res) {
        try {
            const { entregador_id, periodo_inicio, periodo_fim } = req.body;

            if (!entregador_id || !periodo_inicio || !periodo_fim) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Entregador e período são obrigatórios'
                });
            }

            // Buscar entregas aprovadas do período
            const { data: entregas, error } = await supabase
                .from('entregas')
                .select('comissao')
                .eq('entregador_id', entregador_id)
                .eq('status', 'entregue')
                .eq('aprovado_por_admin', true)
                .gte('data_entrega', periodo_inicio)
                .lte('data_entrega', periodo_fim);

            if (error) throw error;

            if (!entregas || entregas.length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Nenhuma entrega aprovada no período'
                });
            }

            const valorTotal = entregas.reduce((sum, e) => sum + parseFloat(e.comissao), 0);

            // Criar pagamento
            const { data, error: erroPagamento } = await supabase
                .from('pagamentos_entregadores')
                .insert([{
                    entregador_id,
                    valor: valorTotal,
                    periodo_inicio,
                    periodo_fim,
                    quantidade_entregas: entregas.length,
                    status: 'pendente',
                    gerado_por: req.usuario.id
                }])
                .select()
                .single();

            if (erroPagamento) throw erroPagamento;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'gerar_pagamento_entregador',
                entidade_tipo: 'pagamento_entregador',
                entidade_id: data.id,
                dados: { entregador_id, valor: valorTotal, entregas: entregas.length }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Pagamento gerado com sucesso',
                pagamento: data
            });

        } catch (erro) {
            console.error('Erro ao gerar pagamento:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao gerar pagamento'
            });
        }
    }

    /**
     * Relatório financeiro geral
     */
    static async obterRelatorioFinanceiro(req, res) {
        try {
            const { data_inicio, data_fim } = req.query;

            // Vendas totais
            const { data: pedidos } = await supabase
                .from('pedidos')
                .select('total, data_pedido')
                .eq('status', 'concluido')
                .gte('data_pedido', data_inicio || '2020-01-01')
                .lte('data_pedido', data_fim || new Date().toISOString());

            const totalVendas = pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0);

            // Pagamentos fornecedores
            const { data: pagamentosFornecedores } = await supabase
                .from('pagamentos_fornecedores')
                .select('valor, status');

            const totalPagoFornecedores = pagamentosFornecedores
                .filter(p => p.status === 'pago')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            const totalPendenteFornecedores = pagamentosFornecedores
                .filter(p => p.status === 'pendente')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            // Pagamentos entregadores
            const { data: pagamentosEntregadores } = await supabase
                .from('pagamentos_entregadores')
                .select('valor, status');

            const totalPagoEntregadores = pagamentosEntregadores
                .filter(p => p.status === 'pago')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            const totalPendenteEntregadores = pagamentosEntregadores
                .filter(p => p.status === 'pendente')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            // Calcular lucro da plataforma
            const totalPago = totalPagoFornecedores + totalPagoEntregadores;
            const totalPendente = totalPendenteFornecedores + totalPendenteEntregadores;
            const lucroPlataforma = totalVendas - totalPago - totalPendente;

            res.json({
                sucesso: true,
                relatorio: {
                    vendas: {
                        total: totalVendas.toFixed(2),
                        quantidade: pedidos.length
                    },
                    fornecedores: {
                        pago: totalPagoFornecedores.toFixed(2),
                        pendente: totalPendenteFornecedores.toFixed(2),
                        total: (totalPagoFornecedores + totalPendenteFornecedores).toFixed(2)
                    },
                    entregadores: {
                        pago: totalPagoEntregadores.toFixed(2),
                        pendente: totalPendenteEntregadores.toFixed(2),
                        total: (totalPagoEntregadores + totalPendenteEntregadores).toFixed(2)
                    },
                    plataforma: {
                        lucro: lucroPlataforma.toFixed(2),
                        percentual: ((lucroPlataforma / totalVendas) * 100).toFixed(2)
                    }
                }
            });

        } catch (erro) {
            console.error('Erro ao gerar relatório:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao gerar relatório'
            });
        }
    }
}

module.exports = AdminPagamentoController;
