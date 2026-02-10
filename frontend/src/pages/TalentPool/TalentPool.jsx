import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faTrophy,
  faMedal,
  faChartLine,
  faSearch,
  faStar,
  faClipboardCheck,
  faUserTie,
  faEnvelope,
  faEye,
  faSpinner,
  faChevronDown,
  faSortAmountDown,
  faFont,
  faListOl
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../services/apiConfig";
import "./TalentPool.css";

const TalentPool = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: "score", label: "Highest Score", icon: faTrophy },
    { value: "tests", label: "Most Tests", icon: faListOl },
    { value: "name", label: "Name (A-Z)", icon: faFont }
  ];

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      // Fetch top 50 candidates from the leaderboard
      const response = await apiClient.get("/api/test-results/leaderboard?topCount=50");
      setCandidates(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to load talent pool. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return { icon: faTrophy, color: "#FFD700", label: "1st" };
    if (index === 1) return { icon: faMedal, color: "#C0C0C0", label: "2nd" };
    if (index === 2) return { icon: faMedal, color: "#CD7F32", label: "3rd" };
    return { icon: faStar, color: "#00c354", label: `#${index + 1}` };
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "score-excellent";
    if (score >= 75) return "score-good";
    if (score >= 60) return "score-average";
    return "score-below";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  const filteredCandidates = candidates
    .filter((candidate) =>
      candidate.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "score") return b.averageScore - a.averageScore;
      if (sortBy === "tests") return b.totalTestsTaken - a.totalTestsTaken;
      return a.username.localeCompare(b.username);
    });

  const stats = {
    total: candidates.length,
    excellent: candidates.filter((c) => c.averageScore >= 90).length,
    good: candidates.filter((c) => c.averageScore >= 75 && c.averageScore < 90).length,
    avgScore: candidates.length > 0
      ? Math.round(candidates.reduce((sum, c) => sum + c.averageScore, 0) / candidates.length)
      : 0
  };

  if (loading) {
    return (
      <div className="talent-pool-loading">
        <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
        <p>Loading talent pool...</p>
      </div>
    );
  }

  return (
    <div className="talent-pool-page">
      {/* Hero Header */}
      <div className="talent-pool-hero">
        <div className="talent-pool-hero-content">
          <div className="talent-pool-hero-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="talent-pool-hero-text">
            <h1 className="talent-pool-hero-title">Talent Pool</h1>
            <p className="talent-pool-hero-subtitle">
              Discover top performers from your assessments
            </p>
          </div>
        </div>
        <div className="talent-pool-hero-stats">
          <div className="talent-pool-stat">
            <FontAwesomeIcon icon={faUserTie} className="stat-icon" />
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Candidates</span>
          </div>
          <div className="talent-pool-stat excellent">
            <FontAwesomeIcon icon={faTrophy} className="stat-icon" />
            <span className="stat-value">{stats.excellent}</span>
            <span className="stat-label">Top Performers</span>
          </div>
          <div className="talent-pool-stat">
            <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
            <span className="stat-value">{stats.avgScore}%</span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="talent-pool-filters">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-dropdown-container">
          <button
            className="sort-dropdown-trigger"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <FontAwesomeIcon icon={faSortAmountDown} className="sort-icon" />
            <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            <FontAwesomeIcon icon={faChevronDown} className={`chevron-icon ${showSortDropdown ? 'open' : ''}`} />
          </button>
          {showSortDropdown && (
            <div className="sort-dropdown-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`sort-dropdown-item ${sortBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortDropdown(false);
                  }}
                >
                  <FontAwesomeIcon icon={option.icon} className="option-icon" />
                  <span>{option.label}</span>
                  {sortBy === option.value && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="talent-pool-error">
          <p>{error}</p>
          <button onClick={fetchCandidates}>Retry</button>
        </div>
      )}

      {/* Candidates Grid */}
      {!error && (
        <div className="talent-pool-content">
          {filteredCandidates.length === 0 ? (
            <div className="talent-pool-empty">
              <FontAwesomeIcon icon={faUsers} className="empty-icon" />
              <h3>No Candidates Found</h3>
              <p>
                {searchTerm
                  ? "No candidates match your search criteria"
                  : "No one has taken your tests yet"}
              </p>
            </div>
          ) : (
            <div className="candidates-grid">
              {filteredCandidates.map((candidate, index) => {
                const rankBadge = getRankBadge(index);
                const scoreColorClass = getScoreColor(candidate.averageScore);

                return (
                  <div
                    key={candidate.userId}
                    className={`candidate-card ${index < 3 ? "top-candidate" : ""}`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    {/* Rank Badge */}
                    <div
                      className="candidate-rank"
                      style={{ backgroundColor: rankBadge.color }}
                    >
                      <FontAwesomeIcon icon={rankBadge.icon} />
                      <span>{rankBadge.label}</span>
                    </div>

                    {/* Profile Section */}
                    <div className="candidate-profile">
                      <div className="candidate-avatar">
                        {candidate.profilePictureUrl ? (
                          <img
                            src={candidate.profilePictureUrl}
                            alt={candidate.username}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {candidate.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h3 className="candidate-name">{candidate.username}</h3>
                    </div>

                    {/* Score Section */}
                    <div className={`candidate-score ${scoreColorClass}`}>
                      <div className="score-circle">
                        <span className="score-value">
                          {Math.round(candidate.averageScore)}%
                        </span>
                      </div>
                      <span className="score-label">
                        {getScoreLabel(candidate.averageScore)}
                      </span>
                    </div>

                    {/* Stats Section */}
                    <div className="candidate-stats">
                      <div className="candidate-stat">
                        <FontAwesomeIcon icon={faClipboardCheck} />
                        <span>{candidate.totalTestsTaken} tests</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="view-profile-btn">
                      <FontAwesomeIcon icon={faEye} />
                      <span>View Details</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div
          className="candidate-modal-overlay"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="candidate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-avatar">
                {selectedCandidate.profilePictureUrl ? (
                  <img
                    src={selectedCandidate.profilePictureUrl}
                    alt={selectedCandidate.username}
                  />
                ) : (
                  <div className="avatar-placeholder large">
                    {selectedCandidate.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="modal-title">
                <h2>{selectedCandidate.username}</h2>
                <span className={`performance-badge ${getScoreColor(selectedCandidate.averageScore)}`}>
                  {getScoreLabel(selectedCandidate.averageScore)} Performer
                </span>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedCandidate(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-stats-grid">
                <div className="modal-stat-card">
                  <FontAwesomeIcon icon={faChartLine} className="modal-stat-icon" />
                  <div className="modal-stat-info">
                    <span className="modal-stat-value">
                      {Math.round(selectedCandidate.averageScore)}%
                    </span>
                    <span className="modal-stat-label">Average Score</span>
                  </div>
                </div>
                <div className="modal-stat-card">
                  <FontAwesomeIcon icon={faClipboardCheck} className="modal-stat-icon" />
                  <div className="modal-stat-info">
                    <span className="modal-stat-value">
                      {selectedCandidate.totalTestsTaken}
                    </span>
                    <span className="modal-stat-label">Tests Completed</span>
                  </div>
                </div>
                <div className="modal-stat-card">
                  <FontAwesomeIcon icon={faTrophy} className="modal-stat-icon" />
                  <div className="modal-stat-info">
                    <span className="modal-stat-value">
                      {candidates.findIndex((c) => c.userId === selectedCandidate.userId) + 1}
                    </span>
                    <span className="modal-stat-label">Ranking</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="contact-btn">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Contact Candidate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentPool;
