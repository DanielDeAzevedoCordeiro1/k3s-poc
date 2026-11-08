import type { NoteRepository } from '../repositories.js';
import type { NewNote } from '../validations.js';

export function createNoteService(notes: NoteRepository) {
  return {
    list(userId: string) { return notes.listByUser(userId); },
    create(userId: string, input: NewNote) { return notes.createForUser(userId, input); },
  };
}
