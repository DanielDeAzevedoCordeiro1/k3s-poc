import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors.js';
import type { UserEntity, UserRepository } from '../repositories.js';
import type { Credentials } from '../validations.js';

const publicUser = (user: UserEntity) => ({ id: user.id, email: user.email });

export function createAuthService(users: UserRepository, secret: string) {
  return {
    async register(input: Credentials) {
      if (await users.findByEmail(input.email)) throw new AppError(409, 'E-mail já cadastrado');
      const passwordHash = await bcrypt.hash(input.password, 12);
      return publicUser(await users.create(input.email, passwordHash));
    },
    async login(input: Credentials) {
      const user = await users.findByEmail(input.email);
      if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
        throw new AppError(401, 'Credenciais inválidas');
      }
      return { user: publicUser(user), token: jwt.sign({}, secret, { subject: user.id, expiresIn: '8h' }) };
    },
    async me(id: string) {
      const user = await users.findById(id);
      if (!user) throw new AppError(401, 'Não autenticado');
      return publicUser(user);
    },
    verify(token: string): string {
      try {
        const payload = jwt.verify(token, secret);
        if (typeof payload === 'string' || !payload.sub) throw new Error('Invalid token');
        return payload.sub;
      } catch {
        throw new AppError(401, 'Não autenticado');
      }
    },
  };
}
