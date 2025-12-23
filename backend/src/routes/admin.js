const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { verificarAutenticacao, verificarAdmin } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : '';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/dashboard', verificarAutenticacao, verificarAdmin, AdminController.dashboard);
router.get('/config', verificarAutenticacao, verificarAdmin, AdminController.obterConfig);
router.put('/config', verificarAutenticacao, verificarAdmin, AdminController.salvarConfig);
router.post('/upload/imagem', verificarAutenticacao, verificarAdmin, upload.single('imagem'), AdminController.uploadImagem);

module.exports = router;
