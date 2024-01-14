import React from "react";
import "./ResultsDisplay.css";

const ResultsDisplay = ({ results }) => {
  return (
    <div className="results-display-container">
      <h3>Results</h3>
      <div className="result-user">
        User Efficiency: {results.user.efficiency}%
      </div>
      <div className="result-user">User Run Time: {results.user.runTime}</div>
      <div className="result-ai">AI Efficiency: {results.ai.efficiency}%</div>
      <div className="result-ai">AI Run Time: {results.ai.runTime}</div>
    </div>
  );
};

export default ResultsDisplay;
