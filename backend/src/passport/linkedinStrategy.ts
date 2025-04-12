import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID || '',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
  callbackURL: '/auth/linkedin/callback',
  scope: ['r_liteprofile', 'r_emailaddress'],
}, async (_accessToken, _refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0].value,
    profilePicture: profile.photos?.[0]?.value,
  };

  return done(null, user);
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});