import React from "react";
import Header from "../../components/LeaderboardHeader/LeaderboardHeader";
import RowComponent from "../../components/LeaderboardRow/LeaderboardRow";
import "./LeaderboardPage.css";

const LeaderboardPage = ({
  companies,
  userData,
  currentCompany,
  onCompanyChange,
}) => {
  return (
    <div className="leaderboard-page">
      <Header
        companies={companies}
        currentCompany={currentCompany}
        onCompanyChange={onCompanyChange}
      />
      <div className="leaderboard">
        {userData.map((user, index) => (
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
