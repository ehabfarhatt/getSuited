import { controller, httpGet } from 'inversify-express-utils';
import passport from 'passport';
import express from 'express';
import jwt from 'jsonwebtoken';

@controller('/auth')
export class GoogleAuthController {
  @httpGet('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  public initiateOAuth(): void {
    // Handled by passport middleware
  }

  @httpGet('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }))
  public handleCallback(req: express.Request, res: express.Response): void {
    const user = req.user as any;
    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
}