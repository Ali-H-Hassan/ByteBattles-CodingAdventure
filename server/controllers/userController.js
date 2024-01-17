const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const bcryptSaltRounds = 8;
const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already registered.");
    }

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send("Error during registration: " + error.message);
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const isMatch = req.body.password === user.password;
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).send("Invalid email or password.");
    }

    const token = jwt.sign(
      { _id: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.send({ user: { ...user.toObject(), token, userType: user.userType } });
  } catch (error) {
    res.status(500).send("Error during login: " + error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = await bcrypt.hash(req.body.password, 8);
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createCompanyUser = async (req, res) => {
  const {
    username,
    email,
    password,
    companyName,
    companyAddress,
    companyContactNumber,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);

    const companyUser = new User({
      userType: "company",
      username,
      email,
      password: hashedPassword,
      companyName,
      companyAddress,
      companyContactNumber,
      roles: ["company"],
    });

    await companyUser.save();
    const token = jwt.sign({ _id: companyUser._id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(201).json({ companyUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating company user", error: error.message });
  }
};

const createChallenge = async (req, res) => {
  const { title, description, difficulty, templateCode, testCases } = req.body;

  try {
    const challenge = new Challenge({
      title,
      description,
      difficulty,
      templateCode,
      testCases,
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating challenge", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createChallenge,
  createCompanyUser,
};
