const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { ORGANIZER_EMAILS } = require('./organizers');
const config = require('../config');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.profilePicture = profile.photos[0]?.value || '';
      await user.save();
      return done(null, user);
    }

    // Create new user
    const email = profile.emails[0].value.toLowerCase();
    const isOrganizer = ORGANIZER_EMAILS.includes(email);
    
    user = new User({
      googleId: profile.id,
      email: email,
      name: profile.displayName,
      profilePicture: profile.photos[0]?.value || '',
      isOrganizer: isOrganizer,
      clubName: isOrganizer ? 'Default Club' : undefined, // Will need to be updated by organizer
      userId: isOrganizer ? undefined : `USR_${Date.now()}` // Auto-generate user ID
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
