import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../redux/test/testActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faFileAlt, faCode, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "./CreateTestPage.css";
import { useNavigate } from "react-router-dom";

function CreateTestPage() {
  const [mcqQuestions, setMcqQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 },
  ]);

  const [programmingQuestion, setProgrammingQuestion] = useState({
    questionText: "",
    starterCode: "",
    testCases: [{ input: "", output: "" }],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;
  const [testTitle, setTestTitle] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error(
        "User ID is not available, user must be logged in to create a test."
      );
      return;
    }

    const testToCreate = {
      title: testTitle,
      mcqQuestions: mcqQuestions.map(({ options, ...rest }) => ({
        ...rest,
        options: options.map((text, index) => ({
          text,
          isCorrect: index === rest.correctOptionIndex,
        })),
      })),
      programmingQuestion,
      createdBy: userId,
    };

    try {
      await dispatch(createTest(testToCreate));
      navigate("/company-dashboard");
    } catch (error) {
      console.error("Error creating the test:", error);
    }
  };

  const handleMcqChange = (questionIndex, type, value, optionIndex) => {
    setMcqQuestions((currentMcqs) => {
      return currentMcqs.map((mcq, index) => {
        if (index === questionIndex) {
          if (type === "questionText") {
            return { ...mcq, questionText: value };
          } else if (type === "option") {
            const newOptions = [...mcq.options];
            newOptions[optionIndex] = value;
            return { ...mcq, options: newOptions };
          } else if (type === "correct") {
            return { ...mcq, correctOptionIndex: optionIndex };
          }
        }
        return mcq;
      });
    });
  };

  const handleProgrammingChange = (type, value, index) => {
    setProgrammingQuestion((current) => {
      const newProgrammingQuestion = { ...current };
      if (type === "questionText") {
        newProgrammingQuestion.questionText = value;
      } else if (type === "starterCode") {
        newProgrammingQuestion.starterCode = value;
      } else if (type === "testCaseInput") {
        newProgrammingQuestion.testCases[index].input = value;
      } else if (type === "testCaseOutput") {
        newProgrammingQuestion.testCases[index].output = value;
      }
      return newProgrammingQuestion;
    });
  };

  const addTestCase = () => {
    setProgrammingQuestion((current) => ({
      ...current,
      testCases: [...current.testCases, { input: "", output: "" }],
    }));
  };

  const addMcqQuestion = () => {
    setMcqQuestions((current) => [
      ...current,
      { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 },
    ]);
  };

  const removeMcqQuestion = (index) => {
    if (mcqQuestions.length > 1) {
      setMcqQuestions((current) => current.filter((_, i) => i !== index));
    }
  };

  const removeTestCase = (index) => {
    if (programmingQuestion.testCases.length > 1) {
      setProgrammingQuestion((current) => ({
        ...current,
        testCases: current.testCases.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="create-test-page">
      <div className="create-test-header">
        <h1 className="create-test-title">Create New Test</h1>
        <p className="create-test-subtitle">Build a comprehensive assessment for candidates</p>
      </div>

      <form className="create-test-form" onSubmit={handleSubmit}>
        {/* Test Title Section */}
        <div className="form-section title-section">
          <div className="title-input-wrapper">
            <FontAwesomeIcon icon={faFileAlt} className="title-icon" />
            <input
              type="text"
              className="title-input"
              placeholder="Enter test title..."
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* MCQ Questions Section */}
        <div className="form-section">
          <div className="section-header">
            <FontAwesomeIcon icon={faCheckCircle} className="section-icon" />
            <h2 className="section-title">Multiple Choice Questions</h2>
          </div>
          
          {mcqQuestions.map((mcq, index) => (
            <div key={index} className="mcq-card">
              <div className="mcq-card-header">
                <div className="mcq-number-badge">
                  <span>{index + 1}</span>
                </div>
                <div className="mcq-header-content">
                  <h3 className="mcq-card-title">Question {index + 1}</h3>
                </div>
                {mcqQuestions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMcqQuestion(index)}
                    className="mcq-remove-btn"
                    title="Remove question"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              
              <div className="mcq-question-input-wrapper">
                <textarea
                  className="mcq-question-input"
                  placeholder="Enter your question here..."
                  value={mcq.questionText}
                  onChange={(e) =>
                    handleMcqChange(index, "questionText", e.target.value)
                  }
                  rows={2}
                  required={index === 0}
                />
              </div>

              <div className="mcq-options-wrapper">
                <label className="mcq-options-label">Answer Options</label>
                <div className="mcq-options-list">
                  {mcq.options.map((option, optIndex) => {
                    const isCorrect = mcq.correctOptionIndex === optIndex;
                    return (
                      <div 
                        key={optIndex} 
                        className={`mcq-option ${isCorrect ? 'correct' : ''}`}
                      >
                        <label className="mcq-option-radio-wrapper">
                          <input
                            type="radio"
                            name={`correctOption${index}`}
                            checked={isCorrect}
                            onChange={() =>
                              handleMcqChange(index, "correct", null, optIndex)
                            }
                            className="mcq-option-radio"
                          />
                          <div className="mcq-radio-custom">
                            {isCorrect && <div className="mcq-radio-dot"></div>}
                          </div>
                          <span className="mcq-option-letter">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                        </label>
                        <input
                          type="text"
                          className="mcq-option-input"
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          value={option}
                          onChange={(e) =>
                            handleMcqChange(index, "option", e.target.value, optIndex)
                          }
                          required={index === 0}
                        />
                        {isCorrect && (
                          <span className="mcq-correct-badge">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMcqQuestion}
            className="add-button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add MCQ Question
          </button>
        </div>

        {/* Programming Question Section */}
        <div className="form-section">
          <div className="section-header">
            <FontAwesomeIcon icon={faCode} className="section-icon" />
            <h2 className="section-title">Programming Question</h2>
          </div>

          <div className="programming-card">
            <div className="form-group">
              <label className="form-label">
                Problem Statement <span className="required">*</span>
              </label>
              <textarea
                className="form-control textarea"
                placeholder="Describe the programming problem candidates need to solve..."
                value={programmingQuestion.questionText}
                onChange={(e) =>
                  handleProgrammingChange("questionText", e.target.value)
                }
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Starter Code <span className="required">*</span>
              </label>
              <textarea
                className="form-control code-editor"
                placeholder="function solution() {&#10;  // Your starter code here&#10;}"
                value={programmingQuestion.starterCode}
                onChange={(e) =>
                  handleProgrammingChange("starterCode", e.target.value)
                }
                rows={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Test Cases</label>
              {programmingQuestion.testCases.map((testCase, index) => (
                <div key={index} className="test-case-card">
                  <div className="test-case-header">
                    <span className="test-case-number">Test Case {index + 1}</span>
                    {programmingQuestion.testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="remove-button"
                        title="Remove test case"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                  <div className="test-case-inputs">
                    <div className="test-case-field">
                      <label className="test-case-label">Input</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., [1, 2, 3]"
                        value={testCase.input}
                        onChange={(e) =>
                          handleProgrammingChange(
                            "testCaseInput",
                            e.target.value,
                            index
                          )
                        }
                        required
                      />
                    </div>
                    <div className="test-case-field">
                      <label className="test-case-label">Expected Output</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 6"
                        value={testCase.output}
                        onChange={(e) =>
                          handleProgrammingChange(
                            "testCaseOutput",
                            e.target.value,
                            index
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addTestCase}
                className="add-button secondary"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Test Case
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTestPage;
