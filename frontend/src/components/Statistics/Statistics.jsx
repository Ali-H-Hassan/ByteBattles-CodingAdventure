import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faCheckCircle,
  faTimesCircle,
  faPercent,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../services/apiConfig";
import "./Statistics.css";

function Statistics() {
  const [statistics, setStatistics] = useState({
    totalTestsTaken: 0,
    passedTests: 0,
    failedTests: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await apiClient.get("/api/test-results/statistics");
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Keep default values (0) on error
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <section className="statistics">
      <div className="section-header">
        <FontAwesomeIcon icon={faChartLine} className="section-icon" />
        <h2 className="section-title">Statistics</h2>
      </div>
      {loading ? (
        <div className="statistics-loading">Loading statistics...</div>
      ) : (
        <div className="statistics-grid">
          <div className="statistic-card">
            <FontAwesomeIcon icon={faFileAlt} className="statistic-icon" />
            <div className="statistic-info">
              <span className="statistic-number">{statistics.totalTestsTaken}</span>
              <span className="statistic-text">Tests Taken</span>
            </div>
          </div>
          <div className="statistic-card">
            <FontAwesomeIcon icon={faCheckCircle} className="statistic-icon statistic-icon-success" />
            <div className="statistic-info">
              <span className="statistic-number">{statistics.passedTests}</span>
              <span className="statistic-text">Passed</span>
            </div>
          </div>
          <div className="statistic-card">
            <FontAwesomeIcon icon={faTimesCircle} className="statistic-icon statistic-icon-error" />
            <div className="statistic-info">
              <span className="statistic-number">{statistics.failedTests}</span>
              <span className="statistic-text">Failed</span>
            </div>
          </div>
          <div className="statistic-card">
            <FontAwesomeIcon icon={faPercent} className="statistic-icon statistic-icon-primary" />
            <div className="statistic-info">
              <span className="statistic-number">
                {statistics.averageScore > 0 ? statistics.averageScore.toFixed(1) : "0"}%
              </span>
              <span className="statistic-text">Overall Average</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Statistics;
