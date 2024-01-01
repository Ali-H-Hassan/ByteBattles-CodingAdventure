// Header.jsx
import React from "react";
import SearchIcon from "../../assets/search-icon.png"; // Update the path as needed
import UserAvatar from "../../assets/Profile (1).png"; // Update the path as needed

function Header() {
  return (
    <header className="main-header">
      <div className="welcome-message">
        <h1>Welcome Ali!</h1>
        <p>Here is your Profile Dashboard</p>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <img src={SearchIcon} alt="Search" />
      </div>
      <div className="profile-icon">
        <img src={UserAvatar} alt="User Profile" />
      </div>
    </header>
  );
}

export default Header;
