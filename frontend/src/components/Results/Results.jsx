import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserResults } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./Results.css";

function Results() {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.testResults);

  useEffect(() => {
    dispatch(fetchUserResults());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="results">
        <div className="section-header">
          <FontAwesomeIcon icon={faClipboardCheck} className="section-icon" />
          <h2 className="section-title">Test Results</h2>
        </div>
        <div className="results-loading">Loading results...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="results">
        <div className="section-header">
          <FontAwesomeIcon icon={faClipboardCheck} className="section-icon" />
          <h2 className="section-title">Test Results</h2>
        </div>
        <div className="results-error">Error: {error}</div>
      </section>
    );
  }

  if (!results || results.length === 0) {
    return (
      <section className="results">
        <div className="section-header">
          <FontAwesomeIcon icon={faClipboardCheck} className="section-icon" />
          <h2 className="section-title">Test Results</h2>
        </div>
        <div className="results-empty">No test results yet. Take a test to see your results here!</div>
      </section>
    );
  }

  // Show only the 3 most recent results
  const recentResults = results.slice(0, 3);

  return (
    <section className="results">
      <div className="section-header">
        <FontAwesomeIcon icon={faClipboardCheck} className="section-icon" />
        <h2 className="section-title">Test Results</h2>
      </div>
      <ul className="results-list">
        {recentResults.map((result) => (
          <li key={result.id} className="results-entry">
            <div className="results-score">
              <span className="score-value">{result.score.toFixed(1)}%</span>
            </div>
            <div className="results-info">
              <h3 className="results-test-title">{result.testTitle}</h3>
              <div className="results-details">
                {result.companyName && (
                  <span className="results-company">{result.companyName}</span>
                )}
                <span className="results-date">
                  {new Date(result.completedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="results-breakdown">
                <span className="results-mcq">
                  MCQ: {result.mcqCorrectCount}/{result.mcqTotalCount}
                </span>
                {result.programmingCorrect !== undefined && (
                  <span className={`results-programming ${result.programmingCorrect ? "correct" : "incorrect"}`}>
                    <FontAwesomeIcon 
                      icon={result.programmingCorrect ? faCheckCircle : faTimesCircle} 
                      style={{ marginRight: "0.25rem" }}
                    />
                    Programming: {result.programmingCorrect ? "Correct" : "Incorrect"}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Results;

