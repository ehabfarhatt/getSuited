import { injectable } from 'inversify';
import 'reflect-metadata';
import User, { UserDocument } from '../models/User';
import bcrypt from 'bcrypt';

@injectable()
export default class UserService {
    private saltRound = 10;
    async createUser(data: {name: string, email: string, password: string, profilePicture?: string}): Promise<UserDocument> {
        try{
            const hashedPass = await bcrypt.hash(data.password, this.saltRound);
            return await User.create({ ...data, password: hashedPass});
        }catch(error){
            throw new Error('Error creating user: ' + (error as Error).message);
        }
    }

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId: string) {
        return await User.findById(userId);
    }

    async updateUserScore(userId: string, score: number) {
        return await User.findByIdAndUpdate(userId, { score }, { new: true });
    }

    async updateProfilePicture(userId: string, profilePicture: string) {
        return await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });
    }
}