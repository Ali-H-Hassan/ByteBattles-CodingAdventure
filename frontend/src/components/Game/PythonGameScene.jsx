import Phaser from "phaser";

class PythonGameScene extends Phaser.Scene {
  constructor(courseId, onGameComplete) {
    super({ key: "PythonGameScene" });
    this.courseId = courseId;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.matches = 0;
  }

  preload() {}

  create() {
    this.createPythonSnippets();
    this.createTargets();
    this.createScoreText();
  }

  createPythonSnippets() {
    const pythonSnippets = [
      { code: "'Hello World'", type: "String", x: 100, y: 100 },
      { code: "3.14", type: "Float", x: 300, y: 100 },
      { code: "[1, 2, 3]", type: "List", x: 500, y: 100 },
      { code: "{ 'key': 'value' }", type: "Dict", x: 700, y: 100 },
    ];

    pythonSnippets.forEach((snippet) => {
      let text = this.add
        .text(snippet.x, snippet.y, snippet.code, {
          font: "18px Courier",
          color: "#FFD43B",
          padding: { x: 10, y: 5 },
          borderRadius: "5px",
        })
        .setInteractive()
        .setOrigin(0.5);

      this.input.setDraggable(text);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  createTargets() {
    const targets = [
      { type: "String", x: 100, y: 400 },
      { type: "Float", x: 300, y: 400 },
      { type: "List", x: 500, y: 400 },
      { type: "Dict", x: 700, y: 400 },
    ];

    targets.forEach((target) => {
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

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      if (gameObject.text.trim() === dropZone.data.get("type")) {
        this.score += 10;
        this.matches += 1;
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        gameObject.input.enabled = false;
        gameObject.setStyle({ color: "#00FF00" });
      } else {
        this.score -= 5;
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        gameObject.setStyle({ color: "#FF0000" });
      }
      this.updateScore();
      if (this.matches === targets.length) {
        this.endGame();
      }
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
