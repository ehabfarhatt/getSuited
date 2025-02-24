import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import AuthService from '../services/AuthService';
import TYPES from '../config/types';

@injectable()
class AuthController {
    private authService: AuthService;

    constructor(@inject(TYPES.AuthService) authService: AuthService) {
        this.authService = authService;
    }

    async register(req: Request, res: Response) {
        try {
            const { name, email, password, profilePicture } = req.body;
            const user = await this.authService.register(name, email, password, profilePicture);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.authService.login(email, password);
            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}

export default AuthController;