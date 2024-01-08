import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // Currently, we're not loading any assets.
  }

  create() {
    // Create a simple rectangle shape to represent the "htmlTag"
    this.htmlTag = this.add.graphics({ fillStyle: { color: 0x9966ff } });

    // Draw the rectangle onto the graphics object
    this.htmlTag.fillRect(100, 200, 100, 100);

    // Set the graphics object to be interactive
    this.htmlTag.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 100, 100),
      Phaser.Geom.Rectangle.Contains
    );

    // Now we can make it draggable
    this.input.setDraggable(this.htmlTag);

    // Add text to the scene
    this.add.text(20, 20, "Drag the HTML tags to the correct container", {
      font: "18px Arial",
      fill: "#ffffff",
    });

    // Event listeners for drag events
    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff69b4); // Highlight the object when being dragged
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

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
    const dropZone = new Phaser.Geom.Rectangle(300, 400, 200, 100);
    return dropZone.contains(gameObject.x, gameObject.y);
  }

  updateScore() {
    this.score += 10; // Increment score
    this.scoreText.setText(`Score: ${this.score}`); // Update score text
  }
}

export default GameScene;
