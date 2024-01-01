import React from "react";
import TestCardImage from "../../assets/Test1.png";
import Tests from "../../assets/Edit 1.png";

function RecentTests() {
  return (
    <section className="recent-tests">
      <div className="section-header">
        <img src={Tests} alt="Test Icon" className="section-icon" />
        <h2 className="section-title">Recent Tests</h2>
      </div>
      <div className="test-cards-container">
        {/* First Test Card */}
        <div className="test-card">
          <img
            src={TestCardImage}
            alt="C Programming"
            className="test-card-image"
          />
          <div className="test-card-content">
            <div className="test-details">
              <h3>C Programming</h3>
              <button className="resume-button">Resume</button>
            </div>
            <div className="test-progress green">
              <span>75%</span>
            </div>
          </div>
        </div>

        {/* Second Test Card */}
        <div className="test-card">
          <img
            src={TestCardImage}
            alt="Python Basics"
            className="test-card-image"
          />
          <div className="test-card-content">
            <div className="test-details">
              <h3>Python Basics</h3>
              <button className="resume-button">Resume</button>
            </div>
            <div className="test-progress green">
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecentTests;
