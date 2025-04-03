import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { UserDocument } from '../models/User';

dotenv.config();

@injectable()
class AuthService {
    async register(name: string, email: string, password: string, profilePicture?: string) {
        const existing = await User.findOne({ email });
        if (existing) throw new Error('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, profilePicture });
        return await user.save();
    }

    async login(email: string, password: string): Promise<{ user: Partial<UserDocument>, token: string }> {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
          );

        // sanitize password
        const { password: _, ...safeUser } = user.toObject();
        return { user: safeUser, token };
    }

    async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            return decoded;
        } catch (err) {
            throw new Error('Invalid or expired token');
        }
    }
}

export default AuthService;