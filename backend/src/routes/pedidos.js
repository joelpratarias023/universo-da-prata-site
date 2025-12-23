const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');
const { verificarAutenticacao, verificarAdmin } = require('../middleware/auth');

// Rotas protegidas (autenticados)
router.post('/', verificarAutenticacao, PedidoController.criar);
router.get('/meus-pedidos', verificarAutenticacao, PedidoController.meusPedidos);
router.get('/:id/historico', verificarAutenticacao, verificarAdmin, PedidoController.historico);
router.get('/:id', verificarAutenticacao, PedidoController.buscar);

// Rotas protegidas (admin)
router.get('/', verificarAutenticacao, verificarAdmin, PedidoController.listar);
router.put('/:id', verificarAutenticacao, verificarAdmin, PedidoController.atualizar);

module.exports = router;
