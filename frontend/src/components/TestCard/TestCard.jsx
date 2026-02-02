import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import { checkIfTestTaken } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCheckCircle,
  faEye,
  faPlay,
  faTrophy,
  faQuestionCircle,
  faCode
} from "@fortawesome/free-solid-svg-icons";
import "./TestCard.css";
import defaultLogo from "../../assets/DefaultLogo.jpeg";

const TestCard = ({ test, testResult }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTaken, setIsTaken] = useState(false);
  const [checking, setChecking] = useState(true);
  const userId = useSelector((state) => state.auth.user?.id || state.auth.user?._id);

  useEffect(() => {
    const checkTestStatus = async () => {
      if (!test || !userId) {
        setChecking(false);
        return;
      }

      // If we already have the result passed in, use it
      if (testResult) {
        setIsTaken(true);
        setChecking(false);
        return;
      }

      const testId = test.id || test._id;
      if (!testId) {
        setChecking(false);
        return;
      }

      try {
        const taken = await dispatch(checkIfTestTaken(testId));
        setIsTaken(taken);
      } catch (error) {
        console.error("Error checking test status:", error);
      } finally {
        setChecking(false);
      }
    };

    checkTestStatus();
  }, [test, userId, dispatch, testResult]);

  if (!test) {
    return null;
  }

  const {
    id: testId,
    _id: mongoId,
    logo = defaultLogo,
    title = "No Title",
    companyName,
  } = test;
  const id = testId || mongoId;

  const handleTakeTest = (e) => {
    e.stopPropagation();
    if (id && !isTaken) {
      dispatch(fetchTestById(id));
      navigate(`/tests/${id}`);
    }
  };

  const handleReviewTest = (e) => {
    e.stopPropagation();
    if (id) {
      dispatch(fetchTestById(id));
      navigate(`/tests/${id}?mode=review`);
    }
  };

  // Calculate score display
  const score = testResult?.score ?? null;
  const mcqCorrect = testResult?.mcqCorrectCount ?? 0;
  const mcqTotal = testResult?.mcqTotalCount ?? 0;
  const programmingCorrect = testResult?.programmingCorrect ?? false;

  // Determine score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-average";
    return "score-low";
  };

  return (
    <div className={`test-card-main ${isTaken ? "test-card-completed" : ""}`}>
      {isTaken && score !== null && (
        <div className={`test-card-score-badge ${getScoreColor(score)}`}>
          <FontAwesomeIcon icon={faTrophy} />
          <span>{Math.round(score)}%</span>
        </div>
      )}

      <div className="test-card-body">
        <div className="test-card-header-row">
          <img src={logo} alt={`${title} logo`} className="test-logo" />
          {isTaken && (
            <div className="test-completed-badge">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Completed</span>
            </div>
          )}
        </div>

        <div className="test-card-content">
          <h3 className="test-title">{title}</h3>
          {companyName && (
            <div className="test-company">
              <FontAwesomeIcon icon={faBuilding} className="test-company-icon" />
              <span className="test-company-name">{companyName}</span>
            </div>
          )}
        </div>

        {isTaken && testResult && (
          <div className="test-result-summary">
            <div className="test-result-item">
              <FontAwesomeIcon icon={faQuestionCircle} className="result-icon" />
              <span className="result-label">MCQ:</span>
              <span className={`result-value ${mcqCorrect === mcqTotal ? "result-perfect" : ""}`}>
                {mcqCorrect}/{mcqTotal}
              </span>
            </div>
            {testResult.programmingAnswer !== null && testResult.programmingAnswer !== undefined && (
              <div className="test-result-item">
                <FontAwesomeIcon icon={faCode} className="result-icon" />
                <span className="result-label">Code:</span>
                <span className={`result-value ${programmingCorrect ? "result-perfect" : "result-failed"}`}>
                  {programmingCorrect ? "Passed" : "Failed"}
                </span>
              </div>
            )}
          </div>
        )}

        {isTaken ? (
          <button
            className="test-review-button"
            onClick={handleReviewTest}
          >
            <FontAwesomeIcon icon={faEye} />
            <span>Review Test</span>
          </button>
        ) : (
          <button
            className="test-take-button"
            onClick={handleTakeTest}
            disabled={checking}
          >
            {checking ? (
              "Loading..."
            ) : (
              <>
                <FontAwesomeIcon icon={faPlay} />
                <span>Take Test</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestCard;
