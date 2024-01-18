import React, { useState } from "react";
import Logo from "../../assets/FullLogo.png";
import DashboardIcon from "../../assets/Chart.png";
import TestsIcon from "../../assets/Edit 1.png";
import CoursesIcon from "../../assets/Document Align Left 1.png";
import ProfileIcon from "../../assets/Profile 1.png";
import BattleIcon from "../../assets/Moon.png";
import LeaderboardIcon from "../../assets/Award 5.png";
import LogOutIcon from "../../assets/Unlock 2.png";
import "./Sidebar.css";

function Sidebar({ onOptionSelect }) {
  const [selected, setSelected] = useState("dashboard");

  const handleOptionSelect = (option) => {
    setSelected(option);
    onOptionSelect(option);
  };

  return (
    <div className="menu">
      <div className="logo-section">
        <img src={Logo} alt="Byte Battle Logo" />
      </div>
      <div
        className={`menu-item ${selected === "dashboard" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("dashboard")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={DashboardIcon} alt="Dashboard Icon" />
          </div>
        </div>
        <div className="menu-text">Dashboard</div>
      </div>
      <div
        className={`menu-item ${selected === "tests" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("tests")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={TestsIcon} alt="Tests Icon" />
          </div>
        </div>
        <div className="menu-text">Tests</div>
      </div>
      <div
        className={`menu-item ${selected === "courses" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("courses")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={CoursesIcon} alt="Courses Icon" />
          </div>
        </div>
        <div className="menu-text">Courses</div>
      </div>
      <div
        className={`menu-item ${selected === "profile" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("profile")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={ProfileIcon} alt="Profile Icon" />
          </div>
        </div>
        <div className="menu-text">Profile</div>
      </div>
      <div
        className={`menu-item ${selected === "leaderboard" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("leaderboard")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={LeaderboardIcon} alt="Leaderboard Icon" />
          </div>
        </div>
        <div className="menu-text">Leaderboard</div>
      </div>
      <div
        className={`menu-item ${selected === "battle" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("battle")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={BattleIcon} alt="AI Battle Mode Icon" />
          </div>
        </div>
        <div className="menu-text">AI Battle Mode</div>
      </div>
      <div
        className={`menu-item ${selected === "logout" ? "selected" : ""}`}
        onClick={() => handleOptionSelect("logout")}
      >
        <div className="icon-bg">
          <div className="icon">
            <img src={LogOutIcon} alt="Log Out Icon" />
          </div>
        </div>
        <div className="menu-text">Log Out</div>
      </div>
    </div>
  );
}

export default Sidebar;
