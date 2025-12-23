const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');
const { verificarAutenticacao, verificarAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', CategoriaController.listar);
router.get('/admin/todas', verificarAutenticacao, verificarAdmin, CategoriaController.listarAdmin);
router.get('/:id', CategoriaController.buscar);

// Rotas protegidas (admin)
router.post('/', verificarAutenticacao, verificarAdmin, CategoriaController.criar);
router.put('/:id', verificarAutenticacao, verificarAdmin, CategoriaController.atualizar);
router.delete('/:id', verificarAutenticacao, verificarAdmin, CategoriaController.deletar);

module.exports = router;
