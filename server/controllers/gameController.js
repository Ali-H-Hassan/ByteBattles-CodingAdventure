const Course = require("../models/course");
const Lesson = require("../models/lesson");

exports.getCourses = async (req, res) => {
  const courses = await Course.find().populate("lessons");
  res.json(courses);
};

exports.submitScore = async (req, res) => {
  try {
    const { userId, score } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }

    res.json({ highScore: user.highScore });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
