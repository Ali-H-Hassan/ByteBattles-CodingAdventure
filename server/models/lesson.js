const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  // You can also add a property for hints used, attempts made, or time taken
  hintsUsed: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: Number, // could be in seconds or any other unit you choose
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updated_at' field on save
lessonSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Lesson", lessonSchema);
