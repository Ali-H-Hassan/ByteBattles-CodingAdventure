const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["mcq", "coding"],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  templateCode: String,
  testCases: [
    {
      input: [mongoose.Schema.Types.Mixed],
      output: mongoose.Schema.Types.Mixed,
    },
  ],
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  questions: [questionSchema],
  timeLimit: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
