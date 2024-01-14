import React from "react";
import "./ResultsDisplay.css";
const ResultsDisplay = ({ results }) => {
  return (
    <div>
      <h3>Results</h3>
      <div>User Efficiency: {results.user.efficiency}%</div>
      <div>User Run Time: {results.user.runTime}</div>
      <div>AI Efficiency: {results.ai.efficiency}%</div>
      <div>AI Run Time: {results.ai.runTime}</div>
      {/* You can add more details or a detailed comparison here */}
    </div>
  );
};

export default ResultsDisplay;
