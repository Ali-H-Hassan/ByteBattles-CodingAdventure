const Challenge = require("../models/challenge");

// Get All Challenges
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Challenge By ID
const getChallengeById = async (req, res, next, id) => {
  try {
    const challenge = await Challenge.findById(id);
    if (challenge == null) {
      return res.status(404).json({ message: "Cannot find challenge" });
    }
    res.challenge = challenge;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Create Challenge
const createChallenge = async (req, res) => {
  const challenge = new Challenge({
    title: req.body.title,
    description: req.body.description,
    difficultyLevel: req.body.difficultyLevel,
    type: req.body.type,
    relatedConcepts: req.body.relatedConcepts,
  });

  try {
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Challenge
const updateChallenge = async (req, res) => {
  if (req.body.title != null) {
    res.challenge.title = req.body.title;
  }
  // ... more fields ...

  try {
    const updatedChallenge = await res.challenge.save();
    res.json(updatedChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Challenge
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
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};
