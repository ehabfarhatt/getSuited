import { Request, Response } from 'express';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import 'reflect-metadata';
import AuthService from '../services/AuthService';
import TYPES from '../config/types';

@controller('/auth')
export default class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

    @httpPost('/register')
    async register(@request() req: Request, @response() res: Response) {
        try {
            const { name, email, password, profilePicture } = req.body;
            const user = await this.authService.register(name, email, password, profilePicture);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpPost('/login')
    async login(@request() req: Request, @response() res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.authService.login(email, password);
            res.status(200).json({ message: 'Login successful', user, token });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    @httpPost('/verify')
    async verifyToken(@request() req: Request, @response() res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) throw new Error('Token missing');

            const token = authHeader.split(' ')[1];
            const decoded = await this.authService.verifyToken(token);
            res.json({ valid: true, decoded });
        } catch (error) {
            res.status(401).json({ valid: false, error: (error as Error).message });
        }
    }
}