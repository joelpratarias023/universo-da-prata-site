const express = require('express');
const router = express.Router();
const EntregadorController = require('../controllers/EntregadorController');
const autenticarEntregador = require('../middleware/autenticarEntregador');

// Rotas públicas
router.post('/login', EntregadorController.login);

// Rotas protegidas (requerem autenticação)
router.get('/dashboard', autenticarEntregador, EntregadorController.obterDashboard);
router.get('/entregas', autenticarEntregador, EntregadorController.listarEntregas);
router.patch('/entregas/:id/confirmar', autenticarEntregador, EntregadorController.confirmarEntrega);
router.patch('/entregas/:id/status', autenticarEntregador, EntregadorController.atualizarStatus);
router.get('/ganhos', autenticarEntregador, EntregadorController.historicoGanhos);
router.get('/pagamentos', autenticarEntregador, EntregadorController.obterPagamentos);
router.get('/perfil', autenticarEntregador, EntregadorController.obterPerfil);
router.put('/perfil', autenticarEntregador, EntregadorController.atualizarPerfil);

module.exports = router;
