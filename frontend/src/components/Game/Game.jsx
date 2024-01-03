import React, { useEffect } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";

const Game = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 800,
      height: 600,
      scene: [GameScene],
    };

    new Phaser.Game(config);

    // This will clean up the game when the component unmounts
    return () => {
      this.game.destroy(true);
    };
  }, []);

  return <div id="phaser-container"></div>;
};

export default Game;
