const { verificarToken } = require('../config/jwt');

// Middleware para verificar autenticação
const verificarAutenticacao = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido',
      });
    }

    const usuario = verificarToken(token);

    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido ou expirado',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao verificar autenticação',
      erro: error.message,
    });
  }
};

// Middleware para verificar permissões de administrador
const verificarAdmin = (req, res, next) => {
  verificarAutenticacao(req, res, () => {
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Acesso restrito a administradores',
      });
    }
    next();
  });
};

// Middleware para verificar permissões de entregador
const verificarEntregador = (req, res, next) => {
  verificarAutenticacao(req, res, () => {
    if (req.usuario.tipo !== 'entregador' && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Acesso restrito a entregadores',
      });
    }
    next();
  });
};

module.exports = {
  verificarAutenticacao,
  verificarAdmin,
  verificarEntregador,
};
