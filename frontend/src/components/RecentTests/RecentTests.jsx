import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../actions/testActions";
import TestCardImage from "../../assets/Test1.png";
import TestsIcon from "../../assets/Edit 1.png";
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
        <img src={TestsIcon} alt="Test Icon" className="section-icon" />
        <h2 className="section-title">Recent Tests</h2>
      </div>
      <div className="test-cards-container">
        {recentTests.map((test) => (
          <div className="test-card" key={test._id}>
            <img
              src={TestCardImage}
              alt={test.title}
              className="test-card-image"
            />
            <div className="test-card-content">
              <div className="test-details">
                <h3>{test.name}</h3>
                <button
                  className="resume-button"
                  onClick={() => handleResumeClick(test._id)}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentTests;
