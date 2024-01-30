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
}) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (onSubmitCode) {
      await onSubmitCode();
    }
    navigate("/thank-you");
  };

  return (
    <div className="test-programming-container">
      <div className="test-problem-statement">{problemStatement}</div>
      <CodingEditor code={starterCode} handleCodeChange={handleCodeChange} />
      <button className="test-submit-button" onClick={handleSubmit}>
        Submit Test
      </button>
    </div>
  );
};

export default ProgrammingQuestion;
