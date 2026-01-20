import React from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const handleAuthButtonClick = () => {
    if (isLoginPage) {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={handleLogoClick}>
        Byte Battle
      </h1>
      <nav className="navigation">
        <button className="nav-link signup" onClick={handleAuthButtonClick}>
          {isLoginPage ? "Sign Up" : "Log In"}
        </button>
      </nav>
    </header>
  );
};

export default Header;
