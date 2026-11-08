import Fastify, { type FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import type { Config } from './config.js';
import { AppError } from './errors.js';
import { notes, users, type NoteRepository, type UserRepository } from './repositories.js';
import { createAuthService } from './services/auth.js';
import { createNoteService } from './services/notes.js';
import { credentialsSchema, noteSchema } from './validations.js';

const cookieName = 'personal_notes_token';

export function buildApp(config: Config, repositories: { users: UserRepository; notes: NoteRepository } = { users, notes }) {
  const app = Fastify({ logger: true });
  const auth = createAuthService(repositories.users, config.JWT_SECRET);
  const noteService = createNoteService(repositories.notes);
  app.register(cookie);

  const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure: config.COOKIE_SECURE };
  const authenticate = async (request: FastifyRequest) => {
    const token = request.cookies[cookieName];
    if (!token) throw new AppError(401, 'Não autenticado');
    return auth.verify(token);
  };

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({ error: 'Dados inválidos', details: error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })) });
    }
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: error.message });
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) return reply.code(409).send({ error: 'E-mail já cadastrado' });
    app.log.error(error);
    return reply.code(500).send({ error: 'Erro interno' });
  });

  app.post('/api/auth/register', async (request, reply) => {
    const user = await auth.register(credentialsSchema.parse(request.body));
    return reply.code(201).send({ user });
  });

  app.post('/api/auth/login', async (request, reply) => {
    const result = await auth.login(credentialsSchema.parse(request.body));
    return reply.setCookie(cookieName, result.token, { ...cookieOptions, maxAge: 8 * 60 * 60 }).send({ user: result.user });
  });

  app.post('/api/auth/logout', async (_request, reply) => {
    return reply.clearCookie(cookieName, cookieOptions).code(204).send();
  });

  app.get('/api/auth/me', async (request) => ({ user: await auth.me(await authenticate(request)) }));
  app.get('/api/notes', async (request) => ({ notes: await noteService.list(await authenticate(request)) }));
  app.post('/api/notes', async (request, reply) => {
    const userId = await authenticate(request);
    const note = await noteService.create(userId, noteSchema.parse(request.body));
    return reply.code(201).send({ note });
  });

  app.get('/api/health', async (_request, reply) => {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return reply.code(503).send({ status: 'unavailable' });
    }
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'ok' };
    } catch {
      return reply.code(503).send({ status: 'unavailable' });
    }
  });

  return app;
}
