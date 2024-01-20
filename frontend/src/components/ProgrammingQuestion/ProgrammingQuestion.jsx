import React from "react";
import CodingEditor from "../CodingEditor/CodingEditor";
import "./ProgrammingQuestion.css";

const ProgrammingQuestion = ({
  problemStatement,
  starterCode,
  handleCodeChange,
}) => {
  return (
    <div className="test-programming-container">
      <div className="test-problem-statement">{problemStatement}</div>
      <CodingEditor code={starterCode} handleCodeChange={handleCodeChange} />
      <button className="test-submit-button">Submit Test</button>
    </div>
  );
};

export default ProgrammingQuestion;
