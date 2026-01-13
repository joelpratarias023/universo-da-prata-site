const express = require('express');
const router = express.Router();
const FornecedorController = require('../controllers/FornecedorController');
const autenticarFornecedor = require('../middleware/autenticarFornecedor');

// Rotas públicas
router.post('/login', FornecedorController.login);

// Rotas protegidas (requerem autenticação)
router.use(autenticarFornecedor);

// Dashboard
router.get('/dashboard', FornecedorController.obterDashboard);

// Produtos
router.get('/produtos', FornecedorController.listarProdutos);
router.get('/produtos/:id', FornecedorController.obterProduto);

// Vendas
router.get('/vendas', FornecedorController.historicoVendas);

// Financeiro
router.get('/financeiro', FornecedorController.resumoFinanceiro);

// Perfil
router.get('/perfil', FornecedorController.obterPerfil);
router.put('/perfil', FornecedorController.atualizarPerfil);
router.put('/alterar-senha', FornecedorController.alterarSenha);

module.exports = router;
