const UsuarioDao = require('../dao/UsuarioDao');
const logger = require('../utils/logger');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UsuarioController {
  constructor(usuarioDao = new UsuarioDao()) {
    this.usuarioDao = usuarioDao;
    this.cadastrar = this.cadastrar.bind(this);
  }

  async cadastrar(req, res) {
    const { nome, email, senha, confirmarSenha } = req.body || {};

    if (!logger.registrarValidacao(
      typeof nome === 'string' &&
        Boolean(nome.trim()) &&
        typeof email === 'string' &&
        Boolean(email.trim()) &&
        typeof senha === 'string' &&
        Boolean(senha.trim()) &&
        typeof confirmarSenha === 'string' &&
        Boolean(confirmarSenha.trim()),
      'Nome, email, senha e confirmação informados',
      'Cadastrar usuário'
    )) {
      return res.status(400).json({
        mensagem: 'Informe nome, email, senha e confirmação da senha.'
      });
    }

    if (!logger.registrarValidacao(
      EMAIL_PATTERN.test(email.trim()),
      'Formato do email válido',
      'Cadastrar usuário'
    )) {
      return res.status(400).json({
        mensagem: 'Informe um email válido.'
      });
    }

    if (!logger.registrarValidacao(
      senha.length >= 6,
      'Senha com pelo menos 6 caracteres',
      'Cadastrar usuário'
    )) {
      return res.status(400).json({
        mensagem: 'A senha deve ter pelo menos 6 caracteres.'
      });
    }

    if (!logger.registrarValidacao(
      senha === confirmarSenha,
      'Senha e confirmação coincidem',
      'Cadastrar usuário'
    )) {
      return res.status(400).json({
        mensagem: 'A senha e a confirmação não coincidem.'
      });
    }

    try {
      const usuario = await this.usuarioDao.insere({ nome, email, senha });

      return res.status(201).json({
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          createdAt: usuario.createdAt
        }
      });
    } catch (err) {
      logger.registrarErro(err, 'Cadastrar usuário');

      if (err.code === 11000) {
        return res.status(409).json({
          mensagem: 'Já existe um usuário cadastrado com este email.'
        });
      }

      if (err.name === 'ValidationError') {
        logger.registrarValidacao(
          false,
          'Validação dos dados do usuário pelo Mongoose',
          'Cadastrar usuário'
        );
        return res.status(400).json({
          mensagem: 'Os dados do usuário são inválidos.'
        });
      }

      return res.status(500).json({
        mensagem: 'Erro ao cadastrar usuário.'
      });
    }
  }
}

module.exports = UsuarioController;
