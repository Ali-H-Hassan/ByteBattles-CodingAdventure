import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(courseId) {
    super("GameScene");
    this.courseId = courseId;
  }

  preload() {
    // Load any specific assets for HTML course if necessary
  }

  create() {
    if (this.courseId === 1) {
      // If the course is HTML
      this.createHtmlGame();
    }
    // Add more conditions for other courses
  }

  createHtmlGame() {
    const htmlTags = [
      { tag: "<div>", category: "Structure Tags", x: 100, y: 200 },
      { tag: "<p>", category: "Structure Tags", x: 200, y: 200 },
      { tag: "<b>", category: "Formatting Tags", x: 300, y: 200 },
      // Add more HTML tags as necessary
    ];

    this.dropZones = {
      "Structure Tags": this.createDropZone(500, 100),
      "Formatting Tags": this.createDropZone(500, 300),
      // Add more drop zones as necessary
    };

    htmlTags.forEach((tag) => this.createHtmlTag(tag));

    this.add.text(20, 20, "Match the HTML tags with their correct categories", {
      font: "18px Arial",
      fill: "#ffffff",
    });

    this.score = 0;
    this.scoreText = this.add.text(700, 20, "Score: 0", {
      font: "18px Arial",
      fill: "#ffffff",
    });
  }

  createHtmlTag(tagData) {
    let tagText = this.add
      .text(tagData.x, tagData.y, tagData.tag, {
        font: "16px Arial",
        fill: "#fff",
        backgroundColor: "#000",
      })
      .setInteractive();

    this.input.setDraggable(tagText);

    tagText.on("drag", (pointer, dragX, dragY) => {
      tagText.x = dragX;
      tagText.y = dragY;
    });

    tagText.on("dragend", (pointer) => {
      const dropZone = this.dropZones[tagData.category];
      if (this.isInDropZone(tagText.x, tagText.y, dropZone)) {
        tagText.x = dropZone.x + dropZone.width / 2 - tagText.width / 2;
        tagText.y = dropZone.y + dropZone.height / 2 - tagText.height / 2;
        tagText.disableInteractive();
        this.updateScore(10);
      } else {
        tagText.x = tagData.x;
        tagText.y = tagData.y;
      }
    });
  }

  createDropZone(x, y, width = 200, height = 100) {
    let dropZone = this.add
      .zone(x, y, width, height)
      .setRectangleDropZone(width, height);
    dropZone.setData("category", "Structure Tags"); // Example of setting data to a zone
    // Visual representation of the drop zone (for debugging)
    let graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 0.8);
    graphics.strokeRect(x - width / 2, y - height / 2, width, height);
    return dropZone;
  }

  isInDropZone(x, y, dropZone) {
    // Phaser provides a method `Rectangle.Contains` to check this
    return dropZone.input.hitArea.contains(x - dropZone.x, y - dropZone.y);
  }

  updateScore(value) {
    this.score += value;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default GameScene;
