import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import GameScene from "./GameScene";
import "./Game.css";
import { submitScore } from "../../actions/gameActions";

const GameComponent = ({ courseId }) => {
  const gameRef = useRef(null);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user._id);
  const onGameComplete = useCallback(
    (finalScore) => {
      if (userId) {
        dispatch(submitScore(userId, finalScore));
      }
    },
    [dispatch, userId]
  );

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 800,
      height: 600,
      scene: [new GameScene(courseId)],
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
