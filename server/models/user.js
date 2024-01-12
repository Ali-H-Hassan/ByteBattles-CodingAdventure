const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  profilePictureUrl: {
    type: String,
    default: "",
  },
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
    required: function () {
      return !this.googleId;
    },
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

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return true;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
