import { Request, Response } from 'express';
import { controller, httpPost, httpGet, httpPatch, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import UserService from '../services/UserService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/users')
export default class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @httpPost('/register')
    public async createUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const newUser = await this.userService.createUser(req.body);
            res.status(201).json({message: 'User Created Successfully', user: {id: newUser._id, name: newUser.name}});
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/')
    public async getAllUsers(@response() res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/:id')
    public async getUserById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpPatch('/:id/score', authenticateJWT)
    public async updateUserScore(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { score } = req.body;
            const user = await this.userService.updateUserScore(req.params.id, score);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpPatch('/:id/profilePicture', authenticateJWT)
    public async updateProfilePicture(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { profilePicture } = req.body;
            const user = await this.userService.updateProfilePicture(req.params.id, profilePicture);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}