import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const handleCreateAccountClick = () => {
    navigate("/login");
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
        <a href="/practice" className="nav-link">
          Practice
        </a>
        <a href="/explore" className="nav-link">
          Explore
        </a>
        <button className="nav-link signup" onClick={handleCreateAccountClick}>
          Log In
        </button>
      </nav>
    </header>
  );
};

export default Header;
