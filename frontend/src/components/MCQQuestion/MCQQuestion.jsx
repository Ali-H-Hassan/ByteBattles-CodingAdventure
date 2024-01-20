import React from "react";
import "./MCQQuestion.css";

const MCQQuestion = ({
  question,
  options,
  onOptionSelect,
  onNavigateToProgramming,
}) => {
  return (
    <div className="test-mcq-container">
      <div className="test-mcq-question">{question}</div>
      <form className="test-mcq-options-form">
        {options.map((option, index) => (
          <label key={index} className="test-mcq-option-label">
            <input
              type="radio"
              name="option"
              value={option}
              onChange={onOptionSelect}
            />
            <span>{option}</span>
          </label>
        ))}
      </form>
      <button className="test-next-button" onClick={onNavigateToProgramming}>
        Next to Programming
      </button>
    </div>
  );
};

export default MCQQuestion;
