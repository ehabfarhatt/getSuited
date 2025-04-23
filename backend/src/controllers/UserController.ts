import { Request, Response } from 'express';
import {
  controller, httpPost, httpGet, httpPatch, request, response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import UserService from '../services/UserService';
import { authenticateJWT } from '../middleware/AuthMiddleware';
import upload from '../middleware/uploadMiddleware';

@controller('/users')
export default class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
  ) {}

  /* ----------  Create ---------- */
  @httpPost('/register')
  async createUser(@request() req: Request, @response() res: Response) {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({
        message: 'User created',
        user: { id: newUser._id, name: newUser.name },
      });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }

  /* ----------  Read ---------- */
  @httpGet('/')
  async getAll(@response() res: Response) {
    res.json(await this.userService.getAllUsers());
  }

  @httpGet('/:id')
  async getById(@request() req: Request, @response() res: Response) {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }

  /* ----------  Update score ---------- */
  @httpPatch('/:id/score', authenticateJWT)
  async updateScore(@request() req: Request, @response() res: Response) {
    const { score } = req.body;
    const user = await this.userService.updateUserScore(req.params.id, score);
    res.json(user);
  }

  /* ----------  Update name ---------- */
  @httpPatch('/:id/name', authenticateJWT)
  async updateName(@request() req: Request, @response() res: Response) {
    const { name } = req.body;
    const user = await this.userService.updateUserName(req.params.id, name);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Name updated', user });
  }

 /* ----------  Update profile pic (AWS S3) ---------- */
@httpPatch('/:id/profilePicture', authenticateJWT, upload.single('profilePicture'))
async updatePic(@request() req: Request, @response() res: Response) {
  try {
    if (!req.file) {
      console.warn('⚠️ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = (req.file as any).location; // AWS S3 public URL provided by multer-s3

    const user = await this.userService.updateProfilePicture(req.params.id, imageUrl);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ message: 'Picture updated successfully', user });
  } catch (err: any) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}

}