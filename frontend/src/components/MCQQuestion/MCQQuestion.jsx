import React from "react";
import "./MCQQuestion.css";

const MCQQuestion = ({ 
  question, 
  options, 
  onAnswerChange, 
  onNextClick, 
  disabled = false, 
  showCorrectAnswer = false,
  questionId,
  selectedAnswer 
}) => {
  // Handle both string options and object options
  const normalizedOptions = options.map((option, index) => {
    if (typeof option === 'string') {
      return { id: index, text: option, isCorrect: false };
    }
    return option;
  });

  // Get the correct option ID for highlighting
  const correctOptionId = showCorrectAnswer 
    ? normalizedOptions.find(opt => opt.isCorrect === true)?.id 
    : null;

  return (
    <div className="test-mcq-container">
      <div className="test-mcq-question">{question}</div>
      <form className="test-mcq-options-form">
        {normalizedOptions.map((option, index) => {
          const isCorrect = option.isCorrect === true;
          const optionId = option.id || index;
          const isSelected = selectedAnswer === optionId;
          const shouldBeChecked = showCorrectAnswer 
            ? isCorrect 
            : isSelected;
          
          return (
            <label 
              key={optionId} 
              className={`test-mcq-option-label ${disabled ? 'disabled' : ''} ${showCorrectAnswer && isCorrect ? 'correct-answer' : ''}`}
            >
              <input
                type="radio"
                name={`mcq-question-${questionId}`}
                value={optionId}
                onChange={onAnswerChange}
                disabled={disabled}
                checked={shouldBeChecked}
              />
              <span>
                {option.text}
                {showCorrectAnswer && isCorrect && (
                  <span className="correct-answer-badge">✓ Correct Answer</span>
                )}
              </span>
            </label>
          );
        })}
      </form>
    </div>
  );
};

export default MCQQuestion;
