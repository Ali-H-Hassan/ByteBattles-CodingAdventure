const express = require("express");
const app = express();

const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");
const authRoutes = require("./routes/auth");

require("./db");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
