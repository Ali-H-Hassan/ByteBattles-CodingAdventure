const { Configuration, OpenAIApi } = require("openai");
const Challenge = require("../models/challenge");

// Initialize the OpenAI API client with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Placeholder function to execute code, replace with actual logic
const executeUserCode = async (code, language) => {
  // Logic to send the code to a secure execution environment
  // and return the result
  // ...
  return {
    executionTime: 100, // Mock execution time
    output: "42", // Mock output
    passed: true, // Mock pass status
  };
};

// Function to run a coding battle between user and AI
const runBattle = async (req, res) => {
  const { userId, challengeId, userCode, language } = req.body;

  try {
    // Fetch the challenge from the database
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Generate AI code using OpenAI's Codex
    const response = await openai.createCompletion({
      model: "code-davinci-002", // Replace with the latest model
      prompt: challenge.description, // The prompt should be the challenge description
      temperature: 0, // Controls randomness, set to 0 for deterministic output
      max_tokens: 150, // Maximum length of the generated code
    });

    const aiCode = response.data.choices[0].text;

    // Execute the user's code
    const userResults = await executeUserCode(userCode, language);

    // Execute the AI's code
    const aiResults = await executeUserCode(aiCode, language);

    // Determine the winner based on execution time
    const winner =
      userResults.executionTime < aiResults.executionTime ? "user" : "ai";

    res.json({
      winner,
      userResults,
      aiResults,
      aiCode, // Optionally send back the AI's code
    });
  } catch (error) {
    res.status(500).json({ message: "Error running the battle", error });
  }
};

module.exports = {
  runBattle,
};
