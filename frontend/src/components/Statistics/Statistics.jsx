import React from "react";
import TestsIcon from "../../assets/Edit 1.png";
import PassedIcon from "../../assets/Like.png";
import FailedIcon from "../../assets/Dislike.png";
import AverageIcon from "../../assets/%.png";
import "./Statistics.css";

function Statistics() {
  return (
    <section className="statistics">
      <div className="statistic-card">
        <img src={TestsIcon} alt="Tests Written" className="statistic-icon" />
        <div className="statistic-info">
          <span className="statistic-number">32</span>
          <span className="statistic-text">Tests Written</span>
        </div>
      </div>
      <div className="statistic-card">
        <img src={PassedIcon} alt="Passed" className="statistic-icon" />
        <div className="statistic-info">
          <span className="statistic-number">12</span>
          <span className="statistic-text">Passed</span>
        </div>
      </div>
      <div className="statistic-card">
        <img src={FailedIcon} alt="Failed" className="statistic-icon" />
        <div className="statistic-info">
          <span className="statistic-number">19</span>
          <span className="statistic-text">Failed</span>
        </div>
      </div>
      <div className="statistic-card">
        <img
          src={AverageIcon}
          alt="Overall Average"
          className="statistic-icon"
        />
        <div className="statistic-info">
          <span className="statistic-number">80 %</span>
          <span className="statistic-text">Overall Average</span>
        </div>
      </div>
    </section>
  );
}

export default Statistics;
