import React from "react";
import "./Leaderboard.css"; // Assuming you have a corresponding CSS file for styling
import GoldMedal from "../../assets/gold-medal.png";
import SilverMedal from "../../assets/silver-medal.png";
import BronzeMedal from "../../assets/bronze-medal.png";
import UserAvatar from "../../assets/Profile (1).png"; // Replace with dynamic avatars if needed

function Leaderboard() {
  return (
    <section className="leaderboard">
      <div className="section-header">
        <img
          src={LeaderboardIcon}
          alt="Leaderboard Icon"
          className="section-icon"
        />
        <h2 className="section-title">Leader Board</h2>
      </div>
      <ul className="leaderboard-list">
        <li className="leaderboard-entry">
          <img src={GoldMedal} alt="Gold Medal" className="medal" />
          <img
            src={UserAvatar}
            alt="First Place User"
            className="leaderboard-avatar"
          />
          <div className="leaderboard-info">
            <h3>First Place User</h3>
            <p>Details of First Place</p>
          </div>
        </li>
        <li className="leaderboard-entry">
          <img src={SilverMedal} alt="Silver Medal" className="medal" />
          <img
            src={UserAvatar}
            alt="Second Place User"
            className="leaderboard-avatar"
          />
          <div className="leaderboard-info">
            <h3>Second Place User</h3>
            <p>Details of Second Place</p>
          </div>
        </li>
        <li className="leaderboard-entry">
          <img src={BronzeMedal} alt="Bronze Medal" className="medal" />
          <img
            src={UserAvatar}
            alt="Third Place User"
            className="leaderboard-avatar"
          />
          <div className="leaderboard-info">
            <h3>Third Place User</h3>
            <p>Details of Third Place</p>
          </div>
        </li>
      </ul>
    </section>
  );
}

export default Leaderboard;
