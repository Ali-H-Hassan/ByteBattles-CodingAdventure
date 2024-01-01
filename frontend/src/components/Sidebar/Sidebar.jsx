import React from "react";
import Logo from "../../assets/FullLogo.png";
import DashboardIcon from "../../assets/Chart.png";
import Tests from "../../assets/Edit 1.png";
import Courses from "../../assets/Document Align Left 1.png";
import Profile from "../../assets/Profile 1.png";
import DarkMode from "../../assets/Moon.png";
import Leaderboard from "../../assets/Award 5.png";
import LogOut from "../../assets/Unlock 2.png";

function Sidebar() {
  return (
    <div className="menu">
      <div className="logo-section">
        <img src={Logo} alt="Byte Battle Logo" />
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-green">
            <img src={DashboardIcon} alt="Dashboard Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-green">Dashboard</div>
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-black">
            <img src={Tests} alt="Tests Icon" />
          </div>
        </div>
        <div className="menu-text">Tests</div>
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-black">
            <img src={Courses} alt="Courses Icon" />
          </div>
        </div>
        <div className="menu-text">Courses</div>
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-black">
            <img src={Profile} alt="Profile Icon" />
          </div>
        </div>
        <div className="menu-text">Profile</div>
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-dark">
            <img src={Leaderboard} alt="Leaderboard Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-dark">Leaderboard</div>
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-dark">
            <img src={DarkMode} alt="Dark Mode Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-dark">Dark Mode</div>
      </div>
      <div className="menu-item">
        <div className="icon-bg">
          <div className="icon-dark">
            <img src={LogOut} alt="Log Out Icon" />
          </div>
        </div>
        <div className="menu-text menu-text-dark">Log Out</div>
      </div>
    </div>
  );
}

export default Sidebar;
