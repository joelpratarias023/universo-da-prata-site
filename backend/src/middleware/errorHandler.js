// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno do servidor';

  res.status(status).json({
    sucesso: false,
    mensagem,
    ...(process.env.NODE_ENV === 'development' && { detalhes: err.stack }),
  });
};

module.exports = errorHandler;
