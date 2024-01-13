import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/LeaderboardHeader/LeaderboardHeader";
import RowComponent from "../../components/LeaderboardRow/LeaderboardRow";
import "./LeaderboardPage.css";
import AmazonLogo from "../../assets/amazon.png";

const LeaderboardPage = () => {
  const companies = [
    { id: "comp1", name: "Amazon", logo: AmazonLogo },
    { id: "comp2", name: "Company 2", logo: AmazonLogo },
  ];

  const currentCompany = companies[0];

  const userData = [
    { username: "Ali", userId: "1", city: "City1", score: 100 },
    { username: "George", userId: "2", city: "City2", score: 95 },
  ];

  const onCompanyChange = (event) => {
    console.log(event.target.value);
  };
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };
  return (
    <div className="leaderboard-page">
      <Header
        companies={companies}
        currentCompany={currentCompany}
        onCompanyChange={onCompanyChange}
      />
      <div className="leaderboard-list">
        {userData.map((user) => (
          <RowComponent
            key={user.userId}
            userId={user.userId}
            username={user.username}
            city={user.city}
            score={user.score}
          />
        ))}
      </div>
      <button
        className="leaderboard-page__back-button"
        onClick={handleBackClick}
      >
        &lt; Back
      </button>
    </div>
  );
};

export default LeaderboardPage;
