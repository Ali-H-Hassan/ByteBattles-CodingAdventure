import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(courseId) {
    super({ key: "GameScene" });
    this.courseId = courseId;
  }

  preload() {}

  create() {
    this.score = 0;
    this.createTitle();
    this.createTagsAndZones();
    this.createScoreText();
  }

  createTitle() {
    let titleText = "";
    switch (this.courseId) {
      case 1:
        titleText = "HTML Tag Matching!";
        break;
      default:
        titleText = "Matching Game";
        break;
    }
    this.title = this.add
      .text(this.scale.width / 2, 40, titleText, {
        font: "40px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createTagsAndZones() {
    const tags = [
      { text: "<div>", category: "container", x: 100, y: 150 },
      { text: "<p>", category: "text", x: 300, y: 150 },
      { text: "<a>", category: "link", x: 500, y: 150 },
      // Add more tags as needed
    ];

    const categories = {
      container: this.add.zone(100, 400, 140, 100).setName("container"),
      text: this.add.zone(300, 400, 140, 100).setName("text"),
      link: this.add.zone(500, 400, 140, 100).setName("link"),
      // Define more categories as needed
    };

    Object.values(categories).forEach((zone) => {
      this.add.graphics().lineStyle(2, 0xffffff).strokeRectShape(zone);
    });

    tags.forEach((tag) => {
      const tagText = this.add
        .text(tag.x, tag.y, tag.text, {
          font: "22px Arial",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: { left: 5, right: 5, top: 5, bottom: 5 },
        })
        .setInteractive();

      this.input.setDraggable(tagText);

      tagText.on("drag", (pointer, dragX, dragY) => {
        tagText.x = dragX;
        tagText.y = dragY;
      });

      tagText.on("dragend", (pointer, gameObject) => {
        const category = categories[tag.category];
        if (
          Phaser.Geom.Rectangle.Overlaps(
            tagText.getBounds(),
            category.getBounds()
          )
        ) {
          tagText.disableInteractive();
          tagText.x = category.x;
          tagText.y = category.y;
          this.updateScore(10);
          tagText.setBackgroundColor("#228B22");
        } else {
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
