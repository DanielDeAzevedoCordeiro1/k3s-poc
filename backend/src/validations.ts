import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.email().max(254).transform(email => email.toLowerCase()),
  password: z.string().min(8).max(72),
}).strict();

export const noteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(10000),
}).strict();

export type Credentials = z.infer<typeof credentialsSchema>;
export type NewNote = z.infer<typeof noteSchema>;
