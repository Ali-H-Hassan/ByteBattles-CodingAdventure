import React from "react";
import { useLocation } from "react-router-dom";
import Game from "../components/Game/Game";

const GamePage = () => {
  const location = useLocation();
  const { courseId } = location.state || {};

  return (
    <div>
      <h1>Game for Course ID: {courseId}</h1>
      <Game courseId={courseId} />
    </div>
  );
};

export default GamePage;
