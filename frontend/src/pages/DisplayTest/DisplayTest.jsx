import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChallenge } from "../../actions/challengeActions"; // Adjust based on your action file's content
import "./DisplayTest.css"; // Your CSS file for styling

const DisplayTest = ({ testId }) => {
  const dispatch = useDispatch();
  const {
    loading,
    challenge: testData,
    error,
  } = useSelector((state) => state.challenge);

  useEffect(() => {
    dispatch(fetchChallenge(testId)); // Dispatch the action to fetch the test data
  }, [dispatch, testId]);

  if (loading) return <div className="test-loading">Loading test...</div>;
  if (error)
    return <div className="test-error">Error loading test: {error}</div>;
  if (!testData)
    return <div className="test-no-data">No test data available.</div>;

  return (
    <div className="test-container">
      <h1 className="test-title">{testData.title}</h1>
      <p className="test-description">{testData.description}</p>
      <div className="questions-container">
        {testData.questions.map((question, index) => (
          <div key={index} className="question">
            <h3>Question {index + 1}</h3>
            <p>{question.questionText}</p>
            {question.options && (
              <ul className="options-list">
                {question.options.map((option, idx) => (
                  <li
                    key={idx}
                    className={option.isCorrect ? "option-correct" : "option"}
                  >
                    {option.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayTest;
