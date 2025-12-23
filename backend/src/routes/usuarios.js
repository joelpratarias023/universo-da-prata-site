const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { verificarAutenticacao, verificarAdmin } = require('../middleware/auth');

// Rotas protegidas (admin)
router.get('/', verificarAutenticacao, verificarAdmin, UsuarioController.listar);
router.get('/:id/pedidos', verificarAutenticacao, verificarAdmin, UsuarioController.pedidosDoUsuario);
router.put('/:id/status', verificarAutenticacao, verificarAdmin, UsuarioController.atualizarStatus);
router.post('/admin', verificarAutenticacao, verificarAdmin, UsuarioController.criarAdmin);

module.exports = router;
