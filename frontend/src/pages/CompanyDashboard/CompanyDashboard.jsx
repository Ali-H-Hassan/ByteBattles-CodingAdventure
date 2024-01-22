import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/authActions";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";
import CompanyTestsDisplay from "../CompanyTestsDisplay/CompanyTestsDisplay";
import EditProfile from "../../components/EditProfile/EditProfile";

import "./CompanyDashboard.css";

function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalTests = 10; // Placeholder value

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "Company";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
        {selectedOption !== "profile" && <Header username={username} />}
        {selectedOption !== "profile" && (
          <div className="content-grid">
            {selectedOption === "dashboard"}
            {selectedOption === "tests" && <CompanyTestsDisplay />}
          </div>
        )}
        {selectedOption === "profile" && <EditProfile />}
      </div>
    </div>
  );
}

export default CompanyDashboard;
