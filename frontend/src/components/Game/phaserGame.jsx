import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // Load images and other assets here
    this.load.image("htmlTag", "assets/htmlTag.png");
  }

  create() {
    // Create game objects here
    this.htmlTag = this.add.sprite(400, 300, "htmlTag");

    // Perhaps make the htmlTag interactive
    this.htmlTag.setInteractive();

    this.htmlTag.on("pointerdown", () => {
      // Logic for what happens when the player clicks on the htmlTag
      this.handleTagClick();
    });
  }

  update() {
    // Game update loop
  }

  handleTagClick() {
    // Handle the logic for what happens when the htmlTag is clicked
  }
}

export default GameScene;
