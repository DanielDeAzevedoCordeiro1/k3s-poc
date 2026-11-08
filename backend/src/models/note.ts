import mongoose, { Schema } from 'mongoose';

export interface NoteRecord {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<NoteRecord>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

noteSchema.index({ userId: 1, createdAt: -1 });
export const NoteModel = mongoose.model<NoteRecord>('Note', noteSchema);
