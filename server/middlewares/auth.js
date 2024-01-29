const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).send({ error: "Please authenticate." });
  }
};

const authorize = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "Please authenticate." });
  }

  if (!req.user.roles.includes(role)) {
    return res
      .status(403)
      .send({ error: "Access denied. Insufficient permissions." });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
};
