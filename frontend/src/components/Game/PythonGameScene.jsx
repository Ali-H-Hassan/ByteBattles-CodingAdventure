import Phaser from "phaser";

class PythonGameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "PythonGameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.matches = 0;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(this.courseData.backgroundColor);
    this.createPythonSnippets(this.courseData.pythonSnippets);
    this.createTargets(this.courseData.targets);
    this.createScoreText();
  }

  createPythonSnippets() {
    this.courseData.pythonSnippets.forEach((snippet) => {
      let text = this.add
        .text(snippet.x, snippet.y, snippet.code, {
          font: "18px Courier",
          color: "#FFD43B",
          padding: { x: 10, y: 5 },
          borderRadius: "5px",
        })
        .setInteractive()
        .setOrigin(0.5)
        .setData("type", snippet.type);

      this.input.setDraggable(text);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  createTargets() {
    this.courseData.targets.forEach((target) => {
      let zone = this.add
        .zone(target.x, target.y, 200, 50)
        .setRectangleDropZone(200, 50)
        .setData("type", target.type);

      let graphics = this.add.graphics();
      graphics.lineStyle(2, 0xffd43b);
      graphics.strokeRect(target.x - 100, target.y - 25, 200, 50);

      this.add
        .text(target.x, target.y - 60, target.type, {
          font: "20px Courier",
          color: "#FFFFFF",
        })
        .setOrigin(0.5);
    });
  }

  createScoreText() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      font: "32px Arial",
      fill: "#FFF",
      stroke: "#FFD43B",
      strokeThickness: 3,
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
        fill: "#FFD43B",
        stroke: "#306998",
        strokeThickness: 6,
      })
      .setOrigin(0.5);
  }
}

export default PythonGameScene;
