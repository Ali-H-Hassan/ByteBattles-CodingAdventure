import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCompanyTests, deleteTest } from "../../redux/test/testActions";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import { fetchTestResultsByTestId } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faPlus, faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
import "./CompanyTestsDisplay.css";

const CompanyTestsDisplay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const companyId = user?.id || user?._id; // Support both id (SQL) and _id (MongoDB)
  const { companyTests, loading, error } = useSelector((state) => state.test);
  const [deletingTestId, setDeletingTestId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [testResultsMap, setTestResultsMap] = useState({});
  const [loadingResults, setLoadingResults] = useState({});
  const [showTestTakersModal, setShowTestTakersModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testTakers, setTestTakers] = useState([]);
  const [showTakerDetails, setShowTakerDetails] = useState(false);
  const [selectedTaker, setSelectedTaker] = useState(null);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyTests(companyId));
    }
  }, [dispatch, companyId]);

  const loadTestResults = async (testId) => {
    if (loadingResults[testId]) {
      return testResultsMap[testId] || [];
    }

    setLoadingResults(prev => ({ ...prev, [testId]: true }));
    try {
      const results = await dispatch(fetchTestResultsByTestId(testId));
      console.log("Loaded test results for test", testId, ":", results);
      
      // Ensure results is an array
      const resultsArray = Array.isArray(results) ? results : (results ? [results] : []);
      
      // Filter out company users
      const filteredResults = resultsArray.filter(taker => {
        const userType = taker.userType || taker.UserType;
        const isCompany = userType === "company";
        if (isCompany) {
          console.log("Filtering out company user:", taker.username || taker.Username);
        }
        return !isCompany;
      });
      console.log("Filtered results (excluding companies):", filteredResults);
      setTestResultsMap(prev => ({ ...prev, [testId]: filteredResults }));
      return filteredResults;
    } catch (error) {
      console.error("Error loading test results:", error);
      return [];
    } finally {
      setLoadingResults(prev => ({ ...prev, [testId]: false }));
    }
  };

  const handleViewTestTakers = async (test) => {
    const testId = test.id || test._id;
    setSelectedTest(test);
    setShowTestTakersModal(true);
    
    // Always load fresh data when opening modal
    const results = await loadTestResults(testId);
    
    // Filter out company users on frontend as well (safety measure)
    const filteredResults = (results || []).filter(taker => {
      const userType = taker.userType || taker.UserType;
      return userType !== "company";
    });
    
    setTestTakers(filteredResults);
  };

  // Update test takers list when results are loaded
  useEffect(() => {
    if (showTestTakersModal && selectedTest) {
      const testId = selectedTest.id || selectedTest._id;
      const results = testResultsMap[testId];
      if (results) {
        // Filter out company users
        const filteredResults = results.filter(taker => {
          const userType = taker.userType || taker.UserType;
          return userType !== "company";
        });
        setTestTakers(filteredResults);
      }
    }
  }, [testResultsMap, showTestTakersModal, selectedTest]);

  const handleTakerClick = (taker) => {
    setSelectedTaker(taker);
    setShowTakerDetails(true);
  };

  const handleCloseTakersModal = () => {
    setShowTestTakersModal(false);
    setSelectedTest(null);
    setTestTakers([]);
  };

  const handleCloseTakerDetails = () => {
    setShowTakerDetails(false);
    setSelectedTaker(null);
  };

  const handleCreateTest = () => {
    navigate("/create-test");
  };

  const handleViewTest = (testId) => {
    dispatch(fetchTestById(testId));
    navigate(`/tests/${testId}`);
  };

  const handleDeleteClick = (test) => {
    setTestToDelete(test);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;
    
    const testId = testToDelete.id || testToDelete._id;
    setDeletingTestId(testId);
    
    try {
      await dispatch(deleteTest(testId));
      // Refresh the tests list
      if (companyId) {
        dispatch(fetchCompanyTests(companyId));
      }
      setShowDeleteConfirm(false);
      setTestToDelete(null);
    } catch (error) {
      console.error("Error deleting test:", error);
    } finally {
      setDeletingTestId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setTestToDelete(null);
  };

  if (loading) return <div className="company-tests-loading">Loading...</div>;
  if (error) return <div className="company-tests-error">Error: {error}</div>;

  return (
    <div className="company-tests-container">
      <div className="company-tests-header">
        <h2 className="company-tests-title">My Tests</h2>
        <button className="create-test-btn" onClick={handleCreateTest}>
          <FontAwesomeIcon icon={faPlus} />
          Create Test
        </button>
      </div>

      {!companyTests || companyTests.length === 0 ? (
        <div className="company-tests-empty">
          <p>No tests found. Create your first test to get started!</p>
          <button className="create-test-btn-empty" onClick={handleCreateTest}>
            <FontAwesomeIcon icon={faPlus} />
            Create Test
          </button>
        </div>
      ) : (
        <div className="company-tests-table-wrapper">
          <table className="company-tests-table">
            <thead>
              <tr>
                <th>Test Title</th>
                <th>Created Date</th>
                <th>Test Takers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
      {companyTests.map((test) => {
                const testId = test.id || test._id;
                const isDeleting = deletingTestId === testId;
                const createdDate = test.createdAt 
                  ? new Date(test.createdAt).toLocaleDateString()
                  : "N/A";
                const results = testResultsMap[testId];
                const takersCount = results ? results.length : null;

                return (
                  <tr key={testId}>
                    <td className="test-title-cell">{test.title || "Untitled Test"}</td>
                    <td className="test-date-cell">{createdDate}</td>
                    <td className="test-takers-cell">
                      <button
                        className="takers-btn"
                        onClick={() => handleViewTestTakers(test)}
                        title="View Test Takers"
                        disabled={loadingResults[testId]}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                        <span>
                          {loadingResults[testId] 
                            ? 'Loading...'
                            : takersCount !== null 
                              ? `${takersCount} ${takersCount === 1 ? 'Taker' : 'Takers'}`
                              : 'View Takers'
                          }
                        </span>
                      </button>
                    </td>
                    <td className="test-actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewTest(testId)}
                        title="View Test"
                      >
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(test)}
                        disabled={isDeleting}
                        title="Delete Test"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteConfirm && testToDelete && (
        <div className="delete-confirm-modal-overlay" onClick={handleDeleteCancel}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the test "{testToDelete.title || "Untitled Test"}"?
              <br />
              <strong>Note:</strong> This test will be marked as deleted for users who have already taken it in their history.
            </p>
            <div className="delete-confirm-actions">
              <button className="confirm-btn" onClick={handleDeleteConfirm}>
                Delete
              </button>
              <button className="cancel-btn" onClick={handleDeleteCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Takers Modal */}
      {showTestTakersModal && selectedTest && (
        <div className="modal-overlay" onClick={handleCloseTakersModal}>
          <div className="test-takers-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Test Takers - {selectedTest.title || "Untitled Test"}</h3>
              <button className="modal-close-btn" onClick={handleCloseTakersModal}>×</button>
            </div>
            <div className="modal-content">
              {loadingResults[selectedTest.id || selectedTest._id] ? (
                <div className="loading-state">Loading test takers...</div>
              ) : !testTakers || testTakers.length === 0 ? (
                <div className="empty-state">No test takers yet</div>
              ) : (
                <div className="takers-list">
                  {testTakers
                    .filter(taker => {
                      const userType = taker.userType || taker.UserType;
                      return userType !== "company";
                    })
                    .map((taker) => {
                      const takerId = taker.userId || taker.UserId;
                      const username = taker.username || taker.Username || "Unknown";
                      const name = taker.userName || taker.UserName || username;
                      const email = taker.userEmail || taker.UserEmail || "";
                      const profilePic = taker.userProfilePictureUrl || taker.UserProfilePictureUrl;
                      const score = taker.score || taker.Score || 0;
                      const completedAt = taker.completedAt || taker.CompletedAt;

                      return (
                        <div 
                          key={taker.id || taker.Id} 
                          className="taker-item"
                          onClick={() => handleTakerClick(taker)}
                        >
                          <div className="taker-avatar">
                            {profilePic ? (
                              <img src={profilePic} alt={name} />
                            ) : (
                              <FontAwesomeIcon icon={faUser} />
                            )}
                          </div>
                          <div className="taker-info">
                            <div className="taker-name">{name}</div>
                            <div className="taker-username">@{username}</div>
                          </div>
                          <div className="taker-score">
                            <span className="score-value">{score.toFixed(1)}%</span>
                            <span className="score-label">Score</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Taker Details Modal */}
      {showTakerDetails && selectedTaker && (
        <div className="modal-overlay" onClick={handleCloseTakerDetails}>
          <div className="taker-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Test Taker Details</h3>
              <button className="modal-close-btn" onClick={handleCloseTakerDetails}>×</button>
            </div>
            <div className="modal-content">
              <div className="taker-profile-section">
                <div className="taker-profile-avatar">
                  {selectedTaker.userProfilePictureUrl || selectedTaker.UserProfilePictureUrl ? (
                    <img 
                      src={selectedTaker.userProfilePictureUrl || selectedTaker.UserProfilePictureUrl} 
                      alt={selectedTaker.userName || selectedTaker.UserName} 
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </div>
                <div className="taker-profile-info">
                  <h4>{selectedTaker.userName || selectedTaker.UserName || selectedTaker.username || selectedTaker.Username || "Unknown"}</h4>
                  <p className="taker-email">{selectedTaker.userEmail || selectedTaker.UserEmail || "No email"}</p>
                  <p className="taker-username">@{selectedTaker.username || selectedTaker.Username || "unknown"}</p>
                </div>
                <div className="taker-score-badge">
                  <div className="score-large">{(selectedTaker.score || selectedTaker.Score || 0).toFixed(1)}%</div>
                  <div className="score-details">
                    <span>MCQ: {selectedTaker.mcqCorrectCount || selectedTaker.McqCorrectCount || 0}/{selectedTaker.mcqTotalCount || selectedTaker.McqTotalCount || 0}</span>
                    <span>Code: {selectedTaker.programmingCorrect || selectedTaker.ProgrammingCorrect ? "✓" : "✗"}</span>
                  </div>
                </div>
              </div>

              <div className="taker-answers-section">
                <h4>Submitted Answers</h4>
                
                {(() => {
                  const mcqAnswersJson = selectedTaker.mcqAnswers || selectedTaker.McqAnswers;
                  if (mcqAnswersJson) {
                    try {
                      const mcqAnswers = typeof mcqAnswersJson === 'string' 
                        ? JSON.parse(mcqAnswersJson) 
                        : mcqAnswersJson;
                      
                      return (
                        <div className="answers-section">
                          <h5>MCQ Answers</h5>
                          <div className="answers-content">
                            {Object.keys(mcqAnswers).length > 0 ? (
                              <div className="mcq-answers-list">
                                {Object.entries(mcqAnswers).map(([questionId, optionId]) => (
                                  <div key={questionId} className="mcq-answer-item">
                                    <span className="answer-question-id">Question {questionId}:</span>
                                    <span className="answer-option-id">Option {optionId}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="no-answers">No MCQ answers submitted</p>
                            )}
                          </div>
                        </div>
                      );
                    } catch (e) {
                      return (
                        <div className="answers-section">
                          <h5>MCQ Answers</h5>
                          <div className="answers-content">
                            <pre>{mcqAnswersJson}</pre>
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}

                {selectedTaker.programmingAnswer || selectedTaker.ProgrammingAnswer ? (
                  <div className="answers-section">
                    <h5>Programming Solution</h5>
                    <div className="code-answer">
                      <pre><code>{selectedTaker.programmingAnswer || selectedTaker.ProgrammingAnswer}</code></pre>
                    </div>
                  </div>
                ) : (
                  <div className="answers-section">
                    <h5>Programming Solution</h5>
                    <div className="answers-content">
                      <p className="no-answers">No programming solution submitted</p>
                    </div>
                  </div>
                )}

                <div className="completion-info">
                  <p><strong>Completed:</strong> {selectedTaker.completedAt || selectedTaker.CompletedAt ? new Date(selectedTaker.completedAt || selectedTaker.CompletedAt).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTestsDisplay;
