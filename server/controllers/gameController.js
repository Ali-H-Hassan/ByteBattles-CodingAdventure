const Course = require("../models/course");
const User = require("../models/user");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching courses",
      error: error.message,
    });
  }
};

exports.submitScore = async (req, res) => {
  try {
    const { userId, score } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof score === "number" && score > user.highScore) {
      user.highScore = score;
      await user.save();
    }

    res.json({ highScore: user.highScore });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while submitting score",
      error: error.message,
    });
  }
};
