import React from "react";
import "./MCQQuestion.css";

const MCQQuestion = ({ question, options, onOptionSelect }) => {
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
            {option}
          </label>
        ))}
      </form>
    </div>
  );
};

export default MCQQuestion;
