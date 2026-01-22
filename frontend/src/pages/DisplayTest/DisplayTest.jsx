import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import { submitTest } from "../../redux/testResults/testResultsActions";
import MCQQuestion from "../../components/MCQQuestion/MCQQuestion";
import ProgrammingQuestion from "../../components/ProgrammingQuestion/ProgrammingQuestion";
import TestSidebar from "../../components/TestSidebar/TestSidebar";
import TestHeader from "../../components/TestHeader/TestHeader";
import "./DisplayTest.css";

const DisplayTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { test, loading, error } = useSelector((state) => state.testDetails);
  const { loading: submitting } = useSelector((state) => state.testResults);
  const [currentSection, setCurrentSection] = useState("mcq");
  const [answers, setAnswers] = useState({ mcq: {}, programming: "" });

  useEffect(() => {
    if (testId) {
      dispatch(fetchTestById(testId));
    }
  }, [dispatch, testId]);

  const handleMCQAnswerChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      mcq: { ...prevAnswers.mcq, [questionId]: selectedOption },
    }));
  };

  const handleProgrammingAnswerChange = (code) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      programming: code,
    }));
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleSubmitTest = async (isAutoSubmit = false) => {
    if (!testId) return;

    try {
      // Convert MCQ answers to the format expected by backend
      // Backend expects: { questionId: optionId }
      const mcqAnswers = {};
      Object.keys(answers.mcq).forEach((questionId) => {
        const selectedOptionId = answers.mcq[questionId];
        // answers.mcq already contains questionId -> optionId mapping
        const question = test.mcqQuestions?.find(
          (q) => (q.id || q._id).toString() === questionId.toString()
        );
        if (question && selectedOptionId) {
          mcqAnswers[question.id || question._id] = selectedOptionId;
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!test) return <div>Test not found</div>;

  // Calculate initial time (20 minutes = 1200 seconds)
  const initialTime = 20 * 60; // 20 minutes in seconds

  return (
    <div className="display-test-container">
      <TestHeader 
        initialTime={initialTime} 
        onTimeUp={handleTimeUp}
        testTitle={test.title}
        companyName={test.companyName}
      />
      <div className="test-display-flex-container">
        <TestSidebar
          currentSection={currentSection}
          onSelectSection={handleSectionChange}
        />
        <div className="test-content">
          {currentSection === "mcq" && (
            <div className="mcq-questions-container">
              {test.mcqQuestions && test.mcqQuestions.length > 0 ? (
                test.mcqQuestions.map((question) => {
                  const questionId = question.id || question._id; // Support both id (SQL) and _id (MongoDB)
                  return (
                    <MCQQuestion
                      key={questionId}
                      question={question.questionText}
                      options={question.options ? question.options.map((option) => ({
                        id: option.id || option._id,
                        text: option.text
                      })) : []}
                      onAnswerChange={(e) => {
                        const selectedOptionId = parseInt(e.target.value);
                        handleMCQAnswerChange(questionId, selectedOptionId);
                      }}
                    />
                  );
                })
              ) : (
                <div>No MCQ questions available</div>
              )}
              {test.programmingQuestion && (
                <button
                  className="test-next-button"
                  onClick={() => setCurrentSection("programming")}
                >
                  Continue to Coding Question
                </button>
              )}
            </div>
          )}
          {currentSection === "programming" && test.programmingQuestion && (
            <ProgrammingQuestion
              problemStatement={test.programmingQuestion.questionText || ""}
              starterCode={test.programmingQuestion.starterCode || ""}
              handleCodeChange={handleProgrammingAnswerChange}
              onSubmitCode={handleSubmitTest}
              isSubmitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayTest;
