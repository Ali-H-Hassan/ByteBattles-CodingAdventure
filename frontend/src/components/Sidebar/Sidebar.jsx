import React, { useState, useEffect } from "react";
import Logo from "../../assets/FullLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFileAlt,
  faBook,
  faUser,
  faClipboardCheck,
  faRobot,
  faSignOutAlt,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import LogoutConfirmModal from "../LogoutConfirmModal/LogoutConfirmModal";
import "./Sidebar.css";

function Sidebar({ onOptionSelect, userType, selectedOption, onCollapseChange }) {
  const [selected, setSelected] = useState(selectedOption || "dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Sync with parent component's selected option
  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  // Notify parent of collapse state change
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const handleOptionSelect = (option) => {
    setSelected(option);

    if (option === "logout") {
      setShowLogoutConfirm(true);
    } else {
      onOptionSelect(option);
    }
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
    setSelected(selectedOption || "dashboard");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-section">
        {!isCollapsed && <img src={Logo} alt="Byte Battle Logo" />}
        <button className="toggle-button" onClick={toggleSidebar} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      <div className="menu-items-container">
        <div
          className={`menu-item ${selected === "dashboard" ? "selected" : ""}`}
          onClick={() => handleOptionSelect("dashboard")}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
          {!isCollapsed && <div className="menu-text">Dashboard</div>}
        </div>

        <div
          className={`menu-item ${selected === "tests" ? "selected" : ""}`}
          onClick={() => handleOptionSelect("tests")}
          title={isCollapsed ? "Tests" : ""}
        >
          <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
          {!isCollapsed && <div className="menu-text">Tests</div>}
        </div>

        <div
          className={`menu-item ${selected === "profile" ? "selected" : ""}`}
          onClick={() => handleOptionSelect("profile")}
          title={isCollapsed ? "Profile" : ""}
        >
          <FontAwesomeIcon icon={faUser} className="menu-icon" />
          {!isCollapsed && <div className="menu-text">Profile</div>}
        </div>

        {userType !== "company" && (
          <>
            <div
              className={`menu-item ${selected === "courses" ? "selected" : ""}`}
              onClick={() => handleOptionSelect("courses")}
              title={isCollapsed ? "Courses" : ""}
            >
              <FontAwesomeIcon icon={faBook} className="menu-icon" />
              {!isCollapsed && <div className="menu-text">Courses</div>}
            </div>

            <div
              className={`menu-item ${
                selected === "results" || selected === "leaderboard" ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect("results")}
              title={isCollapsed ? "Results" : ""}
            >
              <FontAwesomeIcon icon={faClipboardCheck} className="menu-icon" />
              {!isCollapsed && <div className="menu-text">Results</div>}
            </div>

            <div
              className={`menu-item ${selected === "battle" ? "selected" : ""}`}
              onClick={() => handleOptionSelect("battle")}
              title={isCollapsed ? "AI Battle Mode" : ""}
            >
              <FontAwesomeIcon icon={faRobot} className="menu-icon" />
              {!isCollapsed && <div className="menu-text">AI Battle Mode</div>}
            </div>
          </>
        )}
      </div>

      <div className="menu-footer">
        <div
          className={`menu-item menu-item-logout ${selected === "logout" ? "selected" : ""}`}
          onClick={() => handleOptionSelect("logout")}
          title={isCollapsed ? "Log Out" : ""}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
          {!isCollapsed && <div className="menu-text">Log Out</div>}
        </div>
      </div>

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
}

export default Sidebar;
