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
        User Execution Time: {results.userResults.executionTime}ms
      </div>
      <div className="result-user">
        User Output: {results.userResults.output}
      </div>
      <div className="result-user">
        User Passed: {results.userResults.passed ? "Yes" : "No"}
      </div>
      <div className="result-ai">
        AI Execution Time: {results.aiResults.executionTime}ms
      </div>
      <div className="result-ai">AI Output: {results.aiResults.output}</div>
      <div className="result-ai">
        AI Passed: {results.aiResults.passed ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default ResultsDisplay;
