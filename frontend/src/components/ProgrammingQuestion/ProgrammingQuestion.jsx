import React from "react";
import "./ProgrammingQuestion.css";

const ProgrammingQuestion = ({ problemStatement, starterCode }) => {
  return (
    <div className="programming-container">
      <div className="problem-statement">{problemStatement}</div>
      <textarea className="code-editor" defaultValue={starterCode}></textarea>
      <button className="submit-button">Submit Test</button>
    </div>
  );
};

export default ProgrammingQuestion;
