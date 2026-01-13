const supabase = require('../config/database');
const Produto = require('../models/Produto');

class AdminProdutoController {
    /**
     * Listar produtos pendentes de aprovação
     */
    static async listarPendentes(req, res) {
        try {
            const { data, error } = await supabase
                .from('produtos')
                .select(`
                    *,
                    fornecedores (nome, email)
                `)
                .eq('status', 'pendente')
                .order('data_criacao', { ascending: false });

            if (error) throw error;

            res.json({
                sucesso: true,
                produtos: data
            });

        } catch (erro) {
            console.error('Erro ao listar produtos pendentes:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar produtos pendentes'
            });
        }
    }

    /**
     * Listar todos os produtos (de todos os fornecedores)
     */
    static async listarTodos(req, res) {
        try {
            const { status, fornecedor_id, categoria } = req.query;

            let query = supabase
                .from('produtos')
                .select(`
                    *,
                    fornecedores (nome, email),
                    categorias (nome)
                `)
                .order('data_criacao', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            if (fornecedor_id) {
                query = query.eq('fornecedor_id', fornecedor_id);
            }

            if (categoria) {
                query = query.eq('categoria_id', categoria);
            }

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
     * APROVAR produto
     */
    static async aprovar(req, res) {
        try {
            const { id } = req.params;
            const { preco_final, comissao_plataforma } = req.body;

            // Buscar produto
            const { data: produto, error: erroProduto } = await supabase
                .from('produtos')
                .select('*')
                .eq('id', id)
                .single();

            if (erroProduto || !produto) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Produto não encontrado'
                });
            }

            // Aprovar e definir preço/comissão
            const dados = {
                status: 'ativo',
                aprovado_por: req.usuario.id,
                data_aprovacao: new Date().toISOString()
            };

            if (preco_final) {
                dados.preco = preco_final;
            }

            if (comissao_plataforma) {
                dados.comissao_plataforma = comissao_plataforma;
            }

            const { data, error } = await supabase
                .from('produtos')
                .update(dados)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'aprovar_produto',
                entidade_tipo: 'produto',
                entidade_id: id,
                dados: { 
                    fornecedor_id: produto.fornecedor_id,
                    preco_final,
                    comissao_plataforma 
                }
            }]);

            // Notificar fornecedor (preparado)
            await supabase.from('notificacoes').insert([{
                usuario_id: produto.fornecedor_id,
                tipo: 'produto_aprovado',
                titulo: '✅ Produto Aprovado',
                mensagem: `Seu produto "${produto.nome}" foi aprovado e está ativo no site.`,
                lida: false
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Produto aprovado com sucesso',
                produto: data
            });

        } catch (erro) {
            console.error('Erro ao aprovar produto:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao aprovar produto'
            });
        }
    }

    /**
     * REJEITAR produto
     */
    static async rejeitar(req, res) {
        try {
            const { id } = req.params;
            const { motivo } = req.body;

            if (!motivo) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Motivo da rejeição é obrigatório'
                });
            }

            // Buscar produto
            const { data: produto } = await supabase
                .from('produtos')
                .select('*')
                .eq('id', id)
                .single();

            const { data, error } = await supabase
                .from('produtos')
                .update({
                    status: 'rejeitado',
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
                acao: 'rejeitar_produto',
                entidade_tipo: 'produto',
                entidade_id: id,
                dados: { motivo, fornecedor_id: produto.fornecedor_id }
            }]);

            // Notificar fornecedor
            await supabase.from('notificacoes').insert([{
                usuario_id: produto.fornecedor_id,
                tipo: 'produto_rejeitado',
                titulo: '❌ Produto Rejeitado',
                mensagem: `Seu produto "${produto.nome}" foi rejeitado. Motivo: ${motivo}`,
                lida: false
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Produto rejeitado',
                produto: data
            });

        } catch (erro) {
            console.error('Erro ao rejeitar produto:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao rejeitar produto'
            });
        }
    }

    /**
     * Editar preço do produto
     */
    static async editarPreco(req, res) {
        try {
            const { id } = req.params;
            const { preco, comissao_plataforma } = req.body;

            if (!preco || preco <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Preço inválido'
                });
            }

            const dados = { preco };

            if (comissao_plataforma !== undefined) {
                dados.comissao_plataforma = comissao_plataforma;
            }

            const { data, error } = await supabase
                .from('produtos')
                .update(dados)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'editar_preco_produto',
                entidade_tipo: 'produto',
                entidade_id: id,
                dados: { preco, comissao_plataforma }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Preço atualizado com sucesso',
                produto: data
            });

        } catch (erro) {
            console.error('Erro ao editar preço:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao editar preço'
            });
        }
    }

    /**
     * Desativar produto
     */
    static async desativar(req, res) {
        try {
            const { id } = req.params;
            const { motivo } = req.body;

            const { data, error } = await supabase
                .from('produtos')
                .update({
                    status: 'inativo',
                    motivo_desativacao: motivo,
                    desativado_por: req.usuario.id,
                    data_desativacao: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'desativar_produto',
                entidade_tipo: 'produto',
                entidade_id: id,
                dados: { motivo }
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Produto desativado',
                produto: data
            });

        } catch (erro) {
            console.error('Erro ao desativar produto:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao desativar produto'
            });
        }
    }

    /**
     * Ativar produto novamente
     */
    static async ativar(req, res) {
        try {
            const { id } = req.params;

            const { data, error } = await supabase
                .from('produtos')
                .update({
                    status: 'ativo',
                    motivo_desativacao: null,
                    desativado_por: null,
                    data_desativacao: null
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Registrar no histórico
            await supabase.from('historico_admin').insert([{
                admin_id: req.usuario.id,
                acao: 'ativar_produto',
                entidade_tipo: 'produto',
                entidade_id: id
            }]);

            res.json({
                sucesso: true,
                mensagem: 'Produto ativado',
                produto: data
            });

        } catch (erro) {
            console.error('Erro ao ativar produto:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao ativar produto'
            });
        }
    }

    /**
     * Estatísticas de produtos
     */
    static async obterEstatisticas(req, res) {
        try {
            // Total por status
            const { data: produtos } = await supabase
                .from('produtos')
                .select('status');

            const estatisticas = {
                total: produtos.length,
                ativos: produtos.filter(p => p.status === 'ativo').length,
                pendentes: produtos.filter(p => p.status === 'pendente').length,
                rejeitados: produtos.filter(p => p.status === 'rejeitado').length,
                inativos: produtos.filter(p => p.status === 'inativo').length
            };

            // Produtos mais vendidos
            const { data: maisVendidos } = await supabase
                .from('itens_pedido')
                .select(`
                    produto_id,
                    produtos (nome, preco, fornecedores(nome)),
                    quantidade
                `)
                .order('quantidade', { ascending: false })
                .limit(10);

            res.json({
                sucesso: true,
                estatisticas,
                mais_vendidos: maisVendidos
            });

        } catch (erro) {
            console.error('Erro ao obter estatísticas:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter estatísticas'
            });
        }
    }
}

module.exports = AdminProdutoController;
