import React from "react";
import "./TestCard.css";

const TestCard = ({ logo, title, subtitle, status }) => {
  const statusClass = status.toLowerCase().replace(" ", "");

  return (
    <div className={`test-card-main ${statusClass}`}>
      <div className="test-card-header">
        <span className="test-status">{status}</span>
      </div>
      <div className="test-card-body">
        <img src={logo} alt={`${title} logo`} className="test-logo" />
        <h3 className="test-title">{title}</h3>
        <p className="test-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default TestCard;
