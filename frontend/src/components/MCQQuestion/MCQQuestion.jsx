import React from "react";
import "./MCQQuestion.css";

const MCQQuestion = ({ question, options, onAnswerChange, onNextClick }) => {
  // Handle both string options and object options
  const normalizedOptions = options.map((option, index) => {
    if (typeof option === 'string') {
      return { id: index, text: option };
    }
    return option;
  });

  return (
    <div className="test-mcq-container">
      <div className="test-mcq-question">{question}</div>
      <form className="test-mcq-options-form">
        {normalizedOptions.map((option, index) => (
          <label key={option.id || index} className="test-mcq-option-label">
            <input
              type="radio"
              name="option"
              value={option.id}
              onChange={onAnswerChange}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </form>
    </div>
  );
};

export default MCQQuestion;
