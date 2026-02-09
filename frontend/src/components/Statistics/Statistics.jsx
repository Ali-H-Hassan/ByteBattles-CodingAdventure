import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
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
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const total = statistics.passedTests + statistics.failedTests;
  const passedPercentage = total > 0 ? (statistics.passedTests / total) * 100 : 0;
  const failedPercentage = total > 0 ? (statistics.failedTests / total) * 100 : 0;

  // SVG donut chart calculations
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const passedDash = (passedPercentage / 100) * circumference;
  const failedDash = (failedPercentage / 100) * circumference;

  return (
    <section className="statistics">
      <div className="section-header">
        <FontAwesomeIcon icon={faChartLine} className="section-icon" />
        <h2 className="section-title">Statistics</h2>
      </div>

      {loading ? (
        <div className="statistics-loading">Loading statistics...</div>
      ) : (
        <div className="statistics-content">
          <div className="chart-container">
            <svg className="donut-chart" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#e8e8e8"
                strokeWidth={strokeWidth}
              />
              {total > 0 && (
                <>
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="#ff6b6b"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${failedDash} ${circumference}`}
                    strokeDashoffset={0}
                    transform="rotate(-90 90 90)"
                    className="chart-segment"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="#00c354"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${passedDash} ${circumference}`}
                    strokeDashoffset={-failedDash}
                    transform="rotate(-90 90 90)"
                    className="chart-segment"
                  />
                </>
              )}
            </svg>
            <div className="chart-center">
              <span className="chart-total">{total}</span>
              <span className="chart-label">Total Tests</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item passed">
              <div className="stat-indicator"></div>
              <div className="stat-details">
                <span className="stat-value">{statistics.passedTests}</span>
                <span className="stat-label">Passed</span>
              </div>
            </div>

            <div className="stat-item failed">
              <div className="stat-indicator"></div>
              <div className="stat-details">
                <span className="stat-value">{statistics.failedTests}</span>
                <span className="stat-label">Failed</span>
              </div>
            </div>

            <div className="stat-item average">
              <div className="average-section">
                <div className="average-header">
                  <span className="stat-label">Overall Average</span>
                  <span className="stat-value">
                    {statistics.averageScore > 0 ? statistics.averageScore.toFixed(1) : "0"}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${statistics.averageScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Statistics;
