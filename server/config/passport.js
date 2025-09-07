const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

module.exports = function(passport) {
  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select('-passwordHash');
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // User exists, generate token and return
        const token = generateToken(user._id);
        return done(null, { user, token });
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        await user.save();
        const token = generateToken(user._id);
        return done(null, { user, token });
      }

      // Create new user
      const newUser = await User.create({
        googleId: profile.id,
        username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        email: profile.emails[0].value,
        profile: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos[0].value
        },
        isVerified: true,
        ageVerified: false // Still need age verification
      });

      const token = generateToken(newUser._id);
      return done(null, { user: newUser, token });

    } catch (error) {
      return done(error, null);
    }
  }));

  // Twitter OAuth Strategy
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/api/auth/twitter/callback',
    includeEmail: true
  }, async (token, tokenSecret, profile, done) => {
    try {
      // Check if user already exists with Twitter ID
      let user = await User.findOne({ twitterId: profile.id });

      if (user) {
        // User exists, generate token and return
        const authToken = generateToken(user._id);
        return done(null, { user, token: authToken });
      }

      // Check if user exists with same email (if email provided)
      if (profile.emails && profile.emails[0]) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Twitter account to existing user
          user.twitterId = profile.id;
          await user.save();
          const authToken = generateToken(user._id);
          return done(null, { user, token: authToken });
        }
      }

      // Create new user
      const newUser = await User.create({
        twitterId: profile.id,
        username: profile.username || profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        email: profile.emails ? profile.emails[0].value : null,
        profile: {
          firstName: profile.displayName.split(' ')[0],
          lastName: profile.displayName.split(' ').slice(1).join(' '),
          avatar: profile.photos[0].value
        },
        isVerified: true,
        ageVerified: false // Still need age verification
      });

      const authToken = generateToken(newUser._id);
      return done(null, { user: newUser, token: authToken });

    } catch (error) {
      return done(error, null);
    }
  }));
};