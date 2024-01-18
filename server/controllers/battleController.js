const OpenAI = require("openai").default;
const Challenge = require("../models/challenge");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: challenge.description,
      temperature: 0,
      max_tokens: 150,
    });

    if (
      !completion ||
      !completion.data ||
      !completion.data.choices ||
      completion.data.choices.length === 0
    ) {
      throw new Error("Invalid response from OpenAI API.");
    }

    const aiCode = completion.data.choices[0].text;

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
