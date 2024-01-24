import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Game from "../components/Game/Game";
import { useSelector } from "react-redux";
import "./GamePage.css";

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = location.state || {};
  const [courseName, setCourseName] = useState("Unknown Course");
  const courses = useSelector((state) => state.game.courses);

  useEffect(() => {
    if (courses.length > 0 && courseId) {
      const course = courses.find((c) => c._id === courseId);
      if (course) {
        setCourseName(course.title);
      }
    }
  }, [courses, courseId]);

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="Game">
      <h1>{courseName}</h1>
      <button className="return-home-button" onClick={navigateToDashboard}>
        <span>Return Home</span>
      </button>
      <Game courseId={courseId} />
    </div>
  );
};

export default GamePage;
