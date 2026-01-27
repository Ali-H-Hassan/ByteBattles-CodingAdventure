import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserResults } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck, faCheckCircle, faTimesCircle, faRobot, faTrophy, faUser } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../services/apiConfig";
import "./ResultsPage.css";

const ResultsPage = () => {
  const dispatch = useDispatch();
  const { results: testResults, loading: testLoading, error: testError } = useSelector((state) => state.testResults);
  const [activeTab, setActiveTab] = useState("tests"); // "tests" or "battles"
  const [battleResults, setBattleResults] = useState([]);
  const [battleLoading, setBattleLoading] = useState(false);
  const [battleError, setBattleError] = useState(null);

  useEffect(() => {
    if (activeTab === "tests") {
      dispatch(fetchUserResults());
    } else if (activeTab === "battles") {
      fetchBattleResults();
    }
  }, [dispatch, activeTab]);

  const fetchBattleResults = async () => {
    setBattleLoading(true);
    setBattleError(null);
    try {
      const response = await apiClient.get("/api/battle/results");
      setBattleResults(response.data || []);
    } catch (error) {
      console.error("Error fetching battle results:", error);
      setBattleError("Failed to load battle results.");
    } finally {
      setBattleLoading(false);
    }
  };

  const getWinnerIcon = (winner) => {
    if (winner === "user") return faTrophy;
    if (winner === "ai") return faRobot;
    return faTrophy;
  };

  const getWinnerText = (winner) => {
    if (winner === "user") return "You Won!";
    if (winner === "ai") return "AI Won";
    return "Tie";
  };

  const getWinnerClass = (winner) => {
    if (winner === "user") return "winner-user";
    if (winner === "ai") return "winner-ai";
    return "winner-tie";
  };

  return (
    <div className="results-page">
      <div className="results-page-header">
        <FontAwesomeIcon icon={faClipboardCheck} className="results-page-icon" />
        <h1 className="results-page-title">Results</h1>
      </div>

      <div className="results-page-tabs">
        <button
          className={`results-page-tab ${activeTab === "tests" ? "active" : ""}`}
          onClick={() => setActiveTab("tests")}
        >
          Test Results
        </button>
        <button
          className={`results-page-tab ${activeTab === "battles" ? "active" : ""}`}
          onClick={() => setActiveTab("battles")}
        >
          AI Battle Results
        </button>
      </div>

      {activeTab === "tests" && (
        <>
          {testLoading ? (
            <div className="results-page-loading">Loading test results...</div>
          ) : testError ? (
            <div className="results-page-error">Error: {testError}</div>
          ) : !testResults || testResults.length === 0 ? (
            <div className="results-page-empty">
              <p>No test results yet.</p>
              <p>Take a test to see your results here!</p>
            </div>
          ) : (
            <div className="results-page-list">
              {testResults.map((result) => (
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
          )}
        </>
      )}

      {activeTab === "battles" && (
        <>
          {battleLoading ? (
            <div className="results-page-loading">Loading battle results...</div>
          ) : battleError ? (
            <div className="results-page-error">Error: {battleError}</div>
          ) : !battleResults || battleResults.length === 0 ? (
            <div className="results-page-empty">
              <p>No AI battle results yet.</p>
              <p>Challenge the AI to see your battle results here!</p>
            </div>
          ) : (
            <div className="results-page-list">
              {battleResults.map((result) => (
                <div key={result.id} className="results-page-entry battle-result-entry">
                  <div className={`results-page-battle-winner ${getWinnerClass(result.winner)}`}>
                    <FontAwesomeIcon icon={getWinnerIcon(result.winner)} className="battle-winner-icon" />
                    <span className="battle-winner-text">{getWinnerText(result.winner)}</span>
                  </div>
                  <div className="results-page-info">
                    <h2 className="results-page-test-title">{result.challengeTitle}</h2>
                    <div className="results-page-details">
                      <span className="results-page-date">
                        {new Date(result.completedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="results-page-breakdown">
                      <div className="results-page-battle-stat">
                        <span className="results-page-label">Your Time:</span>
                        <span className={`results-page-value ${result.userPassed ? "passed" : "failed"}`}>
                          {result.userExecutionTime}ms
                          {result.userPassed ? (
                            <FontAwesomeIcon icon={faCheckCircle} style={{ marginLeft: "0.5rem" }} />
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} style={{ marginLeft: "0.5rem" }} />
                          )}
                        </span>
                      </div>
                      <div className="results-page-battle-stat">
                        <span className="results-page-label">AI Time:</span>
                        <span className={`results-page-value ${result.aiPassed ? "passed" : "failed"}`}>
                          {result.aiExecutionTime}ms
                          {result.aiPassed ? (
                            <FontAwesomeIcon icon={faCheckCircle} style={{ marginLeft: "0.5rem" }} />
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} style={{ marginLeft: "0.5rem" }} />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultsPage;
