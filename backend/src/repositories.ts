import mongoose from 'mongoose';
import { UserModel } from './models/user.js';
import { NoteModel } from './models/note.js';
import type { NewNote } from './validations.js';

export interface UserEntity { id: string; email: string; passwordHash: string }
export interface NoteEntity { id: string; userId: string; title: string; content: string; createdAt: Date; updatedAt: Date }

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(email: string, passwordHash: string): Promise<UserEntity>;
}

export interface NoteRepository {
  listByUser(userId: string): Promise<NoteEntity[]>;
  createForUser(userId: string, input: NewNote): Promise<NoteEntity>;
}

export const users: UserRepository = {
  async findByEmail(email) {
    const user = await UserModel.findOne({ email }).lean();
    return user && { id: String(user._id), email: user.email, passwordHash: user.passwordHash };
  },
  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const user = await UserModel.findById(id).lean();
    return user && { id: String(user._id), email: user.email, passwordHash: user.passwordHash };
  },
  async create(email, passwordHash) {
    const user = await UserModel.create({ email, passwordHash });
    return { id: String(user._id), email: user.email, passwordHash: user.passwordHash };
  },
};

const toNote = (note: { _id: unknown; userId: unknown; title: string; content: string; createdAt: Date; updatedAt: Date }): NoteEntity => ({
  id: String(note._id), userId: String(note.userId), title: note.title, content: note.content,
  createdAt: note.createdAt, updatedAt: note.updatedAt,
});

export const notes: NoteRepository = {
  async listByUser(userId) {
    const results = await NoteModel.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
    return results.map(toNote);
  },
  async createForUser(userId, input) {
    const note = await NoteModel.create({ userId: new mongoose.Types.ObjectId(userId), ...input });
    return toNote(note);
  },
};
