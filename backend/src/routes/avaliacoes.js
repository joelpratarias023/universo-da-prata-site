const express = require('express');
const router = express.Router();
const AvaliacaoController = require('../controllers/AvaliacaoController');
const { verificarAutenticacao } = require('../middleware/auth');

// Rotas públicas
router.get('/produto/:produto_id', AvaliacaoController.listarPorProduto);
router.get('/:id', AvaliacaoController.buscar);

// Rotas protegidas (autenticados)
router.post('/', verificarAutenticacao, AvaliacaoController.criar);
router.put('/:id', verificarAutenticacao, AvaliacaoController.atualizar);
router.delete('/:id', verificarAutenticacao, AvaliacaoController.deletar);

module.exports = router;
