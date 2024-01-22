import React, { useState } from "react";
import "./CreateTestPage.css";

function CreateTestPage() {
  const [mcqCount, setMcqCount] = useState(0);

  return (
    <div className="create-test-page">
      <h1 className="create-test-title">Create New Test</h1>

      <form className="create-test-form">
        <label htmlFor="mcqCount" className="form-label">
          Number of MCQ Questions:
          <input
            type="number"
            id="mcqCount"
            min="0"
            value={mcqCount}
            onChange={(e) => setMcqCount(Number(e.target.value))}
            className="form-control"
          />
        </label>

        <div className="mcq-questions-container">
          {Array.from({ length: mcqCount }, (_, index) => (
            <div key={index} className="mcq-question-block">
              <label className="form-label">
                Question {index + 1}:
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter question text"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="programming-question-container">
          <label className="form-label">
            Programming Question:
            <textarea
              className="form-control"
              placeholder="Enter programming question text"
            ></textarea>
          </label>
        </div>

        <button type="submit" className="submit-test-button">
          Create Test
        </button>
      </form>
    </div>
  );
}

export default CreateTestPage;
