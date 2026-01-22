import React, { useState, useEffect } from "react";
import "./TestHeader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const TestHeader = ({ initialTime, onTimeUp, testTitle, companyName }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        const updatedTime = prevTime - 1;
        if (updatedTime <= 0) {
          clearInterval(countdown);
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [onTimeUp]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isTimeLow = timeLeft <= 300; // Less than 5 minutes

  return (
    <div className="test-header">
      <div className="test-header-info">
        <h2 className="test-header-title">{testTitle || "Test"}</h2>
        {companyName && <span className="test-header-company">{companyName}</span>}
      </div>
      <div className={`test-header-timer ${isTimeLow ? "timer-low" : ""}`}>
        <FontAwesomeIcon icon={faClock} className="timer-icon" />
        <span className="timer-text">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default TestHeader;
