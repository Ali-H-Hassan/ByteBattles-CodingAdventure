import Phaser from "phaser";

class NodeMazeScene extends Phaser.Scene {
  constructor() {
    super({ key: "NodeMazeScene" });
    this.player = null;
    this.cursors = null;
    this.correctCodeGroup = null;
    this.incorrectCodeGroup = null;
    this.score = 0;
    this.scoreText = null;
  }

  preload() {
    this.load.image("player", "/assets/player.png");
  }

  create() {
    this.displayGameStartPrompt();
    this.player = this.createPlayer();
    this.correctCodeGroup = this.createCodeSnippets(true);
    this.incorrectCodeGroup = this.createCodeSnippets(false);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createScoreText();
  }

  update() {
    this.handlePlayerMovement();
    this.physics.overlap(
      this.player,
      this.correctCodeGroup,
      this.collectCode,
      null,
      this
    );
    this.physics.overlap(
      this.player,
      this.incorrectCodeGroup,
      this.hitIncorrectCode,
      null,
      this
    );

    if (this.shouldEndGame()) {
      this.endGame();
    }
  }

  createPlayer() {
    let player = this.physics.add
      .sprite(this.scale.width / 3, this.scale.height / 3, "player")
      .setScale(0.1);
    player.setCollideWorldBounds(true);
    return player;
  }

  createCodeSnippets(isCorrect) {
    const group = this.physics.add.group();

    const codeTexts = isCorrect
      ? ["const a = 0;", "let b = 'Node';", "require('http');"]
      : ["var x = 10;", "#include <iostream>", "<div></div>"];

    for (let i = 0; i < codeTexts.length; i++) {
      let x = Phaser.Math.Between(100, 700);
      let y = Phaser.Math.Between(100, 500);

      let text = this.add.text(x, y, codeTexts[i], {
        font: "16px Arial",
        fill: "#fff",
        backgroundColor: "#000a",
        padding: { x: 5, y: 3 },
      });

      let physicsBody = this.physics.add.sprite(x, y, null).setVisible(false);
      physicsBody.setInteractive();
      physicsBody.setData("isCorrect", isCorrect);
      physicsBody.setData("text", text);

      group.add(physicsBody);
    }

    return group;
  }

  handlePlayerMovement() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    }
  }

  collectCode(player, physicsBody) {
    let text = physicsBody.getData("text");
    if (physicsBody.getData("isCorrect")) {
      this.score += 10;
    } else {
      this.score -= 5;
    }

    text.destroy();
    physicsBody.destroy();

    this.scoreText.setText(`Score: ${this.score}`);
  }

  hitIncorrectCode(player, codeSnippet) {
    this.collectCode(player, codeSnippet);
  }

  createScoreText() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#FFF",
    });
  }

  displayGameStartPrompt() {
    const prompt = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Collect correct Node.js snippets and avoid others!\nPress any key to start.",
        { fontSize: "24px", fill: "#fff", align: "center" }
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown", () => {
      prompt.destroy();
    });
  }

  shouldEndGame() {
    return this.correctCodeGroup.countActive(true) === 0;
  }

  endGame() {
    this.player.setVelocity(0, 0);
    this.player.setActive(false);
    this.player.setVisible(false);

    let endText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Game Over! Your score: " + this.score,
        { fontSize: "32px", fill: "#FFF", fontStyle: "italic" }
      )
      .setOrigin(0.5);

    endText.setAlpha(0);

    this.tweens.add({
      targets: endText,
      alpha: 1,
      duration: 2000,
      ease: "Sine.easeInOut",
    });
  }
}

export default NodeMazeScene;
