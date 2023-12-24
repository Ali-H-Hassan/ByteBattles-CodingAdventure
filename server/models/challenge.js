const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  difficultyLevel: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
  },
  type: {
    type: String,
    enum: ["Coding", "Quiz"],
  },
  relatedConcepts: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
