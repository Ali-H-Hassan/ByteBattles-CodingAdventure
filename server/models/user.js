const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      enum: ["learner", "admin", "company"],
      default: "learner",
    },
  ],
  experiencePoints: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 1,
  },
  learningPath: {
    type: String,
    enum: ["Frontend", "Backend"],
  },
  courseProgress: [
    {
      courseId: mongoose.Schema.Types.ObjectId,
      progress: Number,
      lastAccessed: Date,
    },
  ],
  completedChallenges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
