import React from "react";
import SearchIcon from "../../assets/search-icon.png";
import UserAvatar from "../../assets/Profile (1).png";
import "./DashHeader.css";

function HeaderDashboard({ username, profilePic }) {
  const profileImageSrc = profilePic
    ? `http://localhost:3000/${profilePic}`
    : UserAvatar;
  return (
    <header className="main-header">
      <div className="welcome-message">
        <h1>Welcome, {username}!</h1>
        <p>Here is your Profile Dashboard</p>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <img src={SearchIcon} alt="Search" />
      </div>
      <div className="profile-icon">
        <img src={profileImageSrc} alt="User Profile" />
      </div>
    </header>
  );
}

export default HeaderDashboard;
