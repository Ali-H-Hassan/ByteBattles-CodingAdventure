import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    const tags = [
      {
        name: "HTML",
        color: 0x9966ff,
        x: 100,
        y: 200,
        dropZoneX: 300,
        dropZoneY: 100,
      },
      {
        name: "CSS",
        color: 0x6699ff,
        x: 300,
        y: 200,
        dropZoneX: 300,
        dropZoneY: 300,
      },
    ];

    tags.forEach((tag) => {
      this.createTag(tag);
      this.createDropZone(tag);
    });

    this.add.text(20, 20, "Drag the tags to the correct container", {
      font: "18px Arial",
      fill: "#ffffff",
    });

    this.score = 0;
    this.scoreText = this.add.text(700, 20, "Score: 0", {
      font: "18px Arial",
      fill: "#ffffff",
    });
  }

  update() {}

  createTag(tag) {
    const tagGraphics = this.add.graphics({ fillStyle: { color: tag.color } });
    tagGraphics.fillRect(tag.x, tag.y, 100, 100);
    tagGraphics.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 100, 100),
      Phaser.Geom.Rectangle.Contains
    );
    this.input.setDraggable(tagGraphics);

    tagGraphics.on("drag", (pointer, dragX, dragY) => {
      tagGraphics.x = dragX;
      tagGraphics.y = dragY;
    });

    tagGraphics.on("dragend", (pointer) => {
      if (
        this.isInDropZone(pointer.x, pointer.y, tag.dropZoneX, tag.dropZoneY)
      ) {
        tagGraphics.x = tag.dropZoneX;
        tagGraphics.y = tag.dropZoneY;
        tagGraphics.input.enabled = false;
        this.updateScore();
      } else {
        tagGraphics.x = tag.x;
        tagGraphics.y = tag.y;
      }
    });
  }

  createDropZone(tag) {
    const dropZoneGraphics = this.add.graphics({
      fillStyle: { color: 0x228b22, alpha: 0.5 },
    });
    dropZoneGraphics.fillRect(tag.dropZoneX, tag.dropZoneY, 100, 100);
  }

  isInDropZone(x, y, dropZoneX, dropZoneY) {
    const dropZone = new Phaser.Geom.Rectangle(dropZoneX, dropZoneY, 100, 100);
    return dropZone.contains(x, y);
  }

  updateScore() {
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default GameScene;
