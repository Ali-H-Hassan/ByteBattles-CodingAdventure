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
    switch (courseData.title) {
      case "HTML Basics":
        sceneClass = GameScene;
        break;
      case "CSS Fundamentals":
        sceneClass = CssGameScene;
        break;
      case "NodeJs Basics":
        sceneClass = NodeMazeScene;
        break;
      case "Python Fundamentals":
        sceneClass = PythonGameScene;
        break;
      default:
        console.error(
          "No matching scene class for the course title:",
          courseData.title
        );
        return;
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
        scene: new sceneClass(courseId, courseData, onGameComplete),
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

  return (
    <div id="game-wrapper">
      <div id="phaser-container"></div>
    </div>
  );
};

export default GameComponent;
