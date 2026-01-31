import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";
import CompanyTestsDisplay from "../CompanyTestsDisplay/CompanyTestsDisplay";
import Profile from "../../components/Profile/Profile";
import DashboardHome from "../../components/DashboardHome/DashboardHome";
import "./CompanyDashboard.css";

function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "Company";
  const profilePic = user?.profilePictureUrl;

  useEffect(() => {
    // Wait for session restoration to complete before redirecting
    if (loading || (token && !isAuthenticated)) {
      return; // Still loading/restoring session
    }

    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, token, navigate]);

  const [selectedOption, setSelectedOption] = useState("dashboard");

  const handleOptionSelect = (option) => {
    if (option === "logout") {
      dispatch(logout());
      navigate("/");
    } else {
      setSelectedOption(option);
    }
  };

  return (
    <div className="company-dashboard">
      <Sidebar onOptionSelect={handleOptionSelect} userType="company" />

      <div className="main-content">
        {selectedOption !== "profile" && selectedOption !== "tests" && (
          <Header 
            username={username} 
            profilePic={profilePic}
            onProfileClick={() => setSelectedOption("profile")}
          />
        )}
        {selectedOption !== "profile" && selectedOption === "tests" && (
          <CompanyTestsDisplay />
        )}
        {selectedOption === "profile" && <Profile />}
        {selectedOption === "dashboard" && <DashboardHome />}
      </div>
    </div>
  );
}

export default CompanyDashboard;
