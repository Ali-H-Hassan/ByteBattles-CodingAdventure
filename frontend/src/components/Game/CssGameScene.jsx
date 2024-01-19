import Phaser from "phaser";

class CssGameScene extends Phaser.Scene {
  constructor(courseId, onGameComplete) {
    super({ key: "CssGameScene" });
    this.courseId = courseId;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.matches = 0;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#242424");
    this.createCSSProperties();
    this.createHTMLTargets();
    this.createScoreText();
  }

  createCSSProperties() {
    const cssProperties = [
      { key: "color", value: "blue", x: 100, y: 150 },
      { key: "font-size", value: "16px", x: 300, y: 150 },
    ];

    cssProperties.forEach((property) => {
      let text = this.add
        .text(property.x, property.y, `${property.key}: ${property.value};`, {
          font: "20px Arial",
          color: "#000",
          backgroundColor: "#fff",
          padding: 10,
        })
        .setInteractive();

      this.input.setDraggable(text);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  createHTMLTargets() {
    const htmlTargets = [
      { key: "color", x: 100, y: 400 },
      { key: "font-size", x: 300, y: 400 },
    ];

    htmlTargets.forEach((target) => {
      let zone = this.add.zone(target.x, target.y, 150, 50).setDropZone({
        class: target.key,
      });

      let graphics = this.add.graphics();
      graphics.lineStyle(2, 0x00ff00);
      graphics.strokeRect(target.x - 75, target.y - 25, 150, 50);
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      // Debugging: Check the state of dropZone and its data
      console.log("Drop Zone:", dropZone);
      if (dropZone && dropZone.data) {
        console.log("Drop Zone Data:", dropZone.data.getAll());

        if (gameObject.text.includes(dropZone.data.get("class"))) {
          this.score += 10;
          this.matches += 1;
          gameObject.x = dropZone.x;
          gameObject.y = dropZone.y;
          gameObject.input.enabled = false;
          gameObject.setBackgroundColor("#0f0");
        } else {
          this.score -= 5;
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
        this.updateScore();
        if (this.matches === htmlTargets.length) {
          this.endGame();
        }
      } else {
        console.error("Drop Zone is null or has no data");
      }
    });
  }

  createScoreText() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#FFF",
    });
  }

  updateScore() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  endGame() {
    this.onGameComplete(this.score);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Over!", {
        fontSize: "64px",
        fill: "#FFF",
      })
      .setOrigin(0.5);
  }
}

export default CssGameScene;
