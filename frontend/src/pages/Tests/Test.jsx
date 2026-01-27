import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import TestCard from "../../components/TestCard/TestCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import "./Test.css";

const TestsPage = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  if (loading) {
    return <div className="tests-loading">Loading tests...</div>;
  }

  if (error) {
    return <div className="tests-error">Error: {error}</div>;
  }

  return (
    <div className="tests-page-container">
      <div className="tests-header">
        <div className="tests-header-content">
          <FontAwesomeIcon icon={faClipboardList} className="tests-header-icon" />
          <div>
            <h1 className="tests-header-title">Available Tests</h1>
            <p className="tests-header-subtitle">Select a test to begin your assessment</p>
          </div>
        </div>
      </div>
      <div className="tests-container">
        {tests.length > 0 ? (
          tests.map((test) => {
          const testId = test.id || test._id; // Support both id (SQL) and _id (MongoDB)
          return <TestCard key={testId} test={test} />;
          })
        ) : (
          <div className="no-tests-message">
            <FontAwesomeIcon icon={faFileAlt} />
            <p>No tests available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsPage;
