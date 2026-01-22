import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import TestCardImage from "../../assets/Test1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./RecentTests.css";

function RecentTests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tests } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  const recentTests = tests.slice(-2);
  const handleResumeClick = (testId) => {
    navigate(`/tests/${testId}`);
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
            const testId = test.id || test._id; // Support both id (SQL) and _id (MongoDB)
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
                      className="resume-button"
                      onClick={() => handleResumeClick(testId)}
                    >
                      Start Test
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
