const User = require("../models/user");
const fs = require("fs");
const path = require("path");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;

    if (req.file) {
      updatedData.profilePictureUrl = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
