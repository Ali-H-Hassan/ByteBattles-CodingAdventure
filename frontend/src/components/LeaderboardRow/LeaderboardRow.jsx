import React from "react";
import "./LeaderboardRow.css";

const RowComponent = ({ username, userId, city, score }) => {
  return (
    <div className="leaderboard-row">
      <div>{username}</div>
      <div>{userId}</div>
      <div>{city}</div>
      <div>{score}</div>
    </div>
  );
};

export default RowComponent;
