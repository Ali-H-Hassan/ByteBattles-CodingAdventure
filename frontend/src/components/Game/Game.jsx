import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import GameScene from "./GameScene";
import CssGameScene from "./CssGameScene";
import NodeGame from "./NodeGameScene";
import Python from "./PythonGameScene";
import { submitScore } from "../../actions/gameActions";

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
    let scene;
    if (courseId === 1) {
      scene = GameScene;
    } else if (courseId === 2) {
      scene = CssGameScene;
    } else if (courseId === 3) {
      scene = NodeGame;
    } else if (courseId === 4) {
      scene = Python;
    }
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 800,
      height: 600,
      scene: [new scene(courseId, onGameComplete)],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [courseId, onGameComplete]);

  return <div id="phaser-container"></div>;
};

export default GameComponent;
