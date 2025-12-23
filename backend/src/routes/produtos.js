const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');
const { verificarAutenticacao, verificarAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', ProdutoController.listar);
router.get('/admin/todos', verificarAutenticacao, verificarAdmin, ProdutoController.listarAdmin);
router.get('/mais-vendidos', ProdutoController.maisVendidos);
router.get('/categoria/:categoria_id', ProdutoController.buscarPorCategoria);
router.get('/:id', ProdutoController.buscar);

// Rotas protegidas (admin)
router.post('/', verificarAutenticacao, verificarAdmin, ProdutoController.criar);
router.put('/:id', verificarAutenticacao, verificarAdmin, ProdutoController.atualizar);
router.delete('/:id', verificarAutenticacao, verificarAdmin, ProdutoController.deletar);

module.exports = router;
