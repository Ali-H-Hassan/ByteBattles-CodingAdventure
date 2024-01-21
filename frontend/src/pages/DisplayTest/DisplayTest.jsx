import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestById, submitTestAnswers } from "../../actions/testActions";
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

  const handleSubmit = () => {
    dispatch(submitTestAnswers(testId, answers));
    navigate("/thank-you");
  };
  const navigateToProgramming = () => {
    setCurrentSection("programming");
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!test) return <div>Test not found</div>;

  return (
    <div className="display-test-container">
      <TestHeader timeLeft="00:20:30" />
      <div className="test-display-flex-container">
        <TestSidebar
          currentSection={currentSection}
          onSelectSection={handleSectionChange}
        />
        <div className="test-content">
          {currentSection === "mcq" && (
            <>
              {test.mcqQuestions.map((question) => (
                <MCQQuestion
                  key={question._id}
                  question={question.questionText}
                  options={question.options.map((option) => option.text)}
                  onAnswerChange={(e) =>
                    handleMCQAnswerChange(question._id, e.target.value)
                  }
                />
              ))}
              <button
                className="test-next-button"
                onClick={() => setCurrentSection("programming")}
              >
                Next to Programming
              </button>
            </>
          )}
          {currentSection === "programming" && (
            <ProgrammingQuestion
              problemStatement={test.programmingQuestion.questionText}
              starterCode={test.programmingQuestion.starterCode}
              onCodeChange={handleProgrammingAnswerChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayTest;
