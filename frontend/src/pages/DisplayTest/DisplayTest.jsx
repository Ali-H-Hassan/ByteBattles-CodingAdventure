import React, { useState } from "react";
import MCQQuestion from "../../components/MCQQuestion/MCQQuestion";
import ProgrammingQuestion from "../../components/ProgrammingQuestion/ProgrammingQuestion";
import TestSidebar from "../../components/TestSidebar/TestSidebar";
import TestHeader from "../../components/TestHeader/TestHeader";
import ThankYouPage from "../../components/ThankYouPage/ThankYouPage";

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
  const [currentSection, setCurrentSection] = useState("mcq");
  const [testSubmitted, setTestSubmitted] = useState(false);
  const handleOptionSelect = (event) => {
    console.log(event.target.value);
  };

  const handleSelectSection = (section) => {
    setCurrentSection(section);
  };
  const handleSubmitTest = () => {
    setTestSubmitted(true);
  };
  const renderSection = () => {
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
            onTestSubmit={handleSubmitTest}
          />
        );
      default:
        return null;
    }
  };
  if (testSubmitted) {
    return <ThankYouPage />;
  }
  return (
    <div className="test-container">
      <TestHeader timeLeft={timeLeft} />
      <div className="test-display-flex-container">
        <TestSidebar onSelectSection={handleSelectSection} />
        <div className="test-display-container">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Test;
