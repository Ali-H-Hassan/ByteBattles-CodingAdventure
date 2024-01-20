import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import GameScene from "./GameScene";
import CssGameScene from "./CssGameScene";
import NodeGameScene from "./NodeGameScene";
import PythonGameScene from "./PythonGameScene";
import { submitScore } from "../../actions/gameActions";
import "./Game.css";

const GameComponent = ({ courseId }) => {
  const gameRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.game.courses);
  const courseData = courses.find((course) => course._id === courseId);

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
    console.log("useEffect running with courseId:", courseId);

    let sceneClass;
    if (courseData) {
      switch (courseData.title) {
        case "HTML Basics":
          sceneClass = GameScene;
          break;
        case "CSS Fundamentals":
          sceneClass = CssGameScene;
          break;
        case "NodeJs Basics":
          sceneClass = NodeGameScene;
          break;
        case "Python Fundamentals":
          sceneClass = PythonGameScene;
          break;
        default:
          console.error("No matching scene for the given course title.");
      }
    } else {
      console.error("Course data not found for courseId:", courseId);
    }

    if (sceneClass) {
      const sceneInstance = new sceneClass(
        courseId,
        courseData,
        onGameComplete
      );
      console.log("Scene instance created:", sceneInstance);

      const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: 800,
        height: 600,
        scene: sceneInstance,
      };

      gameRef.current = new Phaser.Game(config);
      console.log("Phaser game initialized");
    } else {
      console.error("Scene class is undefined for courseId:", courseId);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        console.log("Phaser game destroyed");
      }
    };
  }, [courseId, onGameComplete, courseData]);

  return <div id="phaser-container"></div>;
};

export default GameComponent;
