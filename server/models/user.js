const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true, // Ensure no two users have the same Google ID
    sparse: true, // Sparse indexing will make sure the index only applies to documents with the googleId field
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
    }, // Make password required only if googleId is not present
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

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });

// Modify the comparePassword method to ensure it doesn't get called if there's no password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Return true if no password is set (Google user)
  if (!this.password) return true;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
