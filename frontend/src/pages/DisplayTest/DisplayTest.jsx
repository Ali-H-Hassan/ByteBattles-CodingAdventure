import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../actions/testActions";

const TestDisplay = () => {
  const dispatch = useDispatch();
  const testState = useSelector((state) => state.testReducer);
  const { loading, tests, error } = testState;

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tests.map((test) => (
        <div key={test._id} className="test-container">
          <h2 className="test-title">{test.title}</h2>
          <ul className="mcq-list">
            {test.mcqQuestions.map((mcq, index) => (
              <li key={index} className="mcq-question">
                <p className="mcq-text">{mcq.questionText}</p>
                <ul className="mcq-options">
                  {mcq.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="mcq-option">
                      <input type="radio" disabled className="mcq-radio" />
                      <label className="mcq-label">{option.text}</label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="programming-question">
            Programming Question: {test.programmingQuestion.questionText}
          </p>
          <p className="starter-code">
            Starter Code: {test.programmingQuestion.starterCode}
          </p>
          <ul className="test-cases">
            {test.programmingQuestion.testCases.map((testCase, caseIndex) => (
              <li key={caseIndex} className="test-case">
                <p className="input">Input: {testCase.input}</p>
                <p className="output">Output: {testCase.output}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TestDisplay;
