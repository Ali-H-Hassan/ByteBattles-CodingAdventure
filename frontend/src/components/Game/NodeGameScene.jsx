import Phaser from "phaser";

class NodeGameScene extends Phaser.Scene {
  constructor(courseId, onGameComplete) {
    super({ key: "NodeGameScene" });
    this.courseId = courseId;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.matches = 0;

    this.nodeMethods = [
      { key: "readFile", value: "Reads a file asynchronously", x: 100, y: 100 },
      {
        key: "writeFile",
        value: "Writes data to a file asynchronously",
        x: 300,
        y: 100,
      },
      { key: "unlink", value: "Deletes a file", x: 500, y: 100 },
      { key: "mkdir", value: "Creates a new directory", x: 700, y: 100 },
    ];
  }

  create() {
    this.cameras.main.setBackgroundColor("#242424");
    this.createNodeMethods();
    this.createMethodDescriptions();
    this.createScoreText();
  }

  createNodeMethods() {
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

      text.on("drag", (pointer, dragX, dragY) => {
        text.x = dragX;
        text.y = dragY;
      });
    });
  }

  createMethodDescriptions() {
    this.nodeMethods.forEach((method, index) => {
      let zoneY = method.y + 300 + index * 60;
      let zone = this.add
        .zone(method.x, zoneY, 200, 50)
        .setRectangleDropZone(200, 50)
        .setData("key", method.key);

      let graphics = this.add.graphics();
      graphics.lineStyle(2, 0x00ff00);
      graphics.strokeRect(zone.x - 100, zone.y - 25, 200, 50);

      this.add
        .text(zone.x, zone.y - 60, method.value, {
          font: "18px Arial",
          color: "#ffffff",
          wordWrap: { width: 190, useAdvancedWrap: true },
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
        gameObject.setColor("#ffffff");
      } else {
        this.score -= 5;
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        gameObject.setColor("#ff0000");
      }
      this.updateScore();
      if (this.matches === this.nodeMethods.length) {
        this.endGame();
      }
    });
  }

  createScoreText() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      font: "32px Arial",
      fill: "#FFF",
      stroke: "#00ff00",
      strokeThickness: 2,
    });
  }

  updateScore() {
    this.scoreText.setText(`Score: ${this.score}`);
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
      .setOrigin(0.5);

    this.tweens.add({
      targets: completionText,
      scale: { from: 1, to: 1.2 },
      ease: "Cubic.easeOut",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }
}

export default NodeGameScene;
