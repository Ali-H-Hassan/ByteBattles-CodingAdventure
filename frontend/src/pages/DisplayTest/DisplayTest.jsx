import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import { submitTest, getTestResult } from "../../redux/testResults/testResultsActions";
import MCQQuestion from "../../components/MCQQuestion/MCQQuestion";
import ProgrammingQuestion from "../../components/ProgrammingQuestion/ProgrammingQuestion";
import TestSidebar from "../../components/TestSidebar/TestSidebar";
import TestHeader from "../../components/TestHeader/TestHeader";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./DisplayTest.css";

const DisplayTest = () => {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { test, loading, error } = useSelector((state) => state.testDetails);
  const { loading: submitting } = useSelector((state) => state.testResults);
  const user = useSelector((state) => state.auth.user);
  const isCompanyUser = user?.userType === "company";

  // Check if we're in review mode
  const isReviewMode = searchParams.get("mode") === "review";

  const [currentSection, setCurrentSection] = useState("mcq");
  const [answers, setAnswers] = useState({ mcq: {}, programming: "" });
  const [testResult, setTestResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);

  useEffect(() => {
    if (testId) {
      dispatch(fetchTestById(testId));

      // If in review mode, fetch the user's test result
      if (isReviewMode && !isCompanyUser) {
        setLoadingResult(true);
        dispatch(getTestResult(testId))
          .then((result) => {
            setTestResult(result);
            // Parse the user's MCQ answers from the result
            if (result?.mcqAnswers) {
              try {
                const parsedAnswers = typeof result.mcqAnswers === 'string'
                  ? JSON.parse(result.mcqAnswers)
                  : result.mcqAnswers;
                setAnswers(prev => ({ ...prev, mcq: parsedAnswers }));
              } catch (e) {
                console.error("Error parsing MCQ answers:", e);
              }
            }
            if (result?.programmingAnswer) {
              setAnswers(prev => ({ ...prev, programming: result.programmingAnswer }));
            }
          })
          .finally(() => setLoadingResult(false));
      }
    }
  }, [dispatch, testId, isReviewMode, isCompanyUser]);

  const handleMCQAnswerChange = (questionId, selectedOption) => {
    if (isReviewMode) return; // Don't allow changes in review mode
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      mcq: { ...prevAnswers.mcq, [questionId]: selectedOption },
    }));
  };

  const handleProgrammingAnswerChange = (code) => {
    if (isReviewMode) return; // Don't allow changes in review mode
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      programming: code,
    }));
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleSubmitTest = async (isAutoSubmit = false) => {
    if (isCompanyUser || isReviewMode) return;

    if (!testId) return;

    try {
      const mcqAnswers = {};
      Object.keys(answers.mcq).forEach((questionId) => {
        const selectedOptionId = answers.mcq[questionId];
        const question = test.mcqQuestions?.find(
          (q) => (q.id || q._id).toString() === questionId.toString()
        );
        if (question && selectedOptionId) {
          const qId = parseInt(question.id || question._id);
          const optId = parseInt(selectedOptionId);
          if (!isNaN(qId) && !isNaN(optId)) {
            mcqAnswers[qId] = optId;
          }
        }
      });

      const submitData = {
        mcqAnswers: Object.keys(mcqAnswers).length > 0 ? mcqAnswers : null,
        programmingAnswer: answers.programming || null,
      };

      await dispatch(submitTest(parseInt(testId), submitData));
      if (isAutoSubmit) {
        alert("Time's up! Your test has been automatically submitted.");
      }
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting test:", error);
      if (!isAutoSubmit) {
        alert(error.message || "Failed to submit test. Please try again.");
      }
    }
  };

  const handleTimeUp = () => {
    handleSubmitTest(true);
  };

  const handleBackClick = () => {
    if (isCompanyUser) {
      navigate("/company-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  if (loading || loadingResult) return <LoadingSpinner message={isReviewMode ? "Loading your results..." : "Loading test..."} />;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!test) return <div className="error-container">Test not found</div>;

  // Calculate initial time (20 minutes = 1200 seconds)
  const initialTime = 20 * 60;

  // Determine if view only (company user OR review mode)
  const isViewOnly = isCompanyUser || isReviewMode;

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#8bc34a";
    if (score >= 40) return "#ff9800";
    return "#f44336";
  };

  return (
    <div className="display-test-container">
      <TestHeader
        initialTime={isViewOnly ? null : initialTime}
        onTimeUp={isViewOnly ? null : handleTimeUp}
        testTitle={test.title}
        companyName={test.companyName}
        isViewOnly={isViewOnly}
        onBackClick={handleBackClick}
      />

      {/* Review Mode Score Banner */}
      {isReviewMode && testResult && (
        <div className="review-score-banner">
          <div className="review-score-content">
            <div className="review-score-main">
              <FontAwesomeIcon
                icon={faTrophy}
                className="review-score-icon"
                style={{ color: getScoreColor(testResult.score) }}
              />
              <div className="review-score-details">
                <span className="review-score-label">Your Score</span>
                <span
                  className="review-score-value"
                  style={{ color: getScoreColor(testResult.score) }}
                >
                  {Math.round(testResult.score)}%
                </span>
              </div>
            </div>
            <div className="review-score-breakdown">
              <div className="review-score-item">
                <FontAwesomeIcon
                  icon={testResult.mcqCorrectCount === testResult.mcqTotalCount ? faCheckCircle : faTimesCircle}
                  className={testResult.mcqCorrectCount === testResult.mcqTotalCount ? "icon-success" : "icon-partial"}
                />
                <span>MCQ: {testResult.mcqCorrectCount}/{testResult.mcqTotalCount}</span>
              </div>
              {testResult.programmingAnswer !== null && testResult.programmingAnswer !== undefined && (
                <div className="review-score-item">
                  <FontAwesomeIcon
                    icon={testResult.programmingCorrect ? faCheckCircle : faTimesCircle}
                    className={testResult.programmingCorrect ? "icon-success" : "icon-error"}
                  />
                  <span>Coding: {testResult.programmingCorrect ? "Passed" : "Failed"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="test-display-flex-container">
        <TestSidebar
          currentSection={currentSection}
          onSelectSection={handleSectionChange}
        />
        <div className="test-content">
          {currentSection === "mcq" && (
            <div className="mcq-questions-container">
              {isReviewMode && (
                <div className="review-mode-notice">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Review Mode - Your answers are shown with correct answers highlighted</span>
                </div>
              )}
              {test.mcqQuestions && test.mcqQuestions.length > 0 ? (
                test.mcqQuestions.map((question) => {
                  const questionId = question.id || question._id;
                  const selectedAnswer = answers.mcq[questionId];

                  // In review mode, find the user's selected answer from parsed result
                  const userAnswer = isReviewMode && testResult?.mcqAnswers
                    ? (typeof testResult.mcqAnswers === 'string'
                        ? JSON.parse(testResult.mcqAnswers)[questionId]
                        : testResult.mcqAnswers[questionId])
                    : selectedAnswer;

                  return (
                    <MCQQuestion
                      key={questionId}
                      questionId={questionId}
                      question={question.questionText}
                      options={question.options ? question.options.map((option) => ({
                        id: option.id || option._id,
                        text: option.text,
                        isCorrect: option.isCorrect
                      })) : []}
                      onAnswerChange={isViewOnly ? undefined : (e) => {
                        const selectedOptionId = parseInt(e.target.value);
                        handleMCQAnswerChange(questionId, selectedOptionId);
                      }}
                      disabled={isViewOnly}
                      showCorrectAnswer={isViewOnly}
                      selectedAnswer={userAnswer}
                      isReviewMode={isReviewMode}
                    />
                  );
                })
              ) : (
                <div>No MCQ questions available</div>
              )}
              {test.programmingQuestion && !isReviewMode && (
                <button
                  className="test-next-button"
                  onClick={() => setCurrentSection("programming")}
                >
                  Continue to Coding Question
                </button>
              )}
              {test.programmingQuestion && isReviewMode && (
                <button
                  className="test-next-button review-next-button"
                  onClick={() => setCurrentSection("programming")}
                >
                  View Coding Answer
                </button>
              )}
            </div>
          )}
          {currentSection === "programming" && test.programmingQuestion && (
            <ProgrammingQuestion
              problemStatement={test.programmingQuestion.questionText || ""}
              starterCode={isReviewMode && answers.programming ? answers.programming : (test.programmingQuestion.starterCode || "")}
              handleCodeChange={isViewOnly ? undefined : handleProgrammingAnswerChange}
              onSubmitCode={isViewOnly ? undefined : handleSubmitTest}
              isSubmitting={submitting}
              isViewOnly={isViewOnly}
              testCases={test.programmingQuestion.testCases || []}
              isReviewMode={isReviewMode}
              userCode={isReviewMode ? answers.programming : null}
              programmingCorrect={isReviewMode ? testResult?.programmingCorrect : null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayTest;
