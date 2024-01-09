import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";
import RecentTests from "../../components/RecentTests/RecentTests";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import UpcomingQuiz from "../../components/UpcomingQuiz/UpcomingQuiz";
import Statistics from "../../components/Statistics/Statistics";
import CoursesDisplay from "../../components/CoursesDisplay/CoursesDisplay";
import EditProfile from "../../components/EditProfile/EditProfile";

import "./Dashboard.css";
function Dashboard() {
  const { authState } = useContext(AuthContext);
  const username = authState.user ? authState.user.username : "User";
  const [selectedOption, setSelectedOption] = useState("dashboard");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="dashboard">
      <Sidebar onOptionSelect={handleOptionSelect} />

      <div className="main-content">
        {selectedOption === "dashboard" && <Header username={username} />}
        <div className="content-grid">
          {selectedOption === "dashboard" && (
            <>
              <RecentTests />
              <Leaderboard />
              <UpcomingQuiz />
              <Statistics />
            </>
          )}
          {selectedOption === "courses" && <CoursesDisplay />}
          {selectedOption === "profile" && <EditProfile />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
