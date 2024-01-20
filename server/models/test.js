const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const mcqQuestionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema],
});

const programmingQuestionSchema = new mongoose.Schema({
  questionText: String,
  starterCode: String,
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
});

const testSchema = new mongoose.Schema({
  title: String,
  mcqQuestions: [mcqQuestionSchema],
  programmingQuestion: programmingQuestionSchema,
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
