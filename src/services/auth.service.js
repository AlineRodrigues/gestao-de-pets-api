import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Administrador from '../models/admin.model.js';
import ApiError from '../utils/ApiError.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

function gerarToken(usuario) {
  return jwt.sign(
    {
      sub: usuario.id,
      role: usuario.role,
      nome: usuario.nome,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

export async function login({ email, senha }) {
  if (!email || !senha) {
    throw new ApiError(400, 'Os campos "email" e "senha" são obrigatórios.');
  }

  const administrador = await Administrador.findOne({ email });

  if (
    !administrador ||
    !bcrypt.compareSync(senha, administrador.senha)
  ) {
    throw new ApiError(401, 'E-mail ou senha inválidos.');
  }

  return {
    token: gerarToken(administrador),
    usuario: {
      id: administrador.id,
      nome: administrador.nome,
      email: administrador.email,
      role: administrador.role,
    },
  };
}

export default { login };