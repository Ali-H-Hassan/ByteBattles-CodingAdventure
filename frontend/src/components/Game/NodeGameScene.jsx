import Phaser from "phaser";

class NodeGameScene extends Phaser.Scene {
  constructor(courseId, onGameComplete) {
    super({ key: "NodeGameScene" });
    this.courseId = courseId;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.matches = 0;

    // Define nodeMethods at the class level
    this.nodeMethods = [
      {
        key: "readFile",
        value: "Asynchronously reads the contents of a file.",
        x: 100,
        y: 150,
      },
      {
        key: "writeFile",
        value: "Asynchronously writes data to a file.",
        x: 300,
        y: 150,
      },
      // Add other methods and their descriptions here
    ];
  }

  create() {
    this.cameras.main.setBackgroundColor("#242424");
    this.createNodeMethods();
    this.createMethodDescriptions();
    this.createScoreText();
  }

  createNodeMethods() {
    // Use this.nodeMethods here
    this.nodeMethods.forEach((method) => {
      let text = this.add
        .text(method.x, method.y, method.key, {
          font: "20px Arial",
          color: "#00ff00",
          backgroundColor: "transparent",
          padding: 10,
          borderRadius: "5px",
        })
        .setInteractive()
        .setOrigin(0.5);

      text.setStyle({
        backgroundColor: "transparent",
        border: "2px solid #00ff00",
        borderRadius: "10px",
      });

      this.input.setDraggable(text);
      this.add.existing(text);
    });
  }
  createScoreText() {
    // Method to create the score text
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      font: "32px Arial",
      fill: "#FFF",
      stroke: "#00ff00",
      strokeThickness: 2,
    });
  }
  createMethodDescriptions() {
    // Now this.nodeMethods is available
    this.nodeMethods.forEach((method) => {
      let zone = this.add
        .zone(method.x, method.y + 250, 150, 50) // Offset the y position for the drop zones
        .setRectangleDropZone(150, 50)
        .setData("key", method.key);

      let graphics = this.add.graphics();
      graphics.lineStyle(2, 0x00ff00);
      graphics.strokeRect(zone.x - 75, zone.y - 25, 150, 50);

      this.add
        .text(zone.x, zone.y - 60, method.value, {
          font: "18px Arial",
          color: "#ffffff",
          wordWrap: { width: 140, useAdvancedWrap: true },
        })
        .setOrigin(0.5);
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      if (gameObject.text === dropZone.data.get("key")) {
        this.score += 10;
        this.matches += 1;
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        gameObject.input.enabled = false;
        gameObject.setStyle({
          color: "#ffffff",
          stroke: "#00ff00",
          strokeThickness: 2,
        });
      } else {
        this.score -= 5;
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        gameObject.setStyle({ color: "#ff0000" });
      }
      this.updateScore();
      if (this.matches === this.nodeMethods.length) {
        this.endGame();
      }
    });
  }

  endGame() {
    if (typeof this.onGameComplete === "function") {
      this.onGameComplete(this.score);
    }
    let completionText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Great Job!", {
        font: "bold 64px Arial",
        fill: "#00ff00",
        stroke: "#ffffff",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    let backdrop = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
      .setOrigin(0)
      .setInteractive();
    this.tweens.add({
      targets: [completionText, backdrop],
      alpha: 1,
      duration: 1000,
      hold: 3000,
      ease: "Cubic.easeIn",
      onComplete: () => {
        completionText.destroy();
        backdrop.destroy();
      },
    });
  }
}

export default NodeGameScene;
