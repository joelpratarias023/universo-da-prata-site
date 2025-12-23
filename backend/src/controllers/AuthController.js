const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/Usuario');
const Endereco = require('../models/Endereco');
const { gerarToken } = require('../config/jwt');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const validacoes = require('../utils/validacoes');

class AuthController {
  static async registrar(req, res) {
    try {
      const { nome, email, cpf, telefone, senha, confirmar_senha } = req.body;

      // Validações
      if (!nome || !email || !senha) {
        return enviarErro(res, 'Nome, email e senha são obrigatórios', 400);
      }

      if (senha !== confirmar_senha) {
        return enviarErro(res, 'As senhas não correspondem', 400);
      }

      if (!validacoes.validarEmail(email)) {
        return enviarErro(res, 'Email inválido', 400);
      }

      if (cpf && !validacoes.validarCPF(cpf)) {
        return enviarErro(res, 'CPF inválido', 400);
      }

      // Verificar se email já existe
      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return enviarErro(res, 'Email já cadastrado', 409);
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Criar usuário
      const uuid = uuidv4();
      const resultado = await Usuario.criar({
        uuid,
        nome: validacoes.limpar(nome),
        email: email.toLowerCase(),
        cpf: cpf || null,
        telefone: telefone || null,
        senhaHash,
        tipo: 'cliente',
      });

      // Gerar token
      const criado = resultado?.id || resultado?.insertId || resultado?.uuid;
      const usuario = await Usuario.buscarPorId(criado);
      const token = gerarToken({
        id: usuario.id,
        uuid: usuario.uuid,
        email: usuario.email,
        tipo: usuario.tipo,
      });

      enviarSucesso(res, {
        usuario: {
          id: usuario.id,
          uuid: usuario.uuid,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
        token,
      }, 'Conta criada com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao registrar:', erro);
      enviarErro(res, 'Erro ao criar conta', 500, erro.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return enviarErro(res, 'Email e senha são obrigatórios', 400);
      }

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return enviarErro(res, 'Email ou senha incorretos', 401);
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return enviarErro(res, 'Email ou senha incorretos', 401);
      }

      if (usuario.status === 'bloqueado') {
        return enviarErro(res, 'Sua conta foi bloqueada', 403);
      }

      // Gerar token
      const token = gerarToken({
        id: usuario.id,
        uuid: usuario.uuid,
        email: usuario.email,
        tipo: usuario.tipo,
      });

      enviarSucesso(res, {
        usuario: {
          id: usuario.id,
          uuid: usuario.uuid,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
        token,
      }, 'Logado com sucesso');
    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
      enviarErro(res, 'Erro ao fazer login', 500, erro.message);
    }
  }

  static async perfil(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.usuario.id);
      
      if (!usuario) {
        return enviarErro(res, 'Usuário não encontrado', 404);
      }

      const enderecos = await Endereco.listarPorUsuario(usuario.id);

      enviarSucesso(res, {
        usuario: {
          id: usuario.id,
          uuid: usuario.uuid,
          nome: usuario.nome,
          email: usuario.email,
          cpf: usuario.cpf,
          telefone: usuario.telefone,
          tipo: usuario.tipo,
          status: usuario.status,
        },
        enderecos,
      }, 'Perfil recuperado');
    } catch (erro) {
      console.error('Erro ao recuperar perfil:', erro);
      enviarErro(res, 'Erro ao recuperar perfil', 500, erro.message);
    }
  }

  static async atualizarPerfil(req, res) {
    try {
      const { nome, telefone } = req.body;
      const usuario_id = req.usuario.id;

      const dados = {};
      if (nome) dados.nome = validacoes.limpar(nome);
      if (telefone) dados.telefone = telefone;

      if (Object.keys(dados).length === 0) {
        return enviarErro(res, 'Nenhum dado para atualizar', 400);
      }

      await Usuario.atualizar(usuario_id, dados);

      const usuarioAtualizado = await Usuario.buscarPorId(usuario_id);
      enviarSucesso(res, {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        telefone: usuarioAtualizado.telefone,
        tipo: usuarioAtualizado.tipo,
      }, 'Perfil atualizado com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar perfil:', erro);
      enviarErro(res, 'Erro ao atualizar perfil', 500, erro.message);
    }
  }

  static async alterarSenha(req, res) {
    try {
      const { senha_atual, senha_nova, confirmar_senha } = req.body;
      const usuario_id = req.usuario.id;

      if (!senha_atual || !senha_nova) {
        return enviarErro(res, 'Todas as senhas são obrigatórias', 400);
      }

      if (senha_nova !== confirmar_senha) {
        return enviarErro(res, 'As senhas não correspondem', 400);
      }

      if (senha_atual === senha_nova) {
        return enviarErro(res, 'A nova senha não pode ser igual à atual', 400);
      }

      const usuario = await Usuario.buscarPorId(usuario_id);
      const senhaValida = await bcrypt.compare(senha_atual, usuario.senha);

      if (!senhaValida) {
        return enviarErro(res, 'Senha atual incorreta', 401);
      }

      const novasenhaHash = await bcrypt.hash(senha_nova, 10);
      await Usuario.atualizar(usuario_id, { senha: novasenhaHash });

      enviarSucesso(res, null, 'Senha alterada com sucesso');
    } catch (erro) {
      console.error('Erro ao alterar senha:', erro);
      enviarErro(res, 'Erro ao alterar senha', 500, erro.message);
    }
  }
}

module.exports = AuthController;
