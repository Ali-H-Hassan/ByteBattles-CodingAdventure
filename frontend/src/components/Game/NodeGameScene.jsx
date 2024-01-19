import Phaser from "phaser";

class NodeGameScene extends Phaser.Scene {
  constructor(courseId, onGameComplete) {
    super({ key: "NodeGameScene" });
    this.courseId = courseId;
    this.onGameComplete = onGameComplete;
    this.nodes = [];
    this.lines = [];
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#282c34");
    this.createNodes();
  }

  createNodes() {
    const positions = [
      { x: 100, y: 200 },
      { x: 400, y: 200 },
      { x: 700, y: 200 },
    ];
    positions.forEach((pos, index) => {
      let node = this.add.sprite(pos.x, pos.y, "node").setInteractive();
      this.input.setDraggable(node);
      node.data = { id: index, connectedTo: null };

      node.on("drag", (pointer, dragX, dragY) => {
        node.x = dragX;
        node.y = dragY;
        this.updateLines();
      });

      node.on("dragend", () => {
        this.checkConnections();
      });

      this.nodes.push(node);
    });
  }

  updateLines() {
    this.lines.forEach((line) => line.destroy());
    this.lines = [];

    this.nodes.forEach((node) => {
      if (node.data.connectedTo !== null) {
        const targetNode = this.nodes[node.data.connectedTo];
        const line = this.add
          .line(0, 0, node.x, node.y, targetNode.x, targetNode.y, 0xffffff)
          .setOrigin(0);
        this.lines.push(line);
      }
    });
  }

  checkConnections() {
    let isCorrect = true;
    for (let i = 0; i < this.nodes.length - 1; i++) {
      if (this.nodes[i].data.connectedTo !== i + 1) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      this.onPuzzleSolved();
    }
  }

  onPuzzleSolved() {
    this.onGameComplete(100);
    const text = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Puzzle Solved!", {
        font: "40px Arial",
        fill: "#00ff00",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: "-=50",
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 1000,
    });
  }
}

export default NodeGameScene;
