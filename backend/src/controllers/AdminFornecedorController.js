const Fornecedor = require('../models/Fornecedor');
const Produto = require('../models/Produto');
const supabase = require('../config/database');

class AdminFornecedorController {
    /**
     * Listar todos os fornecedores
     */
    static async listarTodos(req, res) {
        try {
            const { status, ordenar } = req.query;

            let query = supabase
                .from('fornecedores')
                .select('*');

            if (status) {
                query = query.eq('status', status);
            }

            if (ordenar === 'vendas') {
                query = query.order('total_vendas', { ascending: false });
            } else {
                query = query.order('data_criacao', { ascending: false });
            }

            const { data, error } = await query;

            if (error) throw error;

            res.json({
                sucesso: true,
                fornecedores: data
            });

        } catch (erro) {
            console.error('Erro ao listar fornecedores:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar fornecedores'
            });
        }
    }

    /**
     * Ver detalhes de um fornecedor
     */
    static async verDetalhes(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await Fornecedor.buscarPorId(id);

            if (!fornecedor) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Fornecedor não encontrado'
                });
            }

            // Buscar estatísticas
            const estatisticas = await Fornecedor.obterEstatisticas(id);

            res.json({
                sucesso: true,
                fornecedor,
                estatisticas
            });

        } catch (erro) {
            console.error('Erro ao buscar fornecedor:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar fornecedor'
            });
        }
    }

    /**
     * Ver produtos de um fornecedor
     */
    static async verProdutos(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.query;

            let query = supabase
                .from('produtos')
                .select('*')
                .eq('fornecedor_id', id);

            if (status) {
                query = query.eq('status', status);
            }

            query = query.order('data_criacao', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;

            res.json({
                sucesso: true,
                produtos: data
            });

        } catch (erro) {
            console.error('Erro ao listar produtos:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar produtos'
            });
        }
    }

    /**
     * Ver vendas de um fornecedor
     */
    static async verVendas(req, res) {
        try {
            const { id } = req.params;
            const { data_inicio, data_fim } = req.query;

            const vendas = await Fornecedor.listarVendas(id, data_inicio, data_fim);

            res.json({
                sucesso: true,
                vendas
            });

        } catch (erro) {
            console.error('Erro ao listar vendas:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar vendas'
            });
        }
    }

    /**
     * Definir comissão do fornecedor
     */
    static async definirComissao(req, res) {
        try {
            const { id } = req.params;
            const { taxa_comissao } = req.body;

            if (taxa_comissao < 0 || taxa_comissao > 100) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Taxa de comissão deve estar entre 0 e 100'
                });
            }

            const { data, error } = await supabase
                .from('fornecedores')
                .update({ 
                    taxa_comissao,
                    ultima_atualizacao: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                sucesso: true,
                mensagem: 'Comissão atualizada com sucesso',
                fornecedor: data
            });

        } catch (erro) {
            console.error('Erro ao definir comissão:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao definir comissão'
            });
        }
    }

    /**
     * Atualizar status do fornecedor
     */
    static async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, motivo } = req.body;

            const statusPermitidos = ['ativo', 'suspenso', 'bloqueado'];

            if (!statusPermitidos.includes(status)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Status inválido'
                });
            }

            const { data, error } = await supabase
                .from('fornecedores')
                .update({ 
                    status,
                    motivo_suspensao: status !== 'ativo' ? motivo : null,
                    ultima_atualizacao: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'atualizar_status_fornecedor',
                entidade_tipo: 'fornecedor',
                entidade_id: id,
                dados: { status_novo: status, motivo }
            }]);

            res.json({
                sucesso: true,
                mensagem: `Fornecedor ${status === 'ativo' ? 'ativado' : status === 'suspenso' ? 'suspenso' : 'bloqueado'} com sucesso`,
                fornecedor: data
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
     * Obter relatório do fornecedor
     */
    static async obterRelatorio(req, res) {
        try {
            const { id } = req.params;
            const { ano, mes } = req.query;

            const fornecedor = await Fornecedor.buscarPorId(id);
            
            if (!fornecedor) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Fornecedor não encontrado'
                });
            }

            // Estatísticas gerais
            const estatisticas = await Fornecedor.obterEstatisticas(id);

            // Produtos mais vendidos
            const { data: produtosTop, error: erroProdutos } = await supabase
                .from('itens_pedido')
                .select(`
                    produto_id,
                    produtos (nome, preco),
                    quantidade
                `)
                .eq('produtos.fornecedor_id', id)
                .order('quantidade', { ascending: false })
                .limit(10);

            if (erroProdutos) throw erroProdutos;

            // Vendas por período
            const financeiro = await Fornecedor.obterDadosFinanceiros(id, ano, mes);

            res.json({
                sucesso: true,
                relatorio: {
                    fornecedor: {
                        nome: fornecedor.nome,
                        email: fornecedor.email,
                        status: fornecedor.status,
                        taxa_comissao: fornecedor.taxa_comissao
                    },
                    estatisticas,
                    produtos_top: produtosTop,
                    financeiro
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
     * Criar novo fornecedor (pelo admin)
     */
    static async criar(req, res) {
        try {
            const { nome, email, cnpj, telefone, endereco, taxa_comissao, senha } = req.body;

            // Validações
            if (!nome || !email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, email e senha são obrigatórios'
                });
            }

            // Verificar se já existe
            const existente = await Fornecedor.buscarPorEmail(email);
            if (existente) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe um fornecedor com este email'
                });
            }

            // Criar fornecedor
            const bcrypt = require('bcryptjs');
            const senha_hash = await bcrypt.hash(senha, 10);

            const fornecedor = await Fornecedor.criar({
                nome,
                email,
                cnpj,
                telefone,
                endereco,
                senhaHash: senha_hash,
                taxa_comissao: taxa_comissao || 10,
                status: 'ativo'
            });

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'criar_fornecedor',
                entidade_tipo: 'fornecedor',
                entidade_id: fornecedor.id,
                dados: { nome, email }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Fornecedor criado com sucesso',
                fornecedor
            });

        } catch (erro) {
            console.error('Erro ao criar fornecedor:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar fornecedor'
            });
        }
    }
}

module.exports = AdminFornecedorController;
