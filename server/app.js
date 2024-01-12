require("dotenv").config();
const express = require("express");
const session = require("express-session");
const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const oauthRouter = require("./routes/oauth");
const requestRouter = require("./routes/request");
require("./db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const gameRoutes = require("./routes/game");

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/profile", profileRoutes);
app.use("/request", requestRouter);
app.get("/auth/google/callback", oauthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
