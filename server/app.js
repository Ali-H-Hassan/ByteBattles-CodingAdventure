require("dotenv").config();
const express = require("express");
const session = require("express-session");
const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const authRoutes = require("./routes/auth");
const oauthRouter = require("./routes/oauth");
const requestRouter = require("./routes/request");
require("./db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const gameRoutes = require("./routes/game");

app.use(express.json());
app.use(cors());

// Define routes after middleware
app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);
app.use("/api/auth", authRoutes); // If you want to keep this endpoint
app.use("/api/game", gameRoutes);
// OAuth Google callback route
app.use("/request", requestRouter); // Request route for Google Auth URL
app.get("/auth/google/callback", oauthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
