const { v4: uuidv4 } = require('uuid');
const Endereco = require('../models/Endereco');
const { enviarSucesso, enviarErro } = require('../utils/respostas');
const validacoes = require('../utils/validacoes');

class EnderecoController {
  static async criar(req, res) {
    try {
      const { endereco, numero, complemento, bairro, cidade, estado, cep, principal } = req.body;
      const usuario_id = req.usuario.id;

      if (!endereco || !numero || !cidade || !estado || !cep) {
        return enviarErro(res, 'Endereço, número, cidade, estado e CEP são obrigatórios', 400);
      }

      const uuid = uuidv4();
      const resultado = await Endereco.criar({
        uuid,
        usuario_id,
        endereco: validacoes.limpar(endereco),
        numero: validacoes.limpar(numero),
        complemento: complemento || '',
        bairro: bairro || '',
        cidade: validacoes.limpar(cidade),
        estado: estado.toUpperCase().slice(0, 2),
        cep: cep.replace(/\D/g, ''),
        principal: principal || false,
      });

      const criado = resultado?.id || resultado?.insertId || resultado?.uuid;
      const enderecoNovo = await Endereco.buscarPorId(criado);
      enviarSucesso(res, enderecoNovo, 'Endereço criado com sucesso', 201);
    } catch (erro) {
      console.error('Erro ao criar endereço:', erro);
      enviarErro(res, 'Erro ao criar endereço', 500, erro.message);
    }
  }

  static async buscar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const endereco = await Endereco.buscarPorId(id);
      if (!endereco) {
        return enviarErro(res, 'Endereço não encontrado', 404);
      }

      if (endereco.usuario_id !== usuario_id && req.usuario.tipo !== 'admin') {
        return enviarErro(res, 'Acesso não autorizado', 403);
      }

      enviarSucesso(res, endereco, 'Endereço recuperado');
    } catch (erro) {
      console.error('Erro ao buscar endereço:', erro);
      enviarErro(res, 'Erro ao buscar endereço', 500, erro.message);
    }
  }

  static async listar(req, res) {
    try {
      const usuario_id = req.usuario.id;

      const enderecos = await Endereco.listarPorUsuario(usuario_id);
      enviarSucesso(res, enderecos, 'Endereços recuperados');
    } catch (erro) {
      console.error('Erro ao listar endereços:', erro);
      enviarErro(res, 'Erro ao listar endereços', 500, erro.message);
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { endereco, numero, complemento, bairro, cidade, estado, cep, principal } = req.body;
      const usuario_id = req.usuario.id;

      const enderecoAtual = await Endereco.buscarPorId(id);
      if (!enderecoAtual) {
        return enviarErro(res, 'Endereço não encontrado', 404);
      }

      if (enderecoAtual.usuario_id !== usuario_id && req.usuario.tipo !== 'admin') {
        return enviarErro(res, 'Acesso não autorizado', 403);
      }

      const dados = {};
      if (endereco) dados.endereco = validacoes.limpar(endereco);
      if (numero) dados.numero = validacoes.limpar(numero);
      if (complemento !== undefined) dados.complemento = complemento;
      if (bairro) dados.bairro = bairro;
      if (cidade) dados.cidade = validacoes.limpar(cidade);
      if (estado) dados.estado = estado.toUpperCase().slice(0, 2);
      if (cep) dados.cep = cep.replace(/\D/g, '');
      if (principal !== undefined) dados.principal = principal;

      if (Object.keys(dados).length === 0) {
        return enviarErro(res, 'Nenhum dado para atualizar', 400);
      }

      await Endereco.atualizar(id, dados);

      const enderecoAtualizado = await Endereco.buscarPorId(id);
      enviarSucesso(res, enderecoAtualizado, 'Endereço atualizado com sucesso');
    } catch (erro) {
      console.error('Erro ao atualizar endereço:', erro);
      enviarErro(res, 'Erro ao atualizar endereço', 500, erro.message);
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const endereco = await Endereco.buscarPorId(id);
      if (!endereco) {
        return enviarErro(res, 'Endereço não encontrado', 404);
      }

      if (endereco.usuario_id !== usuario_id && req.usuario.tipo !== 'admin') {
        return enviarErro(res, 'Acesso não autorizado', 403);
      }

      await Endereco.deletar(id);
      enviarSucesso(res, null, 'Endereço deletado com sucesso');
    } catch (erro) {
      console.error('Erro ao deletar endereço:', erro);
      enviarErro(res, 'Erro ao deletar endereço', 500, erro.message);
    }
  }
}

module.exports = EnderecoController;
