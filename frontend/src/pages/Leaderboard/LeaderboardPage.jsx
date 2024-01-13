import React from "react";
import Header from "../../components/LeaderboardHeader/LeaderboardHeader";
import RowComponent from "../../components/LeaderboardRow/LeaderboardRow";
import "./LeaderboardPage.css";
import AmazonLogo from "../../assets/amazon.png";

const LeaderboardPage = () => {
  const companies = [
    { id: "comp1", name: "Company 1", logo: AmazonLogo },
    { id: "comp2", name: "Company 2", logo: AmazonLogo },
    // ... more companies
  ];

  const currentCompany = companies[0]; // Default to the first company

  const userData = [
    { username: "user1", userId: "1", city: "City1", score: 100 },
    { username: "user2", userId: "2", city: "City2", score: 95 },
    // ... more users
  ];

  const onCompanyChange = (event) => {
    // Logic to update current company based on the event.target.value
    // This is a stub, you'd update state in a real app
    console.log(event.target.value);
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
            username={user.username}
            userId={user.userId}
            city={user.city}
            score={user.score}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
