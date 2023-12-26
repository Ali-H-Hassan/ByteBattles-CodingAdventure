const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./server/middlewares/googleStrategy");
require("dotenv").config();

const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const authRoutes = require("./routes/auth");

require("./db");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);
app.use("/api/auth", authRoutes);

app.use(
  session({
    secret: "your_jwt_secret", // Replace with a real secret in .env
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
