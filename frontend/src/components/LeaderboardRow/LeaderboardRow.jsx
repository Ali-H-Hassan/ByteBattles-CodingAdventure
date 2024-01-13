import React from "react";
import "./LeaderboardRow.css";

const RowComponent = ({ avatarUrl, username, userId, city, score }) => {
  return (
    <div className="leaderboard-row">
      <div className="leaderboard-row__avatar-container">
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          className="leaderboard-row__avatar"
        />
      </div>
      <div className="leaderboard-row__username">{username}</div>
      <div className="leaderboard-row__userid">{userId}</div>
      <div className="leaderboard-row__city">{city}</div>
      <div className="leaderboard-row__score">{score}</div>
    </div>
  );
};

export default RowComponent;
