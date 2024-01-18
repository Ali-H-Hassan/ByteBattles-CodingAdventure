import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(courseId) {
    super({ key: "GameScene" });
    this.courseId = courseId;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#242424");
    this.score = 0;
    this.createTitle();
    this.createTagsAndZones();
    this.createScoreText();
  }

  createTitle() {
    let titleText = "HTML Basics";
    this.add
      .text(this.scale.width / 2, 40, titleText, {
        font: "40px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createTagsAndZones() {
    const tags = [
      { text: "<div>", category: "Containers", x: 100, y: 150 },
      { text: "<p>", category: "Text", x: 200, y: 150 },
      { text: "<a>", category: "Links", x: 300, y: 150 },
      { text: "<img>", category: "Media", x: 400, y: 150 },
    ];

    const categories = {
      Containers: { x: 100, y: 400, width: 140, height: 100 },
      Text: { x: 300, y: 400, width: 140, height: 100 },
      Links: { x: 500, y: 400, width: 140, height: 100 },
      Media: { x: 700, y: 400, width: 140, height: 100 },
    };

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
      let tagText = this.add
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
        let placed = false;
        Object.entries(categories).forEach(([key, { x, y, width, height }]) => {
          let zone = this.add
            .zone(x, y, width, height)
            .setRectangleDropZone(width, height);
          if (
            !placed &&
            tag.category === key &&
            Phaser.Geom.Rectangle.Overlaps(
              tagText.getBounds(),
              zone.getBounds()
            )
          ) {
            tagText.disableInteractive();
            tagText.x = zone.x - tagText.width / 2;
            tagText.y = zone.y - tagText.height / 2;
            this.updateScore(10);
            placed = true;
          }
        });
        if (!placed) {
          tagText.x = tag.x;
          tagText.y = tag.y;
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
}

export default GameScene;
