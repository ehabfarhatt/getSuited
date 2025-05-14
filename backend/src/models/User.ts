import mongoose, { Schema, Document } from 'mongoose';

export interface Evaluation {
  fileName: string;
  fileUrl: string;
  createdAt?: Date;
}


export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  score: number;
  createdAt?: Date;
  evaluations: Evaluation[];
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Changed from required: true
  profilePicture: { type: String, default: 'default.jpg' },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  evaluations: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
});

export default mongoose.model<UserDocument>('User', UserSchema);
