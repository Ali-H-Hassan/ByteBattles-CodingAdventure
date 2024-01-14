import React from "react";
import "./ProblemStatement.css";

const ProblemStatement = () => {
  const problemText = "Solve the following problem..."; // Replace with actual problem text

  return (
    <div>
      <h2>Problem Statement</h2>
      <p>{problemText}</p>
      {/* Include more details about the problem, constraints, etc. */}
    </div>
  );
};

export default ProblemStatement;
