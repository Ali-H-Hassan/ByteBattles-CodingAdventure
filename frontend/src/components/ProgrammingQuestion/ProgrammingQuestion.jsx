import React from "react";
import CodingEditor from "../CodingEditor/CodingEditor";
import "./ProgrammingQuestion.css";
import { useNavigate } from "react-router-dom";

const ProgrammingQuestion = ({
  problemStatement,
  starterCode,
  handleCodeChange,
  onTestSubmit,
  onSubmitCode,
  isSubmitting = false,
  isViewOnly = false,
  testCases = [],
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
    <div className="test-programming-container">
      <div className="test-problem-statement">{problemStatement}</div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <CodingEditor 
          code={starterCode} 
          handleCodeChange={handleCodeChange}
          readOnly={isViewOnly}
        />
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
