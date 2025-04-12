import passport from 'passport';
import { Strategy as GoogleStrategy, StrategyOptions } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();

const options: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback',
};

passport.use(new GoogleStrategy(options, async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0].value,
    profilePicture: profile.photos?.[0].value,
  };

  return done(null, user);
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});