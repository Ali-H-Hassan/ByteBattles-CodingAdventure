import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import GameScene from "./GameScene";
import CssGameScene from "./CssGameScene";
import NodeMazeScene from "./NodeGameScene";
import PythonGameScene from "./PythonGameScene";
import { submitScore } from "../../actions/gameActions";
import "./Game.css";

const GameComponent = ({ courseId }) => {
  const gameRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.game.courses);

  const onGameComplete = useCallback(
    (finalScore) => {
      if (user && user._id) {
        dispatch(submitScore(user._id, finalScore));
      } else {
        console.error("User ID not found, cannot submit score");
      }
    },
    [dispatch, user]
  );

  useEffect(() => {
    const courseData = courses.find((course) => course._id === courseId);

    if (!courseData) {
      console.error("Course data is undefined for ID:", courseId);
      return;
    }

    console.log("Fetched course data:", courseData);

    let sceneClass;
    if (courseData.title === "HTML Basics") {
      sceneClass = GameScene;
    } else if (courseData.title === "CSS Fundamentals") {
      sceneClass = CssGameScene;
    } else if (courseData.title === "NodeJs Basics") {
      sceneClass = NodeMazeScene;
    } else if (courseData.title === "Python Fundamentals") {
      sceneClass = PythonGameScene;
    }

    if (sceneClass) {
      const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: 800,
        height: 600,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: false,
          },
        },
        scene: [NodeMazeScene],
      };

      gameRef.current = new Phaser.Game(config);
    } else {
      console.error(
        "Scene class is undefined for the course title:",
        courseData.title
      );
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [courseId, onGameComplete, courses]);

  return <div id="phaser-container"></div>;
};

export default GameComponent;
