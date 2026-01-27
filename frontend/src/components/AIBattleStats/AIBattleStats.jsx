import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser, faTrophy, faFistRaised, faRocket } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../services/apiConfig";
import "./AIBattleStats.css";

const AIBattleStats = ({ onNavigateToBattle }) => {
  const [battleStats, setBattleStats] = useState({
    userWins: 0,
    aiWins: 0,
    ties: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattleStats = async () => {
      try {
        const response = await apiClient.get("/api/battle/results");
        const results = response.data || [];
        
        let userWins = 0;
        let aiWins = 0;
        let ties = 0;

        results.forEach((result) => {
          if (result.winner === "user") {
            userWins++;
          } else if (result.winner === "ai") {
            aiWins++;
          } else if (result.winner === "tie") {
            ties++;
          }
        });

        setBattleStats({
          userWins,
          aiWins,
          ties,
          total: results.length
        });
      } catch (error) {
        console.error("Error fetching battle stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBattleStats();
  }, []);

  const handleBattleClick = () => {
    if (onNavigateToBattle) {
      onNavigateToBattle();
    }
  };

  const getButtonText = () => {
    if (battleStats.total === 0) {
      return "Start the War";
    } else if (battleStats.userWins > battleStats.aiWins) {
      return "Keep it Up";
    } else if (battleStats.aiWins > battleStats.userWins) {
      return "Take Revenge";
    } else {
      return "Continue Battle";
    }
  };

  const getButtonIcon = () => {
    if (battleStats.total === 0) {
      return faRocket;
    } else if (battleStats.userWins > battleStats.aiWins) {
      return faTrophy;
    } else if (battleStats.aiWins > battleStats.userWins) {
      return faFistRaised;
    } else {
      return faRobot;
    }
  };

  const getButtonClass = () => {
    if (battleStats.total === 0) {
      return "battle-button-start";
    } else if (battleStats.userWins > battleStats.aiWins) {
      return "battle-button-winning";
    } else if (battleStats.aiWins > battleStats.userWins) {
      return "battle-button-losing";
    } else {
      return "battle-button-tie";
    }
  };

  if (loading) {
    return (
      <section className="ai-battle-stats">
        <div className="battle-header">
          <FontAwesomeIcon icon={faRobot} className="battle-header-icon" />
          <h2 className="section-title">User VS AI</h2>
        </div>
        <div className="battle-loading">Loading...</div>
      </section>
    );
  }

  return (
    <section className="ai-battle-stats">
      <div className="battle-header">
        <FontAwesomeIcon icon={faRobot} className="battle-header-icon" />
        <h2 className="section-title">User VS AI</h2>
      </div>
      
      <div className="battle-score-container">
        <div className="battle-score">
          <div className="score-item user-score">
            <FontAwesomeIcon icon={faUser} className="score-icon" />
            <span className="score-value">{battleStats.userWins}</span>
          </div>
          <div className="score-separator">to</div>
          <div className="score-item ai-score">
            <span className="score-value">{battleStats.aiWins}</span>
            <FontAwesomeIcon icon={faRobot} className="score-icon" />
          </div>
        </div>
        {battleStats.ties > 0 && (
          <div className="ties-indicator">
            {battleStats.ties} {battleStats.ties === 1 ? "tie" : "ties"}
          </div>
        )}
      </div>

      <button
        className={`battle-action-button ${getButtonClass()}`}
        onClick={handleBattleClick}
      >
        <FontAwesomeIcon icon={getButtonIcon()} className="button-icon" />
        <span>{getButtonText()}</span>
      </button>
    </section>
  );
};

export default AIBattleStats;

