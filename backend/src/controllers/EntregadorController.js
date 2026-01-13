const Entregador = require('../models/Entregador');
const bcrypt = require('bcryptjs');
const { gerarToken } = require('../utils/jwt');

class EntregadorController {
    /**
     * Login do entregador
     */
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Email e senha são obrigatórios'
                });
            }

            // Buscar entregador
            const entregador = await Entregador.buscarPorEmail(email);

            if (!entregador) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Credenciais inválidas'
                });
            }

            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, entregador.senha_hash);

            if (!senhaValida) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Credenciais inválidas'
                });
            }

            // Verificar se está ativo
            if (!entregador.ativo) {
                return res.status(403).json({
                    sucesso: false,
                    mensagem: 'Conta desativada. Entre em contato com o administrador.'
                });
            }

            // Gerar token
            const token = gerarToken({
                id: entregador.id,
                email: entregador.email,
                tipo: 'entregador'
            });

            // Remover senha da resposta
            delete entregador.senha_hash;

            res.json({
                sucesso: true,
                token,
                entregador
            });

        } catch (erro) {
            console.error('Erro no login:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao fazer login'
            });
        }
    }

    /**
     * Obter dados do dashboard
     */
    static async obterDashboard(req, res) {
        try {
            const entregadorId = req.entregador.id;
            const estatisticas = await Entregador.obterEstatisticas(entregadorId);

            res.json({
                sucesso: true,
                dados: estatisticas
            });

        } catch (erro) {
            console.error('Erro ao obter dashboard:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao carregar dashboard'
            });
        }
    }

    /**
     * Listar entregas
     */
    static async listarEntregas(req, res) {
        try {
            const entregadorId = req.entregador.id;
            const { status } = req.query;

            const entregas = await Entregador.listarEntregas(entregadorId, status);

            res.json({
                sucesso: true,
                entregas
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
     * Confirmar entrega
     */
    static async confirmarEntrega(req, res) {
        try {
            const { id } = req.params;
            const { observacoes } = req.body;

            const dados = {
                status: 'entregue',
                data_entrega: new Date().toISOString(),
                observacoes: observacoes || null
            };

            const entrega = await Entregador.atualizarEntrega(id, dados);

            res.json({
                sucesso: true,
                mensagem: 'Entrega confirmada com sucesso',
                entrega
            });

        } catch (erro) {
            console.error('Erro ao confirmar entrega:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao confirmar entrega'
            });
        }
    }

    /**
     * Atualizar status da entrega
     */
    static async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, observacoes } = req.body;

            const statusPermitidos = ['pendente', 'em_rota', 'entregue', 'cancelada'];
            
            if (!statusPermitidos.includes(status)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Status inválido'
                });
            }

            const dados = { status };
            
            if (observacoes) {
                dados.observacoes = observacoes;
            }

            if (status === 'entregue') {
                dados.data_entrega = new Date().toISOString();
            }

            const entrega = await Entregador.atualizarEntrega(id, dados);

            res.json({
                sucesso: true,
                mensagem: 'Status atualizado com sucesso',
                entrega
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
     * Histórico de ganhos
     */
    static async historicoGanhos(req, res) {
        try {
            const entregadorId = req.entregador.id;
            const { ano } = req.query;

            const historico = await Entregador.historicoGanhos(entregadorId, ano);

            res.json({
                sucesso: true,
                historico
            });

        } catch (erro) {
            console.error('Erro ao obter histórico:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao carregar histórico de ganhos'
            });
        }
    }

    /**
     * Obter pagamentos
     */
    static async obterPagamentos(req, res) {
        try {
            const entregadorId = req.entregador.id;
            const pagamentos = await Entregador.obterPagamentos(entregadorId);

            // Calcular totais
            const totalPago = pagamentos
                .filter(p => p.status === 'pago')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            const totalPendente = pagamentos
                .filter(p => p.status === 'pendente')
                .reduce((sum, p) => sum + parseFloat(p.valor), 0);

            res.json({
                sucesso: true,
                pagamentos,
                totais: {
                    pago: totalPago.toFixed(2),
                    pendente: totalPendente.toFixed(2)
                }
            });

        } catch (erro) {
            console.error('Erro ao obter pagamentos:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao carregar pagamentos'
            });
        }
    }

    /**
     * Obter perfil
     */
    static async obterPerfil(req, res) {
        try {
            const entregadorId = req.entregador.id;
            const entregador = await Entregador.buscarPorId(entregadorId);

            // Remover senha
            delete entregador.senha_hash;

            res.json({
                sucesso: true,
                entregador
            });

        } catch (erro) {
            console.error('Erro ao obter perfil:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao carregar perfil'
            });
        }
    }

    /**
     * Atualizar perfil
     */
    static async atualizarPerfil(req, res) {
        try {
            const entregadorId = req.entregador.id;
            const { nome, telefone, veiculo, pix, banco, agencia, conta } = req.body;

            const dados = {
                nome,
                telefone,
                veiculo,
                dados_bancarios: {
                    pix,
                    banco,
                    agencia,
                    conta
                }
            };

            const entregador = await Entregador.atualizar(entregadorId, dados);
            delete entregador.senha_hash;

            res.json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso',
                entregador
            });

        } catch (erro) {
            console.error('Erro ao atualizar perfil:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar perfil'
            });
        }
    }
}

module.exports = EntregadorController;
