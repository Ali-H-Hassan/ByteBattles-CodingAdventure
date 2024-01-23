import Phaser from "phaser";

class NodeMazeScene extends Phaser.Scene {
  constructor() {
    super({ key: "NodeMazeScene" });
    this.player = null;
    this.cursors = null;
    this.modulesGroup = null;
    this.bugsGroup = null;
    this.score = 0;
    this.scoreText = null;
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("module", "assets/module.png");
    this.load.image("bug", "assets/bug.png");
  }

  create() {
    this.createMaze();
    this.player = this.createPlayer();
    this.modulesGroup = this.createCollectibles();
    this.bugsGroup = this.createObstacles();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createScoreText();
  }

  update() {
    this.handlePlayerMovement();
    this.physics.overlap(
      this.player,
      this.modulesGroup,
      this.collectModule,
      null,
      this
    );
    this.physics.overlap(this.player, this.bugsGroup, this.hitBug, null, this);
  }

  createMaze() {
    const graphics = this.add.graphics({
      lineStyle: { width: 2, color: 0xffffff },
    });
    const maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    ];

    const tileSize = 64;
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          graphics.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      });
    });
  }

  createPlayer() {
    let player = this.physics.add.sprite(50, 50, "player");
    player.setCollideWorldBounds(true);
    player.setScale(0.05);
    return player;
  }
  Scaling;
  createCollectibles() {
    const modules = this.physics.add.group({
      key: "module",
      repeat: 3,
      setXY: { x: 100, y: 100, stepX: 70, stepY: 70 },
    });

    modules.children.iterate((module) => {
      module.setScale(0.05);
    });

    return modules;
  }

  createObstacles() {
    const bugs = this.physics.add.group({
      key: "bug",
      repeat: 1,
      setXY: { x: 100, y: 300, stepX: 100, stepY: 100 },
    });

    bugs.children.iterate((bug) => {
      bug.setScale(0.05);
    });

    return bugs;
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

  collectModule(player, module) {
    module.disableBody(true, true); // Disable the module that was collected
    this.score += 10; // Update the score
    this.scoreText.setText(`Score: ${this.score}`);

    // Check if all modules have been collected
    if (this.modulesGroup.countActive(true) === 0) {
      this.endGame();
    }
  }

  hitBug(player, bug) {
    this.score -= 15; // Update the score negatively
    this.scoreText.setText(`Score: ${this.score}`);
    // You can add logic here to end the game or damage the player
  }

  createScoreText() {
    this.scoreText = this.add
      .text(16, 16, "Score: 0", { fontSize: "32px", fill: "#FFF" })
      .setScrollFactor(0);
  }
  endGame() {
    // Stop player movement
    this.player.setVelocity(0, 0);
    this.player.setActive(false);
    this.player.setVisible(false);

    // Display endgame text
    let endText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Game Over! Your score: " + this.score,
        {
          fontSize: "32px",
          fill: "#FFF",
        }
      )
      .setOrigin(0.5);

    // Optionally, add a button or click event to restart or go back to menu
    // this.input.on('pointerdown', () => this.scene.start('MenuScene')); // Example
  }
}

export default NodeMazeScene;
