import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";

const GameComponent = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 800,
      height: 600,
      scene: [GameScene],
    };

    // Assign game to the ref
    gameRef.current = new Phaser.Game(config);

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div id="phaser-container"></div>;
};

export default GameComponent;
