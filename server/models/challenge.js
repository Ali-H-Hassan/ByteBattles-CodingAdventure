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
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  templateCode: {
    type: Map,
    of: String,
    required: true,
  },
  testCases: [
    {
      input: {
        type: [mongoose.Schema.Types.Mixed],
        required: true,
      },
      output: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
