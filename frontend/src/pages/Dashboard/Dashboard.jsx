import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";
import RecentTests from "../../components/RecentTests/RecentTests";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import UpcomingQuiz from "../../components/UpcomingQuiz/UpcomingQuiz";
import Statistics from "../../components/Statistics/Statistics";
import "./Dashboard.css";

function Dashboard() {
  // Using AuthContext to access the user's information
  const { authState } = useContext(AuthContext);
  const username = authState.user ? authState.user.username : "User";

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        {/* Pass the username to the Header component */}
        <Header username={username} />
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
