const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { verificarAutenticacao } = require('../middleware/auth');

// Rotas públicas
router.post('/registrar', AuthController.registrar);
router.post('/login', AuthController.login);

// Rotas protegidas
router.get('/perfil', verificarAutenticacao, AuthController.perfil);
router.put('/perfil', verificarAutenticacao, AuthController.atualizarPerfil);
router.post('/alterar-senha', verificarAutenticacao, AuthController.alterarSenha);

module.exports = router;
