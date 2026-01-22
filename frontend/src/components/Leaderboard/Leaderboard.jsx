import React from "react";
import "./Leaderboard.css";
import UserAvatar from "../../assets/Profile (1).png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

function Leaderboard() {
  return (
    <section className="leaderboard">
      <div className="section-header">
        <FontAwesomeIcon icon={faTrophy} className="section-icon" />
        <h2 className="section-title">Leader Board</h2>
      </div>
      <ul className="leaderboard-list">
        <li className="leaderboard-entry">
          <FontAwesomeIcon icon={faTrophy} className="medal medal-gold" />
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
          <FontAwesomeIcon icon={faTrophy} className="medal medal-silver" />
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
          <FontAwesomeIcon icon={faTrophy} className="medal medal-bronze" />
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
