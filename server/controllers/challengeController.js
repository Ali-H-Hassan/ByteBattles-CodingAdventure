const Challenge = require("../models/challenge");

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRandomChallenge = async (req, res) => {
  try {
    const count = await Challenge.countDocuments();
    const random = Math.floor(Math.random() * count);
    const challenge = await Challenge.findOne().skip(random);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (challenge == null) {
      return res.status(404).json({ message: "Cannot find challenge" });
    }
    res.json(challenge);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createChallenge = async (req, res) => {
  const { title, description, difficulty, templateCode, testCases } = req.body;
  const challenge = new Challenge({
    title,
    description,
    difficulty,
    templateCode,
    testCases,
  });

  try {
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateChallenge = async (req, res) => {
  const { title, description, difficulty, templateCode, testCases } = req.body;
  let challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({ message: "Challenge not found" });
  }

  challenge.title = title ?? challenge.title;
  challenge.description = description ?? challenge.description;
  challenge.difficulty = difficulty ?? challenge.difficulty;
  challenge.templateCode = templateCode ?? challenge.templateCode;
  challenge.testCases = testCases ?? challenge.testCases;

  try {
    const updatedChallenge = await challenge.save();
    res.json(updatedChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const result = await Challenge.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.json({ message: "Deleted Challenge" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllChallenges,
  getRandomChallenge,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};
