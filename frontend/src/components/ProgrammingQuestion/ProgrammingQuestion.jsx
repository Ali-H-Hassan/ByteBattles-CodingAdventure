import React from "react";
import "./ProgrammingQuestion.css";

const ProgrammingQuestion = ({ problemStatement, starterCode }) => {
  return (
    <div className="test-programming-container">
      <div className="test-problem-statement">{problemStatement}</div>
      <textarea
        className="test-code-editor"
        defaultValue={starterCode}
      ></textarea>
      <button className="test-submit-button">Submit Test</button>
    </div>
  );
};

export default ProgrammingQuestion;
