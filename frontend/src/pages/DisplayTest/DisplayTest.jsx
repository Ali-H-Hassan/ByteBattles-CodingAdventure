import React from "react";
import MCQQuestion from "../../components/MCQQuestion/MCQQuestion";
import ProgrammingQuestion from "../../components/ProgrammingQuestion/ProgrammingQuestion";
import TestHeader from "../../components/TestHeader/TestHeader";
import "./DisplayTest.css";

const dummyMCQQuestions = [
  {
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Tokyo"],
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "22", "None of the above"],
  },
];
const timeLeft = "00:20:30";
const dummyProgrammingQuestion = {
  problemStatement: "Write a function to reverse a string.",
  starterCode:
    "// Your starter code here\nfunction reverseString(str) {\n  // Code\n}",
};

const Test = () => {
  const handleOptionSelect = (event) => {
    console.log(event.target.value);
  };

  return (
    <div className="test-container">
      <TestHeader timeLeft={timeLeft} />
      <div className="test-mcq-section">
        {dummyMCQQuestions.map((mcq, index) => (
          <MCQQuestion
            key={index}
            question={mcq.question}
            options={mcq.options}
            onOptionSelect={handleOptionSelect}
          />
        ))}
      </div>
      <div className="test-programming-section">
        <ProgrammingQuestion
          problemStatement={dummyProgrammingQuestion.problemStatement}
          starterCode={dummyProgrammingQuestion.starterCode}
        />
      </div>
    </div>
  );
};

export default Test;
