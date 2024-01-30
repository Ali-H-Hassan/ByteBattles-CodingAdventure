import React, { useState, useEffect } from "react";
import "./TestHeader.css";
import Amazon from "../../assets/amazon.png";
import Timer from "../../assets/Time Circle 3.png";

const TestHeader = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        const updatedTime = prevTime - 1;
        if (updatedTime <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="test-header">
      <div className="test-header-logo">
        <img src={Amazon} alt="Logo" className="test-logo" />
        <span>Amazon Quiz Competition</span>
      </div>
      <div className="test-header-timer">
        <div className="timer-icon">
          <img src={Timer} alt="Timer Icon" className="timer" />
        </div>
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default TestHeader;
