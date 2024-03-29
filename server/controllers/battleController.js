const Challenge = require("../models/challenge");
const vm = require("vm");
const now = require("performance-now");
const { generateText } = require("./geminiController");

const executeUserCode = async (code, input) => {
  if (!code) {
    return {
      executionTime: 0,
      output: "No code provided",
      passed: false,
    };
  }

  try {
    const sandbox = {
      reverseString: (str) => str.split("").reverse().join(""),
    };
    const context = new vm.createContext(sandbox);

    const script = new vm.Script(code);

    const start = now();
    script.runInContext(context);
    const end = now();
    const executionTime = (end - start).toFixed(2);
    const result = sandbox.reverseString(input);

    const isCorrect =
      typeof result === "string" &&
      result === input.split("").reverse().join("");

    return {
      executionTime: parseFloat(executionTime),
      output: isCorrect ? "Correct" : "Incorrect",
      passed: isCorrect,
    };
  } catch (error) {
    return {
      executionTime: 0,
      output: error.message,
      passed: false,
    };
  }
};

const runBattle = async (req, res) => {
  const { userId, challengeId, userCode, language } = req.body;
  const input = "Hello";

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const userResults = await executeUserCode(userCode, input);
    const aiResults = await executeUserCode("/* AI code here */", input);

    let aiFeedback;
    if (!userCode.trim()) {
      aiFeedback =
        "No user code was provided. Please write your code solution.";
    } else {
      aiFeedback = await generateText(
        "Analyze this JavaScript code: " + userCode
      );
    }

    let winner;
    if (!userResults.passed) {
      winner = "ai";
    } else {
      winner =
        userResults.executionTime < aiResults.executionTime ? "user" : "ai";
    }

    res.json({
      winner,
      userResults,
      aiResults,
      aiFeedback: aiFeedback,
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
  executeUserCode,
};
