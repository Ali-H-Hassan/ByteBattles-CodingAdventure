require("dotenv").config({ path: ".././" });
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/oauth2callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here, you will typically search for the user in your database by their Google ID
      // If the user doesn't exist, create a new one using data from profile
      // Then, call done(null, user) with the user's information
      const user = await YourUserModel.findOrCreate({ googleId: profile.id });
      done(null, user);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await YourUserModel.findById(id);
  done(null, user);
});

module.exports = passport;
