import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import User, { UserDocument } from '../models/User';

@injectable()
export default class UserService {
  private readonly saltRounds = 10;

  /* ----------  Create ---------- */
  async createUser(data: { name: string; email: string; password: string; profilePicture?: string; }): Promise<UserDocument> {
    const hashed = await bcrypt.hash(data.password, this.saltRounds);
    return User.create({ ...data, password: hashed });
  }

  /* ----------  Read ---------- */
  getAllUsers() { 
    return User.find(); 
  }

  getUserById(id: string) { 
    return User.findById(id); 
  }

  /* ----------  Update ---------- */
  updateUserScore(id: string, score: number) {
    return User.findByIdAndUpdate(id, { score }, { new: true });
  }

  updateUserName(id: string, name: string) {
    return User.findByIdAndUpdate(id, { name }, { new: true });
  }

  async updateProfilePicture(id: string, url: string) {
    const user = await User.findByIdAndUpdate(id, { profilePicture: url }, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
