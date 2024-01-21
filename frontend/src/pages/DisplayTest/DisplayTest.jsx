import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestById, submitTestAnswers } from "../../actions/testActions";
import MCQQuestion from "../../components/MCQQuestion/MCQQuestion";
import ProgrammingQuestion from "../../components/ProgrammingQuestion/ProgrammingQuestion";
import TestSidebar from "../../components/TestSidebar/TestSidebar";
import TestHeader from "../../components/TestHeader/TestHeader";
import ThankYouPage from "../../components/ThankYouPage/ThankYouPage";

const DisplayTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { test, loading, error } = useSelector((state) => state.testDetails);
  const [currentSection, setCurrentSection] = useState("mcq");
  const [answers, setAnswers] = useState({ mcq: {}, programming: "" });

  useEffect(() => {
    if (id) {
      dispatch(fetchTestById(id));
    }
  }, [dispatch, id]);

  const handleMCQAnswerChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      mcq: { ...answers.mcq, [questionId]: selectedOption },
    });
  };

  const handleProgrammingAnswerChange = (code) => {
    setAnswers({
      ...answers,
      programming: code,
    });
  };

  const handleSubmit = () => {
    dispatch(submitTestAnswers(id, answers));
    navigate("/thank-you");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="display-test-container">
      <TestHeader timeLeft="00:20:30" />
      <TestSidebar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <div className="test-content">
        {currentSection === "mcq" &&
          test.mcqQuestions.map((question) => (
            <MCQQuestion
              key={question._id}
              question={question.questionText}
              options={question.options}
              onAnswerChange={(optionId) =>
                handleMCQAnswerChange(question._id, optionId)
              }
            />
          ))}
        {currentSection === "programming" && (
          <ProgrammingQuestion
            problemStatement={test.programmingQuestion.questionText}
            starterCode={test.programmingQuestion.starterCode}
            onCodeChange={handleProgrammingAnswerChange}
          />
        )}
      </div>
      <button onClick={handleSubmit} className="submit-test-btn">
        Submit Test
      </button>
    </div>
  );
};

export default DisplayTest;
