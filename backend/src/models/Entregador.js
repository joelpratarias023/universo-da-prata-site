const supabase = require('../config/database');

class Entregador {
    /**
     * Buscar entregador por email
     */
    static async buscarPorEmail(email) {
        const { data, error } = await supabase
            .from('entregadores')
            .select('*')
            .eq('email', email)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Buscar entregador por ID
     */
    static async buscarPorId(id) {
        const { data, error } = await supabase
            .from('entregadores')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Criar novo entregador
     */
    static async criar(dados) {
        const { data, error } = await supabase
            .from('entregadores')
            .insert([dados])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Atualizar entregador
     */
    static async atualizar(id, dados) {
        const { data, error } = await supabase
            .from('entregadores')
            .update(dados)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Obter estatísticas do dashboard
     */
    static async obterEstatisticas(entregadorId) {
        // Total de entregas
        const { data: entregas, error: errEntregas } = await supabase
            .from('entregas')
            .select('id, status, comissao, data_entrega')
            .eq('entregador_id', entregadorId);

        if (errEntregas) throw errEntregas;

        const totalEntregas = entregas.length;
        const entregasConcluidas = entregas.filter(e => e.status === 'entregue').length;
        const entregasPendentes = entregas.filter(e => ['pendente', 'em_rota'].includes(e.status)).length;

        // Calcular ganhos do mês atual
        const mesAtual = new Date();
        const inicioMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
        
        const ganhosDoMes = entregas
            .filter(e => e.status === 'entregue' && new Date(e.data_entrega) >= inicioMes)
            .reduce((total, e) => total + parseFloat(e.comissao || 0), 0);

        // Ganhos totais
        const ganhosTotal = entregas
            .filter(e => e.status === 'entregue')
            .reduce((total, e) => total + parseFloat(e.comissao || 0), 0);

        return {
            totalEntregas,
            entregasConcluidas,
            entregasPendentes,
            ganhosDoMes: ganhosDoMes.toFixed(2),
            ganhosTotal: ganhosTotal.toFixed(2),
            taxaConclusao: totalEntregas > 0 ? ((entregasConcluidas / totalEntregas) * 100).toFixed(1) : 0
        };
    }

    /**
     * Listar entregas do entregador
     */
    static async listarEntregas(entregadorId, status = null) {
        let query = supabase
            .from('entregas')
            .select(`
                *,
                pedidos:pedido_id (
                    cliente_nome,
                    cliente_telefone,
                    cliente_email,
                    endereco_entrega
                )
            `)
            .eq('entregador_id', entregadorId)
            .order('data_criacao', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }

    /**
     * Atualizar status da entrega
     */
    static async atualizarEntrega(entregaId, dados) {
        const { data, error } = await supabase
            .from('entregas')
            .update(dados)
            .eq('id', entregaId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Obter histórico de ganhos por mês
     */
    static async historicoGanhos(entregadorId, ano = null) {
        const anoAtual = ano || new Date().getFullYear();

        const { data, error } = await supabase
            .from('entregas')
            .select('data_entrega, comissao')
            .eq('entregador_id', entregadorId)
            .eq('status', 'entregue')
            .gte('data_entrega', `${anoAtual}-01-01`)
            .lte('data_entrega', `${anoAtual}-12-31`)
            .order('data_entrega', { ascending: true });

        if (error) throw error;

        // Agrupar por mês
        const ganhosPorMes = {};
        data.forEach(entrega => {
            const mes = new Date(entrega.data_entrega).getMonth() + 1;
            if (!ganhosPorMes[mes]) {
                ganhosPorMes[mes] = { quantidade: 0, valor: 0 };
            }
            ganhosPorMes[mes].quantidade++;
            ganhosPorMes[mes].valor += parseFloat(entrega.comissao || 0);
        });

        return ganhosPorMes;
    }

    /**
     * Obter pagamentos do entregador
     */
    static async obterPagamentos(entregadorId) {
        const { data, error } = await supabase
            .from('pagamentos_entregadores')
            .select('*')
            .eq('entregador_id', entregadorId)
            .order('data_pagamento', { ascending: false });

        if (error) throw error;
        return data;
    }
}

module.exports = Entregador;
