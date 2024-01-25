import React from "react";
import "./ProblemStatement.css";

const ProblemStatement = ({ challenge }) => {
  return (
    <div className="problem-statement-container">
      <h2>Problem Statement</h2>
      <p>{challenge.title}</p>
      <p>{challenge.description}</p>
    </div>
  );
};

export default ProblemStatement;
