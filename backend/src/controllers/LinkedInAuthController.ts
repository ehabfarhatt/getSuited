import { controller, httpGet } from 'inversify-express-utils';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@controller('/auth')
export class LinkedInAuthController {
  @httpGet('/linkedin', passport.authenticate('linkedin'))
  public startOAuth(): void {
    // Handled by passport middleware
  }

  @httpGet('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }))
  public linkedInCallback(req: Request, res: Response): void {
    const user = req.user as any;
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
}