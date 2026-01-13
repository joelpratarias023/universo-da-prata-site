const Entregador = require('../models/Entregador');
const supabase = require('../config/database');

class AdminEntregadorController {
    /**
     * Listar todos os entregadores
     */
    static async listarTodos(req, res) {
        try {
            const { status } = req.query;

            let query = supabase
                .from('entregadores')
                .select('*')
                .order('data_criacao', { ascending: false });

            if (status) {
                query = query.eq('ativo', status === 'ativo');
            }

            const { data, error } = await query;

            if (error) throw error;

            res.json({
                sucesso: true,
                entregadores: data
            });

        } catch (erro) {
            console.error('Erro ao listar entregadores:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar entregadores'
            });
        }
    }

    /**
     * Ver detalhes de um entregador
     */
    static async verDetalhes(req, res) {
        try {
            const { id } = req.params;
            const entregador = await Entregador.buscarPorId(id);

            if (!entregador) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Entregador não encontrado'
                });
            }

            const estatisticas = await Entregador.obterEstatisticas(id);

            res.json({
                sucesso: true,
                entregador,
                estatisticas
            });

        } catch (erro) {
            console.error('Erro ao buscar entregador:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar entregador'
            });
        }
    }

    /**
     * CRIAR nova entrega e ATRIBUIR ao entregador
     */
    static async criarEntrega(req, res) {
        try {
            const { 
                pedido_id, 
                entregador_id, 
                comissao,
                observacoes 
            } = req.body;

            // Validações
            if (!pedido_id || !entregador_id || !comissao) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Pedido, entregador e comissão são obrigatórios'
                });
            }

            // Verificar se pedido existe
            const { data: pedido, error: erroPedido } = await supabase
                .from('pedidos')
                .select('*')
                .eq('id', pedido_id)
                .single();

            if (erroPedido || !pedido) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Pedido não encontrado'
                });
            }

            // Verificar se entregador existe e está ativo
            const entregador = await Entregador.buscarPorId(entregador_id);
            if (!entregador || !entregador.ativo) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Entregador não encontrado ou inativo'
                });
            }

            // Criar entrega
            const { data: entrega, error } = await supabase
                .from('entregas')
                .insert([{
                    pedido_id,
                    entregador_id,
                    status: 'pendente',
                    comissao,
                    observacoes,
                    data_atribuicao: new Date().toISOString(),
                    atribuido_por: req.usuario.id
                }])
                .select()
                .single();

            if (error) throw error;

            // Enviar notificação ao entregador (preparado)
            await enviarNotificacaoEntregador(entregador_id, entrega.id, pedido);

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'criar_entrega',
                entidade_tipo: 'entrega',
                entidade_id: entrega.id,
                dados: { pedido_id, entregador_id, comissao }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Entrega criada e atribuída com sucesso',
                entrega
            });

        } catch (erro) {
            console.error('Erro ao criar entrega:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar entrega'
            });
        }
    }

    /**
     * Listar todas as entregas (admin vê TODAS)
     */
    static async listarEntregas(req, res) {
        try {
            const { status, entregador_id, data_inicio, data_fim } = req.query;

            let query = supabase
                .from('entregas')
                .select(`
                    *,
                    entregadores (nome, telefone),
                    pedidos (
                        id,
                        cliente_nome,
                        cliente_telefone,
                        endereco_entrega,
                        total
                    )
                `)
                .order('data_criacao', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            if (entregador_id) {
                query = query.eq('entregador_id', entregador_id);
            }

            if (data_inicio) {
                query = query.gte('data_criacao', data_inicio);
            }

            if (data_fim) {
                query = query.lte('data_criacao', data_fim);
            }

            const { data, error } = await query;

            if (error) throw error;

            res.json({
                sucesso: true,
                entregas: data
            });

        } catch (erro) {
            console.error('Erro ao listar entregas:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar entregas'
            });
        }
    }

    /**
     * APROVAR entrega concluída
     */
    static async aprovarEntrega(req, res) {
        try {
            const { id } = req.params;
            const { observacoes_admin } = req.body;

            // Buscar entrega
            const { data: entrega, error: erroEntrega } = await supabase
                .from('entregas')
                .select('*')
                .eq('id', id)
                .single();

            if (erroEntrega || !entrega) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Entrega não encontrada'
                });
            }

            if (entrega.status !== 'entregue') {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Apenas entregas concluídas podem ser aprovadas'
                });
            }

            // Aprovar
            const { data, error } = await supabase
                .from('entregas')
                .update({
                    aprovado_por_admin: true,
                    admin_aprovador_id: req.usuario.id,
                    data_aprovacao: new Date().toISOString(),
                    observacoes_admin
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'aprovar_entrega',
                entidade_tipo: 'entrega',
                entidade_id: id,
                dados: { entregador_id: entrega.entregador_id }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Entrega aprovada com sucesso',
                entrega: data
            });

        } catch (erro) {
            console.error('Erro ao aprovar entrega:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao aprovar entrega'
            });
        }
    }

    /**
     * REJEITAR entrega
     */
    static async rejeitarEntrega(req, res) {
        try {
            const { id } = req.params;
            const { motivo } = req.body;

            if (!motivo) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Motivo da rejeição é obrigatório'
                });
            }

            const { data, error } = await supabase
                .from('entregas')
                .update({
                    status: 'rejeitada',
                    motivo_rejeicao: motivo,
                    rejeitado_por: req.usuario.id,
                    data_rejeicao: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'rejeitar_entrega',
                entidade_tipo: 'entrega',
                entidade_id: id,
                dados: { motivo }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Entrega rejeitada',
                entrega: data
            });

        } catch (erro) {
            console.error('Erro ao rejeitar entrega:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao rejeitar entrega'
            });
        }
    }

    /**
     * Atualizar status do entregador (bloquear/ativar)
     */
    static async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { ativo, motivo } = req.body;

            const { data, error } = await supabase
                .from('entregadores')
                .update({
                    ativo,
                    motivo_bloqueio: !ativo ? motivo : null,
                    ultima_atualizacao: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: ativo ? 'ativar_entregador' : 'bloquear_entregador',
                entidade_tipo: 'entregador',
                entidade_id: id,
                dados: { motivo }
            }]);

            res.json({
                sucesso: true,
                mensagem: `Entregador ${ativo ? 'ativado' : 'bloqueado'} com sucesso`,
                entregador: data
            });

        } catch (erro) {
            console.error('Erro ao atualizar status:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar status'
            });
        }
    }

    /**
     * Obter relatório do entregador
     */
    static async obterRelatorio(req, res) {
        try {
            const { id } = req.params;
            const { ano, mes } = req.query;

            const entregador = await Entregador.buscarPorId(id);

            if (!entregador) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Entregador não encontrado'
                });
            }

            const estatisticas = await Entregador.obterEstatisticas(id);
            const historicoGanhos = await Entregador.historicoGanhos(id, ano);
            const pagamentos = await Entregador.obterPagamentos(id);

            res.json({
                sucesso: true,
                relatorio: {
                    entregador: {
                        nome: entregador.nome,
                        email: entregador.email,
                        telefone: entregador.telefone,
                        veiculo: entregador.veiculo,
                        ativo: entregador.ativo
                    },
                    estatisticas,
                    ganhos: historicoGanhos,
                    pagamentos
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

    /**
     * Criar novo entregador (pelo admin)
     */
    static async criar(req, res) {
        try {
            const { nome, email, telefone, cpf, veiculo, senha } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, email e senha são obrigatórios'
                });
            }

            // Verificar se já existe
            const existente = await Entregador.buscarPorEmail(email);
            if (existente) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe um entregador com este email'
                });
            }

            const bcrypt = require('bcryptjs');
            const senha_hash = await bcrypt.hash(senha, 10);

            const entregador = await Entregador.criar({
                nome,
                email,
                senha_hash,
                telefone,
                cpf,
                veiculo,
                ativo: true
            });

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'criar_entregador',
                entidade_tipo: 'entregador',
                entidade_id: entregador.id,
                dados: { nome, email }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Entregador criado com sucesso',
                entregador
            });

        } catch (erro) {
            console.error('Erro ao criar entregador:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar entregador'
            });
        }
    }
}

// Função auxiliar para enviar notificações
async function enviarNotificacaoEntregador(entregadorId, entregaId, pedido) {
    try {
        await supabase.from('notificacoes_entregadores').insert([{
            entregador_id: entregadorId,
            entrega_id: entregaId,
            tipo: 'nova_entrega',
            titulo: '📦 Nova Entrega Atribuída',
            mensagem: `Você recebeu uma nova entrega para ${pedido.cliente_nome}`,
            lida: false,
            enviada_sms: false,
            enviada_email: false
        }]);

        // TODO: Integrar SMS via Twilio
        // TODO: Integrar Email via SendGrid
        // TODO: Integrar Push via Firebase

    } catch (erro) {
        console.error('Erro ao enviar notificação:', erro);
    }
}

module.exports = AdminEntregadorController;
