const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: String,
  templateCode: {
    type: Map,
    of: String,
  },
  testCases: [
    {
      input: [mongoose.Schema.Types.Mixed],
      output: mongoose.Schema.Types.Mixed,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
