// Padrões de resposta da API
const enviarSucesso = (res, dados, mensagem = 'Operação realizada com sucesso', status = 200) => {
  res.status(status).json({
    sucesso: true,
    mensagem,
    dados,
    timestamp: new Date().toISOString(),
  });
};

const enviarErro = (res, mensagem = 'Erro interno do servidor', status = 500, detalhes = null) => {
  res.status(status).json({
    sucesso: false,
    mensagem,
    ...(detalhes && { detalhes }),
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  enviarSucesso,
  enviarErro,
};
