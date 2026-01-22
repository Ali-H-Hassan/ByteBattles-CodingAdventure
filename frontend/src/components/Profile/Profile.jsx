import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import EditProfile from "../EditProfile/EditProfile";
import Avatar from "../../assets/Profile (1).png";
import "./Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Listen for profile update success
    const handleStorageChange = () => {
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    };

    // Check if profile was just updated
    const profileUpdated = sessionStorage.getItem("profileUpdated");
    if (profileUpdated === "true") {
      handleStorageChange();
      sessionStorage.removeItem("profileUpdated");
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSuccess = () => {
    setShowSuccess(true);
    setIsEditing(false);
    sessionStorage.setItem("profileUpdated", "true");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return <EditProfile onSuccess={handleEditSuccess} onCancel={handleCancelEdit} />;
  }

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5057";
  let profileImageSrc = Avatar;
  if (user.profilePictureUrl) {
    if (user.profilePictureUrl.startsWith("http")) {
      profileImageSrc = user.profilePictureUrl;
    } else if (user.profilePictureUrl.startsWith("/")) {
      profileImageSrc = `${apiBaseUrl}${user.profilePictureUrl}`;
    } else {
      profileImageSrc = `${apiBaseUrl}/${user.profilePictureUrl}`;
    }
  }

  return (
    <div className="profile-wrapper">
      {showSuccess && (
        <div className="profile-success-message">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>Profile updated successfully!</span>
        </div>
      )}
      
      <div className="profile-header-section">
        <div className="profile-avatar-wrapper">
          <img src={profileImageSrc} alt="Profile" className="profile-avatar-image" />
        </div>
        <div className="profile-header-content">
          <h1 className="profile-display-name">{user.name || user.username || "User"}</h1>
          <p className="profile-display-username">@{user.username}</p>
          <button className="profile-edit-button" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-info-section">
          <h2 className="profile-section-heading">Personal Information</h2>
          <div className="profile-details-list">
            <div className="profile-detail-row">
              <FontAwesomeIcon icon={faUser} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Full Name</span>
                <span className="profile-detail-value">{user.name || "Not set"}</span>
              </div>
            </div>
            <div className="profile-detail-row">
              <FontAwesomeIcon icon={faEnvelope} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Email</span>
                <span className="profile-detail-value">{user.email || "Not set"}</span>
              </div>
            </div>
            <div className="profile-detail-row">
              <FontAwesomeIcon icon={faPhone} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Contact Number</span>
                <span className="profile-detail-value">{user.contactNumber || "Not set"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-info-section">
          <h2 className="profile-section-heading">Location</h2>
          <div className="profile-details-list">
            <div className="profile-detail-row">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Address</span>
                <span className="profile-detail-value">{user.address || "Not set"}</span>
              </div>
            </div>
            <div className="profile-detail-row">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Country</span>
                <span className="profile-detail-value">{user.country || "Not set"}</span>
              </div>
            </div>
            <div className="profile-detail-row">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">City</span>
                <span className="profile-detail-value">{user.city || "Not set"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

