import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export default function (passport) {
  // Use environment-based callback URL
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://tutor-finder-five-ebon.vercel.app/api/auth/google/callback'
      : 'http://localhost:5001/api/auth/google/callback');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const email = profile.emails[0].value;
          const name = profile.displayName;
          const googleId = profile.id;
          const profilePicture = profile.photos[0]?.value;

          // Check if user already exists with this email
          let user = await User.findOne({ email });

          if (user) {
            // User already exists - allow login
            if (!user.googleId) {
              // Link Google account to existing user
              user.googleId = googleId;
              if (profilePicture && !user.profilePicture) {
                user.profilePicture = profilePicture;
              }
              await user.save();
            }
            return done(null, user);
          } else {
            // New user - don't create yet, pass Google data for profile setup
            // Return a special object indicating incomplete registration
            return done(null, {
              isNewUser: true,
              googleData: {
                name,
                email,
                googleId,
                profilePicture,
              },
            });
          }
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );

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
}
