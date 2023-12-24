const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const challengeRoutes = require("./routes/challenges");

require("./db");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);
