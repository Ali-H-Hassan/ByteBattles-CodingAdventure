import React, { useState } from "react";
import UserAvatar from "../../assets/Profile (1).png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./DashHeader.css";

function HeaderDashboard({ username, profilePic }) {
  const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5057";
  const [imageError, setImageError] = useState(false);
  
  // Handle different profile picture URL formats
  let profileImageSrc = UserAvatar;
  if (profilePic && !imageError) {
    if (profilePic.startsWith('http')) {
      profileImageSrc = profilePic;
    } else if (profilePic.startsWith('/')) {
      profileImageSrc = `${apiBaseUrl}${profilePic}`;
    } else {
      profileImageSrc = `${apiBaseUrl}/${profilePic}`;
    }
  }
  
  return (
    <header className="main-header">
      <div className="welcome-message">
        <h1>Welcome, {username}!</h1>
        <p>Here is your Dashboard</p>
      </div>
      <div className="profile-icon">
        {profilePic && !imageError ? (
          <img 
            src={profileImageSrc} 
            alt="User Profile"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <FontAwesomeIcon 
            icon={faUserCircle} 
            className="profile-icon-svg"
          />
        )}
      </div>
    </header>
  );
}

export default HeaderDashboard;
