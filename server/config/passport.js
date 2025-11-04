import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ===== GOOGLE =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let existingUser = await User.findOne({ providerId: profile.id });
      if (!existingUser) {
        existingUser = await User.create({
          provider: "google",
          providerId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || "",
          photo: profile.photos?.[0]?.value || "",
        });
      }
      return done(null, existingUser);
    }
  )
);

// ===== FACEBOOK =====
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FB_APP_ID,
//       clientSecret: process.env.FB_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       let existingUser = await User.findOne({ providerId: profile.id });
//       if (!existingUser) {
//         existingUser = await User.create({
//           provider: "facebook",
//           providerId: profile.id,
//           name: profile.displayName,
//           email: profile.emails?.[0]?.value || "",
//           photo: profile.photos?.[0]?.value || "",
//         });
//       }
//       return done(null, existingUser);
//     }
//   )
// );

// ===== GITHUB =====
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let existingUser = await User.findOne({ providerId: profile.id });
      if (!existingUser) {
        existingUser = await User.create({
          provider: "github",
          providerId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || "",
          photo: profile.photos?.[0]?.value || "",
        });
      }
      return done(null, existingUser);
    }
  )
);

export default passport;
