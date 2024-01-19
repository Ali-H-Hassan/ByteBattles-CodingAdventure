import React from "react";
import { useLocation } from "react-router-dom";
import Game from "../components/Game/Game";

const GamePage = () => {
  const location = useLocation();
  const { courseId } = location.state || {};

  const getCourseName = (id) => {
    const courseNames = {
      1: "HTML Basics",
      2: "CSS Fundamentals",
      3: "NodeJs Basics",
      4: "Python Fundamentals",
    };
    return courseNames[id] || "Unknown Course";
  };

  const courseName = getCourseName(courseId);

  return (
    <div>
      <h1>{courseName}</h1>
      <Game courseId={courseId} />
    </div>
  );
};

export default GamePage;
