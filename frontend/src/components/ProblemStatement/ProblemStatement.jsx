import React from "react";
import "./ProblemStatement.css";

const ProblemStatement = () => {
  const problemText = "Solve the following problem...";
  return (
    <div className="problem-statement-container">
      <h2>Problem Statement</h2>
      <p>{problemText}</p>
    </div>
  );
};

export default ProblemStatement;
