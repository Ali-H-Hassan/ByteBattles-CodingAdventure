import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardHeader.css";
import AmazonLogo from "../../assets/amazon.png";

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
      </div>
      <select onChange={onCompanyChange} className="leaderboard-header__select">
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
    </header>
  );
};

export default Header;
