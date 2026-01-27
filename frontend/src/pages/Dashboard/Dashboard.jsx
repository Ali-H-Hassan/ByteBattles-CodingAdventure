import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";
import RecentTests from "../../components/RecentTests/RecentTests";
import Results from "../../components/Results/Results";
import AIBattleStats from "../../components/AIBattleStats/AIBattleStats";
import Statistics from "../../components/Statistics/Statistics";
import CoursesDisplay from "../../components/CoursesDisplay/CoursesDisplay";
import Profile from "../../components/Profile/Profile";
import Tests from "../../pages/Tests/Test";
import ResultsPage from "../Results/ResultsPage";
import AIBattleMode from "../../pages/AIBattleMode/AIBattleMode";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "User";
  const profilePic = user?.profilePictureUrl;
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);


  const handleOptionSelect = (option) => {
    if (option === "logout") {
      dispatch(logout());
      navigate("/");
    } else {
      setSelectedOption(option);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar 
        onOptionSelect={handleOptionSelect} 
        selectedOption={selectedOption} 
        userType={user?.userType}
        onCollapseChange={setIsSidebarCollapsed}
      />

      <div className={`main-content ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {selectedOption === "dashboard" && (
          <Header username={username} profilePic={profilePic} />
        )}
        <div className="content-grid">
          {selectedOption === "dashboard" && (
            <>
              <RecentTests />
              <Results />
              <AIBattleStats onNavigateToBattle={() => setSelectedOption("battle")} />
              <Statistics />
            </>
          )}
        </div>
        {selectedOption === "courses" && <CoursesDisplay />}
        {selectedOption === "profile" && <Profile />}
        {selectedOption === "tests" && <Tests />}
        {selectedOption === "results" && <ResultsPage />}
        {selectedOption === "leaderboard" && <ResultsPage />}
        {selectedOption === "battle" && <AIBattleMode />}
      </div>
    </div>
  );
}

export default Dashboard;
