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
  type: {
    type: String,
    enum: ["mcq", "coding"],
    required: true,
  },
  templateCode: {
    type: Map,
    of: String,
    required: function () {
      return this.type === "coding";
    }, // Only required for coding questions
  },
  testCases: [
    {
      input: {
        type: [mongoose.Schema.Types.Mixed],
        required: function () {
          return this.type === "coding";
        }, // Only required for coding questions
      },
      output: {
        type: mongoose.Schema.Types.Mixed,
        required: function () {
          return this.type === "coding";
        }, // Only required for coding questions
      },
    },
  ],
  mcqOptions: {
    type: [
      {
        option: String,
        isCorrect: Boolean,
      },
    ],
    required: function () {
      return this.type === "mcq";
    }, // Only required for MCQ questions
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
