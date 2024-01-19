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
      { key: "background", value: "red", x: 500, y: 150 },
      { key: "margin", value: "10px", x: 700, y: 150 },
    ];

    cssProperties.forEach((property) => {
      let text = this.add
        .text(property.x, property.y, `${property.key}: ${property.value};`, {
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

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  createHTMLTargets() {
    const htmlTargets = [
      { key: "color", x: 100, y: 400 },
      { key: "font-size", x: 300, y: 400 },
      { key: "background", x: 500, y: 400 },
      { key: "margin", x: 700, y: 400 },
    ];

    htmlTargets.forEach((target) => {
      let zone = this.add
        .zone(target.x, target.y, 150, 50)
        .setRectangleDropZone(150, 50)
        .setData("class", target.key);

      let graphics = this.add.graphics();
      graphics.lineStyle(2, 0x00ff00);
      graphics.strokeRect(target.x - 75, target.y - 25, 150, 50);

      this.add
        .text(target.x, target.y - 60, target.key, {
          font: "18px Arial",
          color: "#ffffff",
        })
        .setOrigin(0.5);
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      if (gameObject.text.includes(dropZone.data.get("class"))) {
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
      if (this.matches === htmlTargets.length) {
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

    this.drawBackgroundEffect(completionText);
  }

  drawBackgroundEffect(text) {
    const glowColor = [0xff0000, 0x00ff00, 0x0000ff];
    let currentColor = 0;
    let graphics = this.add.graphics();

    this.time.addEvent({
      delay: 250,
      loop: true,
      callback: () => {
        graphics.clear();
        graphics.fillStyle(glowColor[currentColor], 0.5);
        graphics.fillCircle(text.x, text.y, text.width / 2);
        currentColor = (currentColor + 1) % glowColor.length;
      },
    });

    this.tweens.add({
      targets: graphics,
      scaleX: 5,
      scaleY: 5,
      alpha: { from: 1, to: 0 },
      ease: "Sine.easeInOut",
      duration: 2000,
      repeat: -1,
    });
    text.setDepth(1);
  }
}

export default CssGameScene;
