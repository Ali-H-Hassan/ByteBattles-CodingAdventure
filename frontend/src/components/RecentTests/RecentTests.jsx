import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import { checkIfTestTaken } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCheckCircle,
  faPlay,
  faBuilding,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import defaultLogo from "../../assets/DefaultLogo.jpeg";
import "./RecentTests.css";

function RecentTests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tests } = useSelector((state) => state.test);
  const userId = useSelector((state) => state.auth.user?.id || state.auth.user?._id);
  const [testStatuses, setTestStatuses] = useState({});
  const [checkingStatuses, setCheckingStatuses] = useState({});

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  // Memoize recentTests to prevent infinite loops
  const recentTests = useMemo(() => tests.slice(-2), [tests]);

  useEffect(() => {
    const checkTestStatuses = async () => {
      if (!userId || recentTests.length === 0) {
        setCheckingStatuses({});
        return;
      }

      // Get test IDs from recent tests
      const testIds = recentTests
        .map((test) => test.id || test._id)
        .filter((id) => id);

      if (testIds.length === 0) return;

      // Set all as checking initially
      const initialChecking = {};
      testIds.forEach((testId) => {
        initialChecking[testId] = true;
      });
      setCheckingStatuses(initialChecking);

      try {
        const statusPromises = testIds.map(async (testId) => {
          try {
            const isTaken = await dispatch(checkIfTestTaken(testId));
            setTestStatuses((prev) => ({ ...prev, [testId]: isTaken }));
            return { testId, isTaken };
          } catch (error) {
            console.error(`Error checking test ${testId}:`, error);
            setTestStatuses((prev) => ({ ...prev, [testId]: false }));
            return { testId, isTaken: false };
          } finally {
            setCheckingStatuses((prev) => {
              const updated = { ...prev };
              delete updated[testId];
              return updated;
            });
          }
        });

        await Promise.all(statusPromises);
      } catch (error) {
        console.error("Error checking test statuses:", error);
        setCheckingStatuses({});
      }
    };

    checkTestStatuses();
  }, [recentTests, userId, dispatch]);

  const handleTestClick = (testId, isTaken) => {
    if (!isTaken) {
      navigate(`/tests/${testId}`);
    } else {
      navigate(`/tests/${testId}?mode=review`);
    }
  };

  const completedCount = Object.values(testStatuses).filter(Boolean).length;

  return (
    <section className="recent-tests">
      {/* Header matching Tests page theme */}
      <div className="recent-tests-header">
        <div className="recent-tests-header-content">
          <div className="recent-tests-header-icon">
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div className="recent-tests-header-text">
            <h2 className="recent-tests-title">Recent Tests</h2>
            <p className="recent-tests-subtitle">Latest available assessments</p>
          </div>
        </div>
        <div className="recent-tests-stats">
          <div className="recent-tests-stat">
            <span className="recent-tests-stat-value">{recentTests.length}</span>
            <span className="recent-tests-stat-label">Available</span>
          </div>
          <div className="recent-tests-stat">
            <span className="recent-tests-stat-value">{completedCount}</span>
            <span className="recent-tests-stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Test Cards */}
      <div className="recent-tests-content">
        {recentTests.length > 0 ? (
          <div className="recent-tests-grid">
            {recentTests.map((test) => {
              const testId = test.id || test._id;
              const isTaken = testStatuses[testId] || false;
              const checking = checkingStatuses[testId] || false;

              return (
                <div
                  className={`recent-test-card ${isTaken ? "recent-test-card-completed" : ""}`}
                  key={testId}
                >
                  <div className="recent-test-card-header">
                    <img
                      src={test.logo || defaultLogo}
                      alt={test.title}
                      className="recent-test-logo"
                    />
                    {isTaken && (
                      <div className="recent-test-completed-badge">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span>Done</span>
                      </div>
                    )}
                  </div>

                  <div className="recent-test-card-body">
                    <h3 className="recent-test-title">{test.title}</h3>
                    {test.companyName && (
                      <div className="recent-test-company">
                        <FontAwesomeIcon icon={faBuilding} />
                        <span>{test.companyName}</span>
                      </div>
                    )}
                  </div>

                  <button
                    className={`recent-test-button ${isTaken ? "recent-test-review-btn" : "recent-test-start-btn"}`}
                    onClick={() => handleTestClick(testId, isTaken)}
                    disabled={checking}
                  >
                    {checking ? (
                      "Loading..."
                    ) : isTaken ? (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span>Review</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlay} />
                        <span>Start Test</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="recent-tests-empty">
            <FontAwesomeIcon icon={faSearch} className="recent-tests-empty-icon" />
            <h3>No Tests Available</h3>
            <p>Check back later for new assessments</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentTests;
