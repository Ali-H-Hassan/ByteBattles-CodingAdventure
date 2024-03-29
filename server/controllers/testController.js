const Test = require("../models/test");
const mongoose = require("mongoose");
exports.createTest = async (req, res) => {
  try {
    const newTest = new Test(req.body);
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    console.error("Error in createTest:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();
    console.log("Fetched tests:", tests);
    res.status(200).json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(404).json({ message: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTestById = async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTest)
      return res.status(404).json({ message: "Test not found" });
    res.status(200).json(updatedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getTestsByCompanyId = async (req, res) => {
  try {
    const companyTests = await Test.find({
      createdBy: req.query.companyId.trim(),
    });
    res.status(200).json(companyTests);
  } catch (error) {
    console.error("Error fetching company tests:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTestById = async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    if (!deletedTest)
      return res.status(404).json({ message: "Test not found" });
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
