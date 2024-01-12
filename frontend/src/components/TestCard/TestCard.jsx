import React from "react";
import "./TestCard.css";

const TestCard = ({ logo, title, subtitle, status }) => {
  const statusClass = status.toLowerCase().replace(" ", "");

  return (
    <div className={`test-card ${statusClass}`}>
      <div className="test-card-header">
        <img src={logo} alt={`${title} logo`} className="test-logo" />
        <span className="test-status">{status}</span>
      </div>
      <div className="test-card-body">
        <h3 className="test-title">{title}</h3>
        <p className="test-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default TestCard;
