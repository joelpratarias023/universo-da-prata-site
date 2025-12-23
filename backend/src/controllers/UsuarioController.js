const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/database');
const Usuario = require('../models/Usuario');
const Pedido = require('../models/Pedido');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const validacoes = require('../utils/validacoes');

class UsuarioController {
  static async listar(req, res) {
    try {
      const { tipo, busca, pagina = 1, limite = 20 } = req.query;

      const filtros = {
        tipo: tipo || null,
        busca: busca || null,
      };

      const usuarios = await Usuario.listar(filtros, parseInt(pagina), parseInt(limite));

      // Nunca devolver hash da senha
      const sanitizado = (usuarios || []).map(u => {
        const { senha, ...resto } = u;
        return resto;
      });

      enviarSucesso(res, sanitizado, 'Utilizadores recuperados');
    } catch (erro) {
      console.error('Erro ao listar utilizadores:', erro);
      enviarErro(res, 'Erro ao listar utilizadores', 500, erro.message);
    }
  }

  static async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const statusPermitidos = ['ativo', 'bloqueado'];
      if (!status || !statusPermitidos.includes(status)) {
        return enviarErro(res, 'Status inválido. Use ativo ou bloqueado', 400);
      }

      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        return enviarErro(res, 'Utilizador não encontrado', 404);
      }

      await Usuario.atualizar(id, { status });
      const atualizado = await Usuario.buscarPorId(id);
      const { senha, ...resto } = atualizado || {};

      enviarSucesso(res, resto, 'Status atualizado com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar status do utilizador:', erro);
      enviarErro(res, 'Erro ao atualizar status do utilizador', 500, erro.message);
    }
  }

  static async pedidosDoUsuario(req, res) {
    try {
      const { id } = req.params;
      const { pagina = 1, limite = 20 } = req.query;

      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        return enviarErro(res, 'Utilizador não encontrado', 404);
      }

      const pedidos = await Pedido.buscarPorUsuario(usuario.id, parseInt(pagina), parseInt(limite));
      enviarSucesso(res, pedidos, 'Pedidos do utilizador recuperados');
    } catch (erro) {
      console.error('Erro ao listar pedidos do utilizador:', erro);
      enviarErro(res, 'Erro ao listar pedidos do utilizador', 500, erro.message);
    }
  }

  static async criarAdmin(req, res) {
    try {
      const { nome, email, telefone, senha, confirmar_senha } = req.body;

      if (!nome || !email || !senha || !confirmar_senha) {
        return enviarErro(res, 'Nome, email e senha são obrigatórios', 400);
      }

      if (senha !== confirmar_senha) {
        return enviarErro(res, 'As senhas não correspondem', 400);
      }

      if (!validacoes.validarEmail(email)) {
        return enviarErro(res, 'Email inválido', 400);
      }

      const emailLower = email.toLowerCase();

      const { data: existente, error: erroExistente } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', emailLower)
        .maybeSingle();

      if (erroExistente && erroExistente.code !== 'PGRST116') {
        throw erroExistente;
      }

      if (existente) {
        return enviarErro(res, 'Email já cadastrado', 409);
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const resultado = await Usuario.criar({
        uuid: uuidv4(),
        nome: validacoes.limpar(nome),
        email: emailLower,
        cpf: null,
        telefone: telefone || null,
        senhaHash,
        tipo: 'admin',
      });

      const criado = resultado?.id || resultado?.insertId || resultado?.uuid;
      const usuario = await Usuario.buscarPorId(criado);
      const { senha: senhaDb, ...resto } = usuario || {};

      enviarSucesso(res, resto, 'Admin criado com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao criar admin:', erro);
      enviarErro(res, 'Erro ao criar admin', 500, erro.message);
    }
  }
}

module.exports = UsuarioController;
