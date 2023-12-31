import React from "react";
import "./Dashboard.css";
import Logo from "../../assets/FullLogo.png";
import DashboardIcon from "../../assets/Chart.png";
import Tests from "../../assets/Edit 1.png";
import Courses from "../../assets/Document Align Left 1.png";
import Profile from "../../assets/Profile 1.png";
import DarkMode from "../../assets/Moon.png";
import Leaderboard from "../../assets/Award 5.png";
import LogOut from "../../assets/Unlock 2.png";
import UserAvatar from "../../assets/Profile (1).png";
import Search from "../../assets/search-icon.png";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="menu">
        <div className="logo-section">
          <img src={Logo} alt="Byte Battle Logo" />
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-green">
              <img src={DashboardIcon} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text menu-text-green">Dashboard</div>
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-black">
              <img src={Tests} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text">Tests</div>
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-black">
              <img src={Courses} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text">Courses</div>
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-black">
              <img src={Profile} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text">Profile</div>
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-dark">
              <img src={Leaderboard} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text menu-text-dark">Leaderboard</div>
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-dark">
              <img src={DarkMode} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text menu-text-dark">Dark mode</div>
        </div>
        <div className="menu-item">
          <div className="icon-bg">
            <div className="icon-dark">
              <img src={LogOut} alt="Byte Battle Logo" />
            </div>
          </div>
          <div className="menu-text menu-text-dark">Log Out</div>
        </div>
      </div>
      <div className="main-content">
        <header className="main-header">
          <div className="welcome-message">
            <h1>Welcome Ali!</h1>
            <p>Here is your Profile Dashboard</p>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <img src={Search} alt="User Profile" />
          </div>
          <div className="profile-icon">
            <img src={UserAvatar} alt="User Profile" />
          </div>
        </header>
        <div className="content-grid">
          <section className="recent-tests">
            <h2>Recent Tests</h2>
            <div className="test-cards-container">
              {/* Replace with dynamic content if needed */}
              <div className="test-card">
                <div className="test-card-info">
                  <h3>C Programming</h3>
                  <button className="resume-button">Resume</button>
                </div>
                <div className="test-progress">
                  <span className="progress-indicator green">75%</span>
                </div>
              </div>
              <div className="test-card">
                <div className="test-card-info">
                  <h3>Python Programming</h3>
                  <button className="resume-button">Resume</button>
                </div>
                <div className="test-progress">
                  <span className="progress-indicator red">25%</span>
                </div>
              </div>
              {/* Add more test cards as needed */}
            </div>
          </section>

          {/* Placeholder for the other 3 parts of the grid */}
          <section className="grid-section"></section>
          <section className="grid-section"></section>
          <section className="grid-section"></section>
        </div>
        {/* Rest of the main content goes here */}
      </div>
    </div>
  );
}

export default Dashboard;
