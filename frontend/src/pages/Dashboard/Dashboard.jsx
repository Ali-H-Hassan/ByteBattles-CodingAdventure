import React from "react";
import "./Dashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";
import RecentTests from "../../components/RecentTests/RecentTests";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import UpcomingQuiz from "../../components/UpcomingQuiz/UpcomingQuiz";
import Statistics from "../../components/Statistics/Statistics";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-grid">
          <RecentTests />
          <Leaderboard />
          <UpcomingQuiz />
          <Statistics />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
