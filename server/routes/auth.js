const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register
router.post("/register", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already registered.");
    }

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password.");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
