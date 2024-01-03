const Course = require("../models/course");
const Lesson = require("../models/lesson");

exports.getCourses = async (req, res) => {
  const courses = await Course.find().populate("lessons");
  res.json(courses);
};

// Add other CRUD operations as needed
