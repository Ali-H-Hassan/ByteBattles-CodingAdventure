import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./MCQQuestion.css";

const MCQQuestion = ({
  question,
  options,
  onAnswerChange,
  onNextClick,
  disabled = false,
  showCorrectAnswer = false,
  questionId,
  selectedAnswer,
  isReviewMode = false
}) => {
  // Handle both string options and object options
  const normalizedOptions = options.map((option, index) => {
    if (typeof option === 'string') {
      return { id: index, text: option, isCorrect: false };
    }
    return option;
  });

  // Get the correct option ID for highlighting
  const correctOptionId = normalizedOptions.find(opt => opt.isCorrect === true)?.id;

  // Check if user's answer is correct
  const userAnswerCorrect = selectedAnswer !== undefined && selectedAnswer === correctOptionId;

  return (
    <div className={`test-mcq-container ${isReviewMode ? 'review-mode' : ''}`}>
      <div className="test-mcq-question-header">
        <div className="test-mcq-question">{question}</div>
        {isReviewMode && selectedAnswer !== undefined && (
          <div className={`mcq-answer-status ${userAnswerCorrect ? 'status-correct' : 'status-incorrect'}`}>
            <FontAwesomeIcon icon={userAnswerCorrect ? faCheck : faTimes} />
            <span>{userAnswerCorrect ? 'Correct' : 'Incorrect'}</span>
          </div>
        )}
      </div>
      <form className="test-mcq-options-form">
        {normalizedOptions.map((option, index) => {
          const isCorrect = option.isCorrect === true;
          const optionId = option.id ?? index;
          const isUserSelected = selectedAnswer !== undefined && selectedAnswer === optionId;

          // Determine option state class for review mode
          let optionStateClass = '';
          if (isReviewMode || showCorrectAnswer) {
            if (isCorrect) {
              optionStateClass = 'correct-answer';
            } else if (isUserSelected && !isCorrect) {
              optionStateClass = 'wrong-answer';
            }
          }

          // In review mode, check radio if it's the user's answer OR if showing correct and it's correct
          const shouldBeChecked = isReviewMode
            ? isUserSelected
            : (showCorrectAnswer ? isCorrect : isUserSelected);

          return (
            <label
              key={optionId}
              className={`test-mcq-option-label ${disabled ? 'disabled' : ''} ${optionStateClass}`}
            >
              <input
                type="radio"
                name={`mcq-question-${questionId}`}
                value={optionId}
                onChange={onAnswerChange}
                disabled={disabled}
                checked={shouldBeChecked}
              />
              <span className="option-content">
                <span className="option-text">{option.text}</span>
                {(isReviewMode || showCorrectAnswer) && isCorrect && (
                  <span className="correct-answer-badge">
                    <FontAwesomeIcon icon={faCheck} />
                    Correct Answer
                  </span>
                )}
                {isReviewMode && isUserSelected && !isCorrect && (
                  <span className="your-answer-badge">
                    <FontAwesomeIcon icon={faTimes} />
                    Your Answer
                  </span>
                )}
                {isReviewMode && isUserSelected && isCorrect && (
                  <span className="your-correct-badge">
                    <FontAwesomeIcon icon={faCheck} />
                    Your Answer
                  </span>
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
