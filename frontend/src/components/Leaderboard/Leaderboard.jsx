import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import UserAvatar from "../../assets/Profile (1).png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../services/apiConfig";

function Leaderboard() {
  const [topTestTakers, setTopTestTakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/test-results/leaderboard?topCount=3");
        setTopTestTakers(response.data || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setTopTestTakers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalClass = (index) => {
    if (index === 0) return "medal-gold";
    if (index === 1) return "medal-silver";
    if (index === 2) return "medal-bronze";
    return "";
  };

  const getPlaceText = (index) => {
    if (index === 0) return "1st Place";
    if (index === 1) return "2nd Place";
    if (index === 2) return "3rd Place";
    return `${index + 1}th Place`;
  };

  if (loading) {
    return (
      <section className="leaderboard">
        <div className="section-header">
          <FontAwesomeIcon icon={faTrophy} className="section-icon" />
          <h2 className="section-title">Leader Board</h2>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading...
        </div>
      </section>
    );
  }

  if (topTestTakers.length === 0) {
    return (
      <section className="leaderboard">
        <div className="section-header">
          <FontAwesomeIcon icon={faTrophy} className="section-icon" />
          <h2 className="section-title">Leader Board</h2>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          No test takers yet
        </div>
      </section>
    );
  }

  return (
    <section className="leaderboard">
      <div className="section-header">
        <FontAwesomeIcon icon={faTrophy} className="section-icon" />
        <h2 className="section-title">Leader Board</h2>
      </div>
      <ul className="leaderboard-list">
        {topTestTakers.map((taker, index) => (
          <li key={taker.userId} className="leaderboard-entry">
            <FontAwesomeIcon icon={faTrophy} className={`medal ${getMedalClass(index)}`} />
            <img
              src={taker.profilePictureUrl || UserAvatar}
              alt={taker.username}
              className="leaderboard-avatar"
              onError={(e) => {
                e.target.src = UserAvatar;
              }}
            />
            <div className="leaderboard-info">
              <h3>{taker.username}</h3>
              <p>
                {getPlaceText(index)} • {taker.averageScore.toFixed(1)}% avg • {taker.totalTestsTaken} test{taker.totalTestsTaken !== 1 ? "s" : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Leaderboard;
