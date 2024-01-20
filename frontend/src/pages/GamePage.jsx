import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Game from "../components/Game/Game";
import { useSelector } from "react-redux";

const GamePage = () => {
  const location = useLocation();
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

  return (
    <div>
      <h1>{courseName}</h1>
      <Game courseId={courseId} />
    </div>
  );
};

export default GamePage;
