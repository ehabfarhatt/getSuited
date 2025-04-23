import passport from 'passport';
import { Strategy as GoogleStrategy, StrategyOptions } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User'; // Adjust path as needed

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
  try {
    const email = profile.emails?.[0].value;
    const name = profile.displayName;
    const profilePicture = profile.photos?.[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: 'google-auth',
        profilePicture,
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
