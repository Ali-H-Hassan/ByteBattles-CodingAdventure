import React from "react";
import CodingEditor from "../CodingEditor/CodingEditor";
import "./ProgrammingQuestion.css";
import { useNavigate } from "react-router-dom";

const ProgrammingQuestion = ({
  problemStatement,
  starterCode,
  handleCodeChange,
  onTestSubmit,
}) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (onTestSubmit) {
      onTestSubmit();
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
