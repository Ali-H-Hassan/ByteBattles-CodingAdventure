const User = require("../models/user");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;

    await User.findByIdAndUpdate(userId, updatedData);

    res.status(200).send("Profile updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
};
