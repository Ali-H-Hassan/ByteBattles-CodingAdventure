import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import { fetchUserResults } from "../../redux/testResults/testResultsActions";
import TestCard from "../../components/TestCard/TestCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Test.css";

const TestsPage = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.test);
  const { results } = useSelector((state) => state.testResults);

  useEffect(() => {
    dispatch(fetchTests());
    dispatch(fetchUserResults());
  }, [dispatch]);

  // Create a map of test results by testId for quick lookup
  const resultsByTestId = {};
  if (results && Array.isArray(results)) {
    results.forEach((result) => {
      const testId = result.testId || result.test?.id;
      if (testId) {
        resultsByTestId[testId] = result;
      }
    });
  }

  if (loading) return <LoadingSpinner message="Loading tests..." />;

  return (
    <div className="tests-page">
      <div className="tests-header">
        <div className="tests-header-content">
          <div className="tests-header-icon">
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div className="tests-header-text">
            <h1 className="tests-title">Available Tests</h1>
            <p className="tests-subtitle">
              Take tests to showcase your skills and track your progress
            </p>
          </div>
        </div>
        <div className="tests-stats">
          <div className="tests-stat">
            <span className="tests-stat-value">{tests?.length || 0}</span>
            <span className="tests-stat-label">Total Tests</span>
          </div>
          <div className="tests-stat">
            <span className="tests-stat-value">{results?.length || 0}</span>
            <span className="tests-stat-label">Completed</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="tests-error">
          <p>Error loading tests: {error}</p>
        </div>
      )}

      {!error && (!tests || tests.length === 0) ? (
        <div className="tests-empty">
          <FontAwesomeIcon icon={faSearch} className="tests-empty-icon" />
          <h3>No Tests Available</h3>
          <p>Check back later for new tests to take.</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => {
            const testId = test.id || test._id;
            const testResult = resultsByTestId[testId];
            return (
              <TestCard
                key={testId}
                test={test}
                testResult={testResult}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestsPage;
