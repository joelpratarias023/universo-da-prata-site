const express = require('express');
const router = express.Router();
const EnderecoController = require('../controllers/EnderecoController');
const { verificarAutenticacao } = require('../middleware/auth');

// Todas as rotas de endereço requerem autenticação
router.post('/', verificarAutenticacao, EnderecoController.criar);
router.get('/', verificarAutenticacao, EnderecoController.listar);
router.get('/:id', verificarAutenticacao, EnderecoController.buscar);
router.put('/:id', verificarAutenticacao, EnderecoController.atualizar);
router.delete('/:id', verificarAutenticacao, EnderecoController.deletar);

module.exports = router;
