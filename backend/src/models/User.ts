import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  score: number;
  createdAt?: Date;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Changed from required: true
  profilePicture: { type: String, default: 'default.jpg' },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<UserDocument>('User', UserSchema);
