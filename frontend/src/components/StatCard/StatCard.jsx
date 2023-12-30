import React from "react";
import "./StatCard.css";

const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
};

export default StatCard;
