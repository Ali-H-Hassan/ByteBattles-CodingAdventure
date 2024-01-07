import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // Preload an image for an HTML tag example
    this.load.image("htmlTag", "Assets/Game.png");
    // Load additional assets as needed
  }

  create() {
    // Add an HTML tag sprite to the scene
    this.htmlTag = this.add.sprite(100, 200, "htmlTag").setInteractive();
    this.input.setDraggable(this.htmlTag);
    this.htmlTag.data.set("type", "tag");

    // Add text to the scene
    this.add.text(20, 20, "Drag the HTML tags to the correct container", {
      font: "18px Arial",
      fill: "#ffffff",
    });

    // Event listener for drag start
    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff69b4); // Highlight the object when being dragged
    });

    // Event listener for drag
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    // Event listener for drag end
    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.clearTint(); // Remove highlight when released

      // Check if the HTML tag is dropped in the correct area
      if (this.isCorrectDropZone(gameObject)) {
        // Logic for correct placement
        gameObject.input.enabled = false; // Disable dragging after correct placement
        this.updateScore();
      } else {
        // Logic for incorrect placement
        gameObject.x = gameObject.input.dragStartX; // Reset to initial position
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    // Initialize score and add score text to the scene
    this.score = 0;
    this.scoreText = this.add.text(700, 20, "Score: 0", {
      font: "18px Arial",
      fill: "#ffffff",
    });
  }

  update() {
    // Game update loop
  }

  isCorrectDropZone(gameObject) {
    // Define a drop zone area and check if the gameObject is within this area
    // This is placeholder logic; you'd define your drop zone coordinates here
    const dropZone = new Phaser.Geom.Rectangle(300, 400, 200, 100);
    return dropZone.contains(gameObject.x, gameObject.y);
  }

  updateScore() {
    this.score += 10; // Increment score
    this.scoreText.setText(`Score: ${this.score}`); // Update score text
  }
}

export default GameScene;
