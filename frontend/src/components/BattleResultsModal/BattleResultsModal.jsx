import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrophy, faUser, faRobot, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./BattleResultsModal.css";

const BattleResultsModal = ({ results, onClose }) => {
  if (!results || !results.userResults || !results.aiResults) {
    return null;
  }

  const winnerClass = results.winner === "user" ? "winner-user" : "winner-ai";
  const winnerText = results.winner === "user" ? "You Win!" : "AI Wins!";
  const winnerIcon = results.winner === "user" ? faTrophy : faRobot;

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

        <div className="battle-results-comparison">
          <div className="battle-result-card battle-result-user">
            <div className="battle-result-card-header">
              <FontAwesomeIcon icon={faUser} className="battle-result-icon" />
              <h3>Your Results</h3>
            </div>
            <div className="battle-result-card-content">
              <div className="battle-result-item">
                <span className="battle-result-label">Execution Time:</span>
                <span className="battle-result-value">{results.userResults.executionTime}ms</span>
              </div>
              <div className="battle-result-item">
                <span className="battle-result-label">Output:</span>
                <span className="battle-result-value">{results.userResults.output || "N/A"}</span>
              </div>
              <div className="battle-result-item">
                <span className="battle-result-label">Status:</span>
                <span className={`battle-result-status ${results.userResults.passed ? "passed" : "failed"}`}>
                  <FontAwesomeIcon 
                    icon={results.userResults.passed ? faCheckCircle : faTimesCircle} 
                    style={{ marginRight: "0.5rem" }}
                  />
                  {results.userResults.passed ? "Passed" : "Failed"}
                </span>
              </div>
            </div>
          </div>

          <div className="battle-result-card battle-result-ai">
            <div className="battle-result-card-header">
              <FontAwesomeIcon icon={faRobot} className="battle-result-icon" />
              <h3>AI Results</h3>
            </div>
            <div className="battle-result-card-content">
              <div className="battle-result-item">
                <span className="battle-result-label">Execution Time:</span>
                <span className="battle-result-value">{results.aiResults.executionTime}ms</span>
              </div>
              <div className="battle-result-item">
                <span className="battle-result-label">Output:</span>
                <span className="battle-result-value">{results.aiResults.output || "N/A"}</span>
              </div>
              <div className="battle-result-item">
                <span className="battle-result-label">Status:</span>
                <span className={`battle-result-status ${results.aiResults.passed ? "passed" : "failed"}`}>
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
            <h4>AI Feedback</h4>
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

