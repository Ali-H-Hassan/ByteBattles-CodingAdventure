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
}) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
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
        <CodingEditor code={starterCode} handleCodeChange={handleCodeChange} />
      </div>
      <button 
        className="test-submit-button" 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Test"}
      </button>
    </div>
  );
};

export default ProgrammingQuestion;
