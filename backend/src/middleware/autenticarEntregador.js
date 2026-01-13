const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'universo-da-prata-secret-key-2026';

/**
 * Middleware para autenticar entregadores
 */
async function autenticarEntregador(req, res, next) {
    try {
        // Obter token do header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token não fornecido'
            });
        }

        // Formato esperado: "Bearer TOKEN"
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Formato de token inválido'
            });
        }

        const token = parts[1];

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Verificar se é um entregador
        if (decoded.tipo !== 'entregador') {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Acesso negado'
            });
        }

        // Adicionar dados do entregador à requisição
        req.entregador = {
            id: decoded.id,
            email: decoded.email
        };

        next();

    } catch (erro) {
        if (erro.name === 'JsonWebTokenError') {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token inválido'
            });
        }

        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token expirado'
            });
        }

        console.error('Erro na autenticação:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro na autenticação'
        });
    }
}

module.exports = autenticarEntregador;
