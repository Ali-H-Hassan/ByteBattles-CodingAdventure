import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Byte Battle</h1>
      <nav className="navigation">
        <a href="/practice" className="nav-link">
          Practice
        </a>
        <a href="/explore" className="nav-link">
          Explore
        </a>
        {/* Add an onClick handler if using react-router */}
        <button className="nav-link signup">Sign Up</button>
      </nav>
    </header>
  );
};

export default Header;
