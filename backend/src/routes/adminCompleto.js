const express = require('express');
const router = express.Router();
const { verificarAutenticacao, verificarAdmin } = require('../middleware/auth');
const AdminFornecedorController = require('../controllers/AdminFornecedorController');
const AdminEntregadorController = require('../controllers/AdminEntregadorController');
const AdminProdutoController = require('../controllers/AdminProdutoController');
const AdminPagamentoController = require('../controllers/AdminPagamentoController');

// Todas as rotas requerem autenticação de admin
router.use(verificarAutenticacao, verificarAdmin);

// ===== FORNECEDORES =====
router.get('/fornecedores', AdminFornecedorController.listarTodos);
router.post('/fornecedores', AdminFornecedorController.criar);
router.get('/fornecedores/:id', AdminFornecedorController.verDetalhes);
router.get('/fornecedores/:id/produtos', AdminFornecedorController.verProdutos);
router.get('/fornecedores/:id/vendas', AdminFornecedorController.verVendas);
router.put('/fornecedores/:id/comissao', AdminFornecedorController.definirComissao);
router.put('/fornecedores/:id/status', AdminFornecedorController.atualizarStatus);
router.get('/fornecedores/:id/relatorio', AdminFornecedorController.obterRelatorio);

// ===== ENTREGADORES =====
router.get('/entregadores', AdminEntregadorController.listarTodos);
router.post('/entregadores', AdminEntregadorController.criar);
router.get('/entregadores/:id', AdminEntregadorController.verDetalhes);
router.put('/entregadores/:id/status', AdminEntregadorController.atualizarStatus);
router.get('/entregadores/:id/relatorio', AdminEntregadorController.obterRelatorio);

// ===== ENTREGAS =====
router.post('/entregas', AdminEntregadorController.criarEntrega);
router.get('/entregas', AdminEntregadorController.listarEntregas);
router.patch('/entregas/:id/aprovar', AdminEntregadorController.aprovarEntrega);
router.patch('/entregas/:id/rejeitar', AdminEntregadorController.rejeitarEntrega);

// ===== PRODUTOS =====
router.get('/produtos', AdminProdutoController.listarTodos);
router.get('/produtos/pendentes', AdminProdutoController.listarPendentes);
router.get('/produtos/estatisticas', AdminProdutoController.obterEstatisticas);
router.patch('/produtos/:id/aprovar', AdminProdutoController.aprovar);
router.patch('/produtos/:id/rejeitar', AdminProdutoController.rejeitar);
router.put('/produtos/:id/preco', AdminProdutoController.editarPreco);
router.patch('/produtos/:id/desativar', AdminProdutoController.desativar);
router.patch('/produtos/:id/ativar', AdminProdutoController.ativar);

// ===== PAGAMENTOS =====
// Fornecedores
router.get('/pagamentos/fornecedores', AdminPagamentoController.listarPagamentosFornecedores);
router.post('/pagamentos/fornecedores/gerar', AdminPagamentoController.gerarPagamentoFornecedor);
router.patch('/pagamentos/fornecedores/:id/processar', AdminPagamentoController.processarPagamentoFornecedor);

// Entregadores
router.get('/pagamentos/entregadores', AdminPagamentoController.listarPagamentosEntregadores);
router.post('/pagamentos/entregadores/gerar', AdminPagamentoController.gerarPagamentoEntregador);
router.patch('/pagamentos/entregadores/:id/processar', AdminPagamentoController.processarPagamentoEntregador);

// Relatório financeiro
router.get('/pagamentos/relatorio', AdminPagamentoController.obterRelatorioFinanceiro);

module.exports = router;
