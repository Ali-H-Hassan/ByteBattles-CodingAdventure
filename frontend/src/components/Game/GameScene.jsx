import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "GameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(this.courseData.backgroundColor);
    this.score = 0;
    this.createTitle(this.courseData.title);
    this.createTagsAndZones(this.courseData.tags, this.courseData.categories);
    this.createScoreText();
    this.totalTags = this.courseData.tags.length;
    this.correctlyPlacedTags = 0;
  }

  createTitle(titleText) {
    this.add
      .text(this.scale.width / 2, 40, titleText, {
        font: "40px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createTagsAndZones() {
    Object.entries(categories).forEach(
      ([category, { x, y, width, height }]) => {
        let zone = this.add
          .zone(x, y, width, height)
          .setRectangleDropZone(width, height);
        this.add
          .graphics()
          .lineStyle(2, 0xffffff)
          .strokeRect(x - width / 2, y - height / 2, width, height);
        this.add
          .text(x, y - height / 2 - 20, category, {
            font: "18px Arial",
            fill: "#ffffff",
          })
          .setOrigin(0.5);
      }
    );

    tags.forEach((tag) => {
      const tagText = this.add
        .text(tag.x, tag.y, tag.text, {
          font: "22px Arial",
          color: "#ffffff",
          backgroundColor: "transparent",
          padding: { left: 5, right: 5, top: 5, bottom: 5 },
        })
        .setInteractive();

      this.input.setDraggable(tagText);

      tagText.on("drag", (pointer, dragX, dragY) => {
        tagText.x = dragX;
        tagText.y = dragY;
      });

      tagText.on("dragend", (pointer) => {
        let correctDrop = false;
        Object.entries(categories).forEach(([key, { x, y, width, height }]) => {
          let zone = this.add
            .zone(x, y, width, height)
            .setRectangleDropZone(width, height);
          if (
            Phaser.Geom.Rectangle.Overlaps(
              tagText.getBounds(),
              zone.getBounds()
            )
          ) {
            if (tag.category === key) {
              correctDrop = true;
              tagText.disableInteractive();
              tagText.x = zone.x - tagText.width / 2;
              tagText.y = zone.y - tagText.height / 2;
              this.correctlyPlacedTags++;
              this.updateScore(10);
              if (this.correctlyPlacedTags === this.totalTags) {
                this.showCompletionMessage();
              }
            }
          }
        });
        if (!correctDrop) {
          tagText.x = tag.x;
          tagText.y = tag.y;
          this.updateScore(-5);
        }
      });
    });
  }

  createScoreText() {
    this.scoreText = this.add.text(this.scale.width - 150, 15, "Score: 0", {
      font: "22px Arial",
      fill: "#ffffff",
    });
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
  }
  showCompletionMessage() {
    const messageY = this.scale.height / 2 - 100;

    let completionText = "Awesome work! All tags are correct!";
    let message = this.add.text(
      this.scale.width / 2,
      messageY,
      completionText,
      {
        font: "32px Arial",
        fill: "#00ff00",
        stroke: "#ffffff",
        strokeThickness: 2,
      }
    );
    message.setOrigin(0.5);
    message.setPadding(10, 10, 10, 10);
    message.setInteractive();
    message.once("pointerdown", () => {
      this.onGameComplete(this.score);
    });

    this.tweens.add({
      targets: message,
      y: messageY + 20,
      ease: "Power1",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }
}

export default GameScene;
