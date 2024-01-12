import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardHeader.css";

const Header = ({ companies, currentCompany, onCompanyChange }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <header>
      <div>
        <img src={currentCompany.logo} alt="Company Logo" />
        <select onChange={onCompanyChange}>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleBackClick}>Back</button>
    </header>
  );
};

export default Header;
