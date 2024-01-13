import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardHeader.css";

const Header = ({ companies, currentCompany, onCompanyChange }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="leaderboard-header">
      <div className="leaderboard-header__logo-container">
        <img
          src={currentCompany.logo}
          alt="Company Logo"
          className="leaderboard-header__logo"
        />
        <select
          onChange={onCompanyChange}
          className="leaderboard-header__select"
        >
          {companies.map((company) => (
            <option
              key={company.id}
              value={company.id}
              className="leaderboard-header__option"
            >
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleBackClick} className="leaderboard-header__button">
        Back
      </button>
    </header>
  );
};

export default Header;
