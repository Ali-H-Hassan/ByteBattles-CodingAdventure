import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../actions/testActions";
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
  const userId = useSelector((state) => state.auth.user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error(
        "User ID is not available, user must be logged in to create a test."
      );
      return;
    }

    const testToCreate = {
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

  return (
    <div className="create-test-page">
      <h1 className="create-test-title">Create New Test</h1>
      <form className="create-test-form" onSubmit={handleSubmit}>
        {mcqQuestions.map((mcq, index) => (
          <div key={index} className="mcq-question-block">
            <label className="form-label">
              MCQ Question {index + 1}:
              <input
                type="text"
                className="form-control"
                placeholder="Enter question text"
                value={mcq.questionText}
                onChange={(e) =>
                  handleMcqChange(index, "questionText", e.target.value)
                }
                required={index === 0}
              />
            </label>
            <div className="mcq-options-container">
              {mcq.options.map((option, optIndex) => (
                <label key={optIndex} className="mcq-option-label">
                  <input
                    type="radio"
                    name={`correctOption${index}`}
                    checked={mcq.correctOptionIndex === optIndex}
                    onChange={() =>
                      handleMcqChange(index, "correct", null, optIndex)
                    }
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Option ${optIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleMcqChange(index, "option", e.target.value, optIndex)
                    }
                    required={index === 0}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addMcqQuestion}
          className="add-mcq-button"
        >
          Add Another MCQ Question
        </button>
        <div className="programming-question-container">
          <label className="form-label">
            Programming Question:
            <textarea
              className="form-control"
              placeholder="Enter programming question text"
              value={programmingQuestion.questionText}
              onChange={(e) =>
                handleProgrammingChange("questionText", e.target.value)
              }
              required
            />
          </label>
          <label className="form-label">
            Starter Code:
            <textarea
              className="form-control"
              placeholder="Enter starter code for the question"
              value={programmingQuestion.starterCode}
              onChange={(e) =>
                handleProgrammingChange("starterCode", e.target.value)
              }
              required
            />
          </label>
          {programmingQuestion.testCases.map((testCase, index) => (
            <div key={index} className="test-case-container">
              <label className="form-label">
                Test Case {index + 1} Input:
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter test case input"
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
              </label>
              <label className="form-label">
                Expected Output:
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter expected output"
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
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={addTestCase}
            className="add-test-case-button"
          >
            Add Test Case
          </button>
        </div>
        <button type="submit" className="submit-test-button">
          Create Test
        </button>
      </form>
    </div>
  );
}

export default CreateTestPage;
