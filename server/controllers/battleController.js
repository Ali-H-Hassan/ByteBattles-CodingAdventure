const { GoogleGenerativeAI } = require("@google/generative-ai");
const Challenge = require("../models/challenge");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const executeUserCode = async (code, language) => {
  return {
    executionTime: 100,
    output: "42",
    passed: true,
  };
};

const runBattle = async (req, res) => {
  const { userId, challengeId, userCode, language } = req.body;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = challenge.description;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiCode = response.text();

    const userResults = await executeUserCode(userCode, language);
    const aiResults = await executeUserCode(aiCode, language);

    const winner =
      userResults.executionTime < aiResults.executionTime ? "user" : "ai";

    res.json({
      winner,
      userResults,
      aiResults,
      aiCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error running the battle",
      error: error.message,
    });
  }
};

module.exports = {
  runBattle,
};
