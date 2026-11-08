import type { Credentials, NewNote, Note, User } from '../types';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string };
    throw new ApiError(response.status, body.error ?? 'Não foi possível concluir a operação.');
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const api = {
  register: (data: Credentials) => request<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: Credentials) => request<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  me: () => request<{ user: User }>('/auth/me'),
  notes: () => request<{ notes: Note[] }>('/notes'),
  createNote: (data: NewNote) => request<{ note: Note }>('/notes', { method: 'POST', body: JSON.stringify(data) }),
};
