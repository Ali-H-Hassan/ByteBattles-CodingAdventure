import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrophy, faUser, faRobot, faCheckCircle, faTimesCircle, faCode } from "@fortawesome/free-solid-svg-icons";
import "./BattleResultsModal.css";

const BattleResultsModal = ({ results, userCode, onClose }) => {
  if (!results || !results.userResults || !results.aiResults) {
    return null;
  }

  const winnerClass = results.winner === "user" ? "winner-user" : results.winner === "ai" ? "winner-ai" : "winner-tie";
  const winnerText = results.winner === "user" ? "You Win!" : results.winner === "ai" ? "AI Wins!" : "It's a Tie!";
  const winnerIcon = results.winner === "user" ? faTrophy : results.winner === "ai" ? faRobot : faTrophy;

  return (
    <div className="battle-results-modal-overlay" onClick={onClose}>
      <div className="battle-results-modal" onClick={(e) => e.stopPropagation()}>
        <button className="battle-results-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="battle-results-modal-header">
          <FontAwesomeIcon icon={winnerIcon} className={`battle-results-winner-icon ${winnerClass}`} />
          <h2 className={`battle-results-winner-text ${winnerClass}`}>{winnerText}</h2>
        </div>

        <div className="battle-results-comparison-grid">
          {/* User Code Section */}
          <div className="battle-code-section battle-code-user">
            <div className="battle-code-header">
              <FontAwesomeIcon icon={faUser} className="battle-code-icon" />
              <h3>Your Solution</h3>
            </div>
            <div className="battle-code-container">
              <pre className="battle-code-display">
                <code>{userCode || "No code submitted"}</code>
              </pre>
            </div>
            <div className="battle-stats-container">
              <div className="battle-stat-item">
                <span className="battle-stat-label">Execution Time:</span>
                <span className="battle-stat-value">{results.userResults.executionTime}ms</span>
              </div>
              <div className="battle-stat-item">
                <span className="battle-stat-label">Output:</span>
                <span className="battle-stat-value">{results.userResults.output || "N/A"}</span>
              </div>
              <div className="battle-stat-item">
                <span className="battle-stat-label">Status:</span>
                <span className={`battle-stat-status ${results.userResults.passed ? "passed" : "failed"}`}>
                  <FontAwesomeIcon 
                    icon={results.userResults.passed ? faCheckCircle : faTimesCircle} 
                    style={{ marginRight: "0.5rem" }}
                  />
                  {results.userResults.passed ? "Passed" : "Failed"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Code Section */}
          <div className="battle-code-section battle-code-ai">
            <div className="battle-code-header">
              <FontAwesomeIcon icon={faRobot} className="battle-code-icon" />
              <h3>AI Solution</h3>
            </div>
            <div className="battle-code-container">
              <pre className="battle-code-display">
                <code>{results.aiSolutionCode || "/* AI solution not available */"}</code>
              </pre>
            </div>
            <div className="battle-stats-container">
              <div className="battle-stat-item">
                <span className="battle-stat-label">Execution Time:</span>
                <span className="battle-stat-value">{results.aiResults.executionTime}ms</span>
              </div>
              <div className="battle-stat-item">
                <span className="battle-stat-label">Output:</span>
                <span className="battle-stat-value">{results.aiResults.output || "N/A"}</span>
              </div>
              <div className="battle-stat-item">
                <span className="battle-stat-label">Status:</span>
                <span className={`battle-stat-status ${results.aiResults.passed ? "passed" : "failed"}`}>
                  <FontAwesomeIcon 
                    icon={results.aiResults.passed ? faCheckCircle : faTimesCircle} 
                    style={{ marginRight: "0.5rem" }}
                  />
                  {results.aiResults.passed ? "Passed" : "Failed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {results.aiFeedback && (
          <div className="battle-results-feedback">
            <h4>AI Feedback on Your Code</h4>
            <p>{results.aiFeedback}</p>
          </div>
        )}

        <button className="battle-results-modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BattleResultsModal;
