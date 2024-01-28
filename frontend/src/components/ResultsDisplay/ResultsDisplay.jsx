import React, { useState, useEffect } from "react";
import "./ResultsDisplay.css";

const ResultsDisplay = ({ results }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (results) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 3000); // Duration of the entire animation
    }
  }, [results]);

  if (!results || !results.userResults || !results.aiResults) {
    return (
      <div className="results-display-container">No results to display.</div>
    );
  }

  const winnerClass = results.winner === "user" ? "winner-user" : "winner-ai";
  const winnerText = results.winner === "user" ? "You win!" : "AI wins!";

  return (
    <div
      className={`results-display-container ${
        animate ? "animate-results" : ""
      }`}
    >
      <h3>Results</h3>
      <div className="result-section">
        <div className="result-user">
          User Execution Time: {results.userResults.executionTime}ms
        </div>
        <div className="result-user">
          User Output: {results.userResults.output}
        </div>
        <div className="result-user">
          User Passed: {results.userResults.passed ? "Yes" : "No"}
        </div>
      </div>
      <div className="result-section">
        <div className="result-ai">
          AI Execution Time: {results.aiResults.executionTime}ms
        </div>
        <div className="result-ai">AI Output: {results.aiResults.output}</div>
        <div className="result-ai">
          AI Passed: {results.aiResults.passed ? "Yes" : "No"}
        </div>
      </div>
      <div className="result-feedback">
        <h4>AI Feedback</h4>
        <p>{results.aiFeedback}</p>
      </div>
      <div className={`winner-announcement ${winnerClass}`}>{winnerText}</div>
    </div>
  );
};

export default ResultsDisplay;
