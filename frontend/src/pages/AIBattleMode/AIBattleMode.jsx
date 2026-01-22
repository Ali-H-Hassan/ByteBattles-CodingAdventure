import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCode, faTrophy, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ProblemStatement from "../../components/ProblemStatement/ProblemStatement";
import CodingEditor from "../../components/CodingEditor/CodingEditor";
import BattleResultsModal from "../../components/BattleResultsModal/BattleResultsModal";
import apiClient from "../../services/apiConfig";
import "./AIBattleMode.css";

const AIBattleMode = () => {
  const user = useSelector((state) => state.auth.user);
  const [userCode, setUserCode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingChallenge, setFetchingChallenge] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomChallenge = async () => {
      setFetchingChallenge(true);
      setError(null);
      try {
        const response = await apiClient.get("/api/challenges/random");
        const data = response.data;
        setChallenge(data);
        // Set starter code if available
        if (data.templateCodes && data.templateCodes.javascript) {
          setUserCode(data.templateCodes.javascript);
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        setError("Failed to load challenge. Please try again.");
      } finally {
        setFetchingChallenge(false);
      }
    };

    fetchRandomChallenge();
  }, []);

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const handleSubmit = async () => {
    if (!user || !challenge) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const userId = user.id || user._id;
    const challengeId = challenge.id || challenge._id;

    // Ensure userId and challengeId are integers
    const userIdInt = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const challengeIdInt = typeof challengeId === 'string' ? parseInt(challengeId, 10) : challengeId;

    if (isNaN(userIdInt) || isNaN(challengeIdInt)) {
      setError("Invalid user or challenge ID");
      setLoading(false);
      return;
    }

    const requestBody = {
      userId: userIdInt,
      challengeId: challengeIdInt,
      userCode: userCode,
      language: "javascript",
    };

    try {
      const response = await apiClient.post("/api/battle/run", requestBody);
      setResults(response.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      setError(error.response?.data?.message || "Failed to submit code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChallenge = async () => {
    setResults(null);
    setUserCode("");
    setError(null);
    setFetchingChallenge(true);
    try {
      const response = await apiClient.get("/api/challenges/random");
      const data = response.data;
      setChallenge(data);
      if (data.templateCodes && data.templateCodes.javascript) {
        setUserCode(data.templateCodes.javascript);
      }
    } catch (error) {
      console.error("Error fetching new challenge:", error);
      setError("Failed to load challenge. Please try again.");
    } finally {
      setFetchingChallenge(false);
    }
  };

  return (
    <div className="aibattle-mode-container">
      <div className="aibattle-header">
        <div className="aibattle-header-content">
          <FontAwesomeIcon icon={faRobot} className="aibattle-header-icon" />
          <h1 className="aibattle-title">AI Battle Mode</h1>
        </div>
        {challenge && (
          <button className="aibattle-new-challenge-btn" onClick={handleNewChallenge} disabled={loading}>
            New Challenge
          </button>
        )}
      </div>

      {fetchingChallenge ? (
        <div className="aibattle-loading">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-spinner" />
          <p>Loading challenge...</p>
        </div>
      ) : error && !challenge ? (
        <div className="aibattle-error">
          <p>{error}</p>
          <button className="aibattle-retry-btn" onClick={handleNewChallenge}>
            Retry
          </button>
        </div>
      ) : challenge ? (
        <div className="aibattle-content">
          <div className="aibattle-problem-section">
            <ProblemStatement challenge={challenge} />
          </div>
          <div className="aibattle-editor-section">
            <div className="aibattle-editor-header">
              <FontAwesomeIcon icon={faCode} className="editor-icon" />
              <span className="editor-title">Your Solution</span>
            </div>
            <div className="aibattle-editor-wrapper">
              <CodingEditor code={userCode} handleCodeChange={handleCodeChange} />
            </div>
          </div>
          <button
            className="aibattle-submit-btn"
            onClick={handleSubmit}
            disabled={loading || !challenge || !userCode.trim()}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: "0.5rem" }} />
                Running Battle...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTrophy} style={{ marginRight: "0.5rem" }} />
                Submit & Battle
              </>
            )}
          </button>
          {error && (
            <div className="aibattle-error-message">
              {error}
            </div>
          )}
        </div>
      ) : null}
      
      {results && (
        <BattleResultsModal 
          results={results} 
          onClose={() => setResults(null)} 
        />
      )}
    </div>
  );
};

export default AIBattleMode;
