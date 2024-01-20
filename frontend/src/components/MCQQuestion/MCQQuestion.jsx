import React from "react";
import "./MCQQuestion.css";

const MCQQuestion = ({ question, options, onOptionSelect }) => {
  return (
    <div className="mcq-container">
      <div className="mcq-question">{question}</div>
      <form className="mcq-options">
        {options.map((option, index) => (
          <label key={index} className="mcq-option">
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
