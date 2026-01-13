const jwt = require('jsonwebtoken');
const { enviarErro } = require('../utils/respostas');
const Fornecedor = require('../models/Fornecedor');

const autenticarFornecedor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return enviarErro(res, 'Token não fornecido', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return enviarErro(res, 'Token inválido', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-jwt');

    // Verificar se é um fornecedor
    if (decoded.tipo !== 'fornecedor') {
      return enviarErro(res, 'Acesso negado. Apenas fornecedores podem acessar este recurso.', 403);
    }

    // Buscar fornecedor
    const fornecedor = await Fornecedor.buscarPorId(decoded.id);

    if (!fornecedor) {
      return enviarErro(res, 'Fornecedor não encontrado', 404);
    }

    if (fornecedor.status !== 'ativo') {
      return enviarErro(res, 'Conta inativa ou bloqueada', 403);
    }

    // Anexar dados do fornecedor ao request
    req.fornecedor = {
      id: fornecedor.id,
      uuid: fornecedor.uuid,
      email: fornecedor.email,
      nome: fornecedor.nome
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return enviarErro(res, 'Token inválido', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return enviarErro(res, 'Token expirado', 401);
    }
    console.error('Erro na autenticação:', error);
    return enviarErro(res, 'Erro na autenticação', 500);
  }
};

module.exports = autenticarFornecedor;
