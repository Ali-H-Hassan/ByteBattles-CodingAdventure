import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import GameScene from "./GameScene";
import CssGameScene from "./CssGameScene";
import NodeGame from "./NodeGameScene";
import Python from "./PythonGameScene";
import { submitScore } from "../../actions/gameActions";
import "./Game.css";

const GameComponent = ({ courseId }) => {
  const gameRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

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
    let sceneClass;
    switch (courseId) {
      case 1:
        sceneClass = GameScene;
        break;
      case 2:
        sceneClass = CssGameScene;
        break;
      case 3:
        sceneClass = NodeGame;
        break;
      case 4:
        sceneClass = Python;
        break;
      default:
    }

    if (sceneClass) {
      const scene = new sceneClass(courseId, onGameComplete);
      const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: 800,
        height: 600,
        scene: scene,
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [courseId, onGameComplete]);

  return <div id="phaser-container"></div>;
};

export default GameComponent;
