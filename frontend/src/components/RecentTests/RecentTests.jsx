import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import { checkIfTestTaken } from "../../redux/testResults/testResultsActions";
import TestCardImage from "../../assets/Test1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
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
  }, [recentTests, userId, dispatch]); // Include dispatch but recentTests is memoized

  const handleResumeClick = (testId, isTaken) => {
    if (!isTaken) {
      navigate(`/tests/${testId}`);
    }
  };

  return (
    <section className="recent-tests">
      <div className="section-header">
        <FontAwesomeIcon icon={faFileAlt} className="section-icon" />
        <h2 className="section-title">Recent Tests</h2>
      </div>
      <div className="test-cards-container">
        {recentTests.length > 0 ? (
          recentTests.map((test) => {
            const testId = test.id || test._id;
            const isTaken = testStatuses[testId] || false;
            const checking = checkingStatuses[testId] || false;

            return (
              <div className="test-card" key={testId}>
                <div className="test-card-image-wrapper">
                  <img
                    src={TestCardImage}
                    alt={test.title}
                    className="test-card-image"
                  />
                </div>
                <div className="test-card-content">
                  <h3 className="test-title">{test.title}</h3>
                  <div className="test-details">
                    <button
                      className={`resume-button ${isTaken ? "test-taken-button" : ""}`}
                      onClick={() => handleResumeClick(testId, isTaken)}
                      disabled={isTaken || checking}
                    >
                      {checking ? (
                        "Checking..."
                      ) : isTaken ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "0.5rem" }} />
                          Already Taken
                        </>
                      ) : (
                        "Start Test"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-tests-message">
            <FontAwesomeIcon icon={faFileAlt} className="no-tests-icon" />
            <p>No tests available</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentTests;
