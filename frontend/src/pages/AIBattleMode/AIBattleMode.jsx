import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCode, faTrophy, faSpinner, faEye, faExclamationTriangle, faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";
import ProblemStatement from "../../components/ProblemStatement/ProblemStatement";
import CodingEditor from "../../components/CodingEditor/CodingEditor";
import BattleResultsModal from "../../components/BattleResultsModal/BattleResultsModal";
import apiClient from "../../services/apiConfig";
import "./AIBattleMode.css";

const getStorageKey = (userId) => `aibattle_state_${userId}`;

const AIBattleMode = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;
  const [userCode, setUserCode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingChallenge, setFetchingChallenge] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showAIErrorModal, setShowAIErrorModal] = useState(false);

  // Load saved state on mount or when user changes
  useEffect(() => {
    if (!userId) {
      setFetchingChallenge(false);
      return;
    }

    const storageKey = getStorageKey(userId);
    const savedState = localStorage.getItem(storageKey);
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
  }, [userId]);

  // Save state whenever challenge, userCode, or results change
  useEffect(() => {
    if (userId && challenge && userCode) {
      const storageKey = getStorageKey(userId);
      const stateToSave = {
        challenge,
        userCode,
        results: results || null
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }
  }, [userId, challenge, userCode, results]);

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
      const errorMessage = error.response?.data?.message || "Failed to submit code. Please try again.";

      // Check if it's an AI-related error
      if (errorMessage.toLowerCase().includes("ai") ||
          errorMessage.toLowerCase().includes("generate") ||
          errorMessage.toLowerCase().includes("unable")) {
        setShowAIErrorModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAIErrorModal = () => {
    setShowAIErrorModal(false);
  };

  const handleRetryBattle = () => {
    setShowAIErrorModal(false);
    handleSubmit();
  };

  const handleNewChallenge = async () => {
    // Clear saved state for this user
    if (userId) {
      localStorage.removeItem(getStorageKey(userId));
    }
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

      {showAIErrorModal && (
        <div className="ai-error-modal-overlay" onClick={handleCloseAIErrorModal}>
          <div className="ai-error-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ai-error-modal-close" onClick={handleCloseAIErrorModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="ai-error-modal-content">
              <div className="ai-error-icon-container">
                <FontAwesomeIcon icon={faRobot} className="ai-error-robot-icon" />
                <FontAwesomeIcon icon={faExclamationTriangle} className="ai-error-warning-icon" />
              </div>

              <h2 className="ai-error-title">AI Opponent Unavailable</h2>

              <p className="ai-error-message">
                Our AI opponent is taking a quick break! This can happen when the AI service is temporarily busy or experiencing issues.
              </p>

              <div className="ai-error-suggestions">
                <p className="ai-error-suggestions-title">What you can do:</p>
                <ul>
                  <li>Wait a moment and try again</li>
                  <li>Check your code for any syntax errors</li>
                  <li>Try a new challenge</li>
                </ul>
              </div>

              <div className="ai-error-actions">
                <button className="ai-error-retry-btn" onClick={handleRetryBattle}>
                  <FontAwesomeIcon icon={faRedo} style={{ marginRight: "0.5rem" }} />
                  Try Again
                </button>
                <button className="ai-error-new-challenge-btn" onClick={() => { handleCloseAIErrorModal(); handleNewChallenge(); }}>
                  New Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBattleMode;
