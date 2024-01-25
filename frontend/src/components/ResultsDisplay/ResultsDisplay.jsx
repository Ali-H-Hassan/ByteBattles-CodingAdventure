import React from "react";
import "./ResultsDisplay.css";

const ResultsDisplay = ({ results }) => {
  if (!results || !results.userResults || !results.aiResults) {
    return (
      <div className="results-display-container">No results to display.</div>
    );
  }
  return (
    <div className="results-display-container">
      <h3>Results</h3>
      <div className="result-user">
        User Efficiency: {results.userResults.someProperty}%{" "}
      </div>
      <div className="result-user">
        User Run Time: {results.userResults.someOtherProperty}
      </div>
      <div className="result-ai">
        AI Efficiency: {results.aiResults.someProperty}%{" "}
      </div>
      <div className="result-ai">
        AI Run Time: {results.aiResults.someOtherProperty}
      </div>
    </div>
  );
};

export default ResultsDisplay;
