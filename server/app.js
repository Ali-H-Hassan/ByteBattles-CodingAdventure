require("dotenv").config();
const express = require("express");
const session = require("express-session");
const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const oauthRouter = require("./routes/oauth");
const requestRouter = require("./routes/request");
const battleRoutes = require("./routes/battle");
const testRoutes = require("./routes/testRoutes");
require("./db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const gameRoutes = require("./routes/game");

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/profile", profileRoutes);
app.use("/request", requestRouter);
app.use("/api/battle", battleRoutes);
app.get("/auth/google/callback", oauthRouter);
app.use("/api/tests", testRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to my application");
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
