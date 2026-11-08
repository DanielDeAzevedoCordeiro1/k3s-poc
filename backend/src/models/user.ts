import mongoose, { Schema } from 'mongoose';

export interface UserRecord {
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<UserRecord>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export const UserModel = mongoose.model<UserRecord>('User', userSchema);
