const express = require("express");
const router = express.Router();
const Challenge = require("../models/challenge");

//Read all
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Read by ID
router.get("/:id", getChallenge, (req, res) => {
  res.json(res.challenge);
});

//Create
router.post("/", async (req, res) => {
  const challenge = new Challenge({});

  try {
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Update
router.patch("/:id", getChallenge, async (req, res) => {
  try {
    const updatedChallenge = await res.challenge.save();
    res.json(updatedChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete
router.delete("/:id", getChallenge, async (req, res) => {
  try {
    await res.challenge.remove();
    res.json({ message: "Deleted Challenge" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getChallenge(req, res, next) {
  let challenge;
  try {
    challenge = await Challenge.findById(req.params.id);
    if (challenge == null) {
      return res.status(404).json({ message: "Cannot find challenge" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.challenge = challenge;
  next();
}

module.exports = router;
