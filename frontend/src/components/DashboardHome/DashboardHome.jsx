import React from "react";
import TotalTests from "./TotalTests";
import Leaderboard from "../Leaderboard/Leaderboard";
import "./DashboardHome.css";

function DashboardHome() {
  return (
    <div className="dashboard-home">
      <TotalTests />
      <Leaderboard />
    </div>
  );
}

export default DashboardHome;
