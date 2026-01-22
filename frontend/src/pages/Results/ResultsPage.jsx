import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserResults } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./ResultsPage.css";

const ResultsPage = () => {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.testResults);

  useEffect(() => {
    dispatch(fetchUserResults());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="results-page">
        <div className="results-page-header">
          <FontAwesomeIcon icon={faClipboardCheck} className="results-page-icon" />
          <h1 className="results-page-title">Test Results</h1>
        </div>
        <div className="results-page-loading">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <div className="results-page-header">
          <FontAwesomeIcon icon={faClipboardCheck} className="results-page-icon" />
          <h1 className="results-page-title">Test Results</h1>
        </div>
        <div className="results-page-error">Error: {error}</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="results-page">
        <div className="results-page-header">
          <FontAwesomeIcon icon={faClipboardCheck} className="results-page-icon" />
          <h1 className="results-page-title">Test Results</h1>
        </div>
        <div className="results-page-empty">
          <p>No test results yet.</p>
          <p>Take a test to see your results here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-page-header">
        <FontAwesomeIcon icon={faClipboardCheck} className="results-page-icon" />
        <h1 className="results-page-title">Test Results</h1>
      </div>
      <div className="results-page-list">
        {results.map((result) => (
          <div key={result.id} className="results-page-entry">
            <div className="results-page-score">
              <span className="results-page-score-value">{result.score.toFixed(1)}%</span>
            </div>
            <div className="results-page-info">
              <h2 className="results-page-test-title">{result.testTitle}</h2>
              <div className="results-page-details">
                {result.companyName && (
                  <span className="results-page-company">{result.companyName}</span>
                )}
                <span className="results-page-date">
                  {new Date(result.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="results-page-breakdown">
                <div className="results-page-mcq">
                  <span className="results-page-label">MCQ Score:</span>
                  <span className="results-page-value">
                    {result.mcqCorrectCount}/{result.mcqTotalCount}
                  </span>
                </div>
                {result.programmingCorrect !== undefined && (
                  <div className={`results-page-programming ${result.programmingCorrect ? "correct" : "incorrect"}`}>
                    <span className="results-page-label">Programming:</span>
                    <span className="results-page-value">
                      <FontAwesomeIcon 
                        icon={result.programmingCorrect ? faCheckCircle : faTimesCircle} 
                        style={{ marginRight: "0.5rem" }}
                      />
                      {result.programmingCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;

