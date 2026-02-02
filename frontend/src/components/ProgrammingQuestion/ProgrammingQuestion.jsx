import React from "react";
import CodingEditor from "../CodingEditor/CodingEditor";
import "./ProgrammingQuestion.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faCode } from "@fortawesome/free-solid-svg-icons";

const ProgrammingQuestion = ({
  problemStatement,
  starterCode,
  handleCodeChange,
  onTestSubmit,
  onSubmitCode,
  isSubmitting = false,
  isViewOnly = false,
  testCases = [],
  isReviewMode = false,
  userCode = null,
  programmingCorrect = null,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (isSubmitting || isViewOnly) return;
    
    if (onSubmitCode) {
      try {
        await onSubmitCode();
        // Navigation will be handled by the parent component after successful submission
      } catch (error) {
        // Error is handled in parent component
        console.error("Error submitting test:", error);
      }
    } else {
      navigate("/thank-you");
    }
  };

  return (
    <div className={`test-programming-container ${isReviewMode ? 'review-mode' : ''}`}>
      {/* Review Mode Status Banner */}
      {isReviewMode && programmingCorrect !== null && (
        <div className={`programming-review-status ${programmingCorrect ? 'status-passed' : 'status-failed'}`}>
          <div className="review-status-icon">
            <FontAwesomeIcon icon={programmingCorrect ? faCheckCircle : faTimesCircle} />
          </div>
          <div className="review-status-content">
            <span className="review-status-title">
              {programmingCorrect ? 'All Test Cases Passed' : 'Test Cases Failed'}
            </span>
            <span className="review-status-subtitle">
              {programmingCorrect
                ? 'Your solution passed all the test cases successfully.'
                : 'Your solution did not pass all the test cases.'}
            </span>
          </div>
        </div>
      )}

      <div className="test-problem-statement">{problemStatement}</div>

      {/* Code Section with Label in Review Mode */}
      <div className="code-section">
        {isReviewMode && userCode && (
          <div className="code-section-header">
            <FontAwesomeIcon icon={faCode} className="code-section-icon" />
            <span>Your Submitted Code</span>
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <CodingEditor
            code={starterCode}
            handleCodeChange={handleCodeChange}
            readOnly={isViewOnly}
          />
        </div>
      </div>

      {isViewOnly && testCases.length > 0 && (
        <div className="test-cases-container">
          <h3 className="test-cases-title">Test Cases (Expected Outputs):</h3>
          {testCases.map((testCase, index) => (
            <div key={index} className="test-case-item">
              <div className="test-case-input">
                <strong>Input:</strong> <code>{testCase.input || testCase.Input}</code>
              </div>
              <div className="test-case-output">
                <strong>Expected Output:</strong> <code>{testCase.output || testCase.Output || testCase.ExpectedOutput}</code>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isViewOnly && (
        <button 
          className="test-submit-button" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </button>
      )}
    </div>
  );
};

export default ProgrammingQuestion;
