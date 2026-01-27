import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCode, faTrophy, faSpinner, faEye } from "@fortawesome/free-solid-svg-icons";
import ProblemStatement from "../../components/ProblemStatement/ProblemStatement";
import CodingEditor from "../../components/CodingEditor/CodingEditor";
import BattleResultsModal from "../../components/BattleResultsModal/BattleResultsModal";
import apiClient from "../../services/apiConfig";
import "./AIBattleMode.css";

const STORAGE_KEY = "aibattle_state";

const AIBattleMode = () => {
  const user = useSelector((state) => state.auth.user);
  const [userCode, setUserCode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingChallenge, setFetchingChallenge] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.challenge && parsed.userCode) {
          setChallenge(parsed.challenge);
          setUserCode(parsed.userCode);
          if (parsed.results) {
            setResults(parsed.results);
          }
          setFetchingChallenge(false);
          return;
        }
      } catch (e) {
        console.error("Error loading saved state:", e);
      }
    }
    
    // No saved state, fetch new challenge
    fetchRandomChallenge();
  }, []);

  // Save state whenever challenge, userCode, or results change
  useEffect(() => {
    if (challenge && userCode) {
      const stateToSave = {
        challenge,
        userCode,
        results: results || null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [challenge, userCode, results]);

  const fetchRandomChallenge = async () => {
    setFetchingChallenge(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/challenges/generate");
      const data = response.data;
      setChallenge(data);
      // Set starter code if available
      if (data.templateCode) {
        setUserCode(data.templateCode);
      } else if (data.templateCodes && data.templateCodes.javascript) {
        setUserCode(data.templateCodes.javascript);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
      setError("Failed to load challenge. Please try again.");
    } finally {
      setFetchingChallenge(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const handleSubmit = async () => {
    // If results exist, show them instead of submitting again
    if (results) {
      setShowResultsModal(true);
      return;
    }

    if (!user || !challenge) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const userId = user.id || user._id;
    const userIdInt = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    if (isNaN(userIdInt)) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    const requestBody = {
      userId: userIdInt,
      challengeId: null,
      userCode: userCode,
      language: "javascript",
      challengeTitle: challenge.title || "AI Challenge",
      challengeDescription: challenge.description || `${challenge.title}\n\n${challenge.description || ""}`
    };

    try {
      const response = await apiClient.post("/api/battle/run", requestBody);
      setResults(response.data);
      setShowResultsModal(true);
    } catch (error) {
      console.error("Error submitting code:", error);
      setError(error.response?.data?.message || "Failed to submit code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChallenge = async () => {
    // Clear saved state
    localStorage.removeItem(STORAGE_KEY);
    setResults(null);
    setShowResultsModal(false);
    setUserCode("");
    setError(null);
    setFetchingChallenge(true);
    try {
      const response = await apiClient.post("/api/challenges/generate");
      const data = response.data;
      setChallenge(data);
      if (data.templateCode) {
        setUserCode(data.templateCode);
      } else if (data.templateCodes && data.templateCodes.javascript) {
        setUserCode(data.templateCodes.javascript);
      }
    } catch (error) {
      console.error("Error fetching new challenge:", error);
      setError("Failed to load challenge. Please try again.");
    } finally {
      setFetchingChallenge(false);
    }
  };

  const handleCloseResults = () => {
    setShowResultsModal(false);
  };

  const hasResults = results !== null;

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
            className={`aibattle-submit-btn ${hasResults ? "view-results-btn" : ""}`}
            onClick={handleSubmit}
            disabled={loading || !challenge || (!hasResults && !userCode.trim())}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: "0.5rem" }} />
                Running Battle...
              </>
            ) : hasResults ? (
              <>
                <FontAwesomeIcon icon={faEye} style={{ marginRight: "0.5rem" }} />
                View Results
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
      
      {showResultsModal && results && (
        <BattleResultsModal 
          results={results} 
          userCode={userCode}
          onClose={handleCloseResults} 
        />
      )}
    </div>
  );
};

export default AIBattleMode;
