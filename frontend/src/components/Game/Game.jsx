import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";
import "./Game.css";

const GameComponent = ({ courseId }) => {
  const gameRef = useRef(null);

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
  }, [courseId]);

  return <div id="phaser-container"></div>;
};

export default GameComponent;
