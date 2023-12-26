require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./middlewares/googleStrategy");
const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const authRoutes = require("./routes/auth");
require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Session and Passport middleware should be initialized before defining any routes
app.use(
  session({
    secret: process.env.JWT_SECRET, // Use the secret from your environment variables
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Define routes after middleware
app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);
app.use("/api/auth", authRoutes); // If you want to keep this endpoint
app.use("/auth", authRoutes); // This should match the callback URL base path

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
