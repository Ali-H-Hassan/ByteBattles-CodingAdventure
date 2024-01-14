import React from "react";
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
  return (
    <div className="menu">
      <div className="logo-section">
        <img src={Logo} alt="Byte Battle Logo" />
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("dashboard")}>
        <div className="icon-bg">
          <div className="icon-green">
            <img src={DashboardIcon} alt="Dashboard Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-green">Dashboard</div>
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("tests")}>
        <div className="icon-bg">
          <div className="icon-black">
            <img src={TestsIcon} alt="Tests Icon" />
          </div>
        </div>
        <div className="menu-text">Tests</div>
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("courses")}>
        <div className="icon-bg">
          <div className="icon-black">
            <img src={CoursesIcon} alt="Courses Icon" />
          </div>
        </div>
        <div className="menu-text">Courses</div>
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("profile")}>
        <div className="icon-bg">
          <div className="icon-black">
            <img src={ProfileIcon} alt="Profile Icon" />
          </div>
        </div>
        <div className="menu-text">Profile</div>
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("leaderboard")}>
        <div className="icon-bg">
          <div className="icon-dark">
            <img src={LeaderboardIcon} alt="Leaderboard Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-dark">Leaderboard</div>
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("battle")}>
        <div className="icon-bg">
          <div className="icon-dark">
            <img src={BattleIcon} alt="AI Battle Mode Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-dark">AI Battle Mode</div>
      </div>
      <div className="menu-item" onClick={() => onOptionSelect("logout")}>
        <div className="icon-bg">
          <div className="icon-dark">
            <img src={LogOutIcon} alt="Log Out Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-dark">Log Out</div>
      </div>
    </div>
  );
}

export default Sidebar;
