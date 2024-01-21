import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/authActions";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/DashHeader/DashHeader";

import "./CompanyDashboard.css";

function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <Sidebar onOptionSelect={handleOptionSelect} />

      <div className="main-content">
        <Header username={username} />
        <div className="content-grid"></div>
      </div>
    </div>
  );
}

export default CompanyDashboard;