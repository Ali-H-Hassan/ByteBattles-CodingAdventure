import React, { useState } from "react";
import MCQQuestion from "../../components/MCQQuestion/MCQQuestion";
import ProgrammingQuestion from "../../components/ProgrammingQuestion/ProgrammingQuestion";
import TestSidebar from "../../components/TestSidebar/TestSidebar";
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
  const [currentSection, setCurrentSection] = useState("mcq"); // Added state for current section

  const handleOptionSelect = (event) => {
    console.log(event.target.value);
  };

  const handleSelectSection = (section) => {
    // Navigation function
    setCurrentSection(section);
  };

  const renderSection = () => {
    // Function to render sections based on the current state
    switch (currentSection) {
      case "mcq":
        return dummyMCQQuestions.map((mcq, index) => (
          <MCQQuestion
            key={index}
            question={mcq.question}
            options={mcq.options}
            onOptionSelect={handleOptionSelect}
          />
        ));
      case "programming":
        return (
          <ProgrammingQuestion
            problemStatement={dummyProgrammingQuestion.problemStatement}
            starterCode={dummyProgrammingQuestion.starterCode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="test-container">
      <TestHeader timeLeft={timeLeft} />
      <TestSidebar onSelectSection={handleSelectSection} />
      <div className="test-content">{renderSection()}</div>
    </div>
  );
};

export default Test;
