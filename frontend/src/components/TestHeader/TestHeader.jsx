import React from "react";
import "./TestHeader.css";
import Amazon from "../../assets/amazon.png";
const TestHeader = ({ timeLeft }) => {
  return (
    <div className="test-header">
      <div className="test-header-logo">
        <img src={Amazon} alt="Logo" className="test-logo" />
        <span>TCS Quiz Competition</span>
      </div>
      <div className="test-header-timer">
        <div className="timer-icon">⏲️</div>
        <span>{timeLeft}</span>
      </div>
    </div>
  );
};

export default TestHeader;
