import Phaser from "phaser";

class NodeMazeScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "NodeMazeScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.player = null;
    this.packages = null;
    this.cursors = null;
    this.timer = 60;
    this.timerText = null;
    this.gameOver = false;
    this.collectedPackages = 0;
    this.targetPackages = 5;
  }

  preload() {}

  create() {
    const { backgroundColor, titleText } = this.courseData.gameSceneConfig || {};

    this.cameras.main.setBackgroundColor(backgroundColor || "#1a1a2e");
    
    // Initialize cursors early
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.createBackground();
    this.createTitle(titleText || "Node.js Package Collector");
    this.createScoreText();
    this.createTimerText();
    this.createInstructions();
    
    this.createPlayer();
    this.createPackages();
    this.setupPhysics();
    this.startSpawning();
    this.startTimer();
  }

  createBackground() {
    // Animated gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f3460, 0x0f3460, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);
    
    // Floating particles
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const particle = this.add.circle(x, y, 3, 0x00c354, 0.4);
      
      this.tweens.add({
        targets: particle,
        y: y - 200,
        x: x + Phaser.Math.Between(-50, 50),
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        ease: "Linear"
      });
    }
  }

  createTitle(titleText) {
    this.add
      .text(this.scale.width / 2, 25, titleText, {
        font: "bold 26px Arial",
        fill: "#00c354",
        stroke: "#ffffff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  createInstructions() {
    this.add
      .text(this.scale.width / 2, 55, "Use ← → arrows to catch Node.js packages!", {
        font: "14px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createScoreText() {
    this.scoreText = this.add.text(15, 15, "Score: 0 | Packages: 0/5", {
      font: "bold 18px Arial",
      fill: "#00c354",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
  }

  createTimerText() {
    this.timerText = this.add.text(this.scale.width - 120, 15, "Time: 60", {
      font: "bold 18px Arial",
      fill: "#ff6b6b",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
  }

  createPlayer() {
    // Create player as a container with physics body
    const playerY = this.scale.height - 100;
    const playerX = this.scale.width / 2;
    
    // Create container for player visuals
    const playerContainer = this.add.container(playerX, playerY);
    
    // Player body (package collector) - rectangle
    const playerBody = this.add.rectangle(0, 0, 120, 30, 0x00c354, 1);
    playerBody.setStrokeStyle(4, 0xffffff, 1);
    
    // Player collector (basket) - triangle using graphics
    const basket = this.add.graphics();
    basket.fillStyle(0x4ecdc4, 1);
    basket.fillTriangle(0, 15, -50, 35, 50, 35);
    basket.lineStyle(3, 0xffffff, 1);
    basket.strokeTriangle(0, 15, -50, 35, 50, 35);
    basket.setDepth(1);
    
    // Player icon
    const icon = this.add.text(0, 0, "📦", {
      font: "24px Arial"
    }).setOrigin(0.5);
    
    playerContainer.add([playerBody, basket, icon]);
    playerContainer.setSize(120, 50);
    
    // Create physics body for the container
    this.physics.world.enable(playerContainer);
    playerContainer.body.setSize(120, 50);
    playerContainer.body.setCollideWorldBounds(true);
    playerContainer.body.setImmovable(true);
    
    this.player = playerContainer;
  }

  createPackages() {
    this.packages = this.physics.add.group();
    
    // Node.js package names
    this.correctPackages = ["express", "fs", "http", "path", "cors", "dotenv", "nodemon"];
    this.incorrectPackages = ["react", "vue", "angular", "jquery", "bootstrap", "python", "java"];
  }

  setupPhysics() {
    // Collision between player and packages
    this.physics.add.overlap(
      this.player,
      this.packages,
      this.collectPackage,
      null,
      this
    );
  }

  startSpawning() {
    this.spawnEvent = this.time.addEvent({
      delay: 1500 - (this.level * 100), // Faster spawning as level increases
      callback: () => {
        if (!this.gameOver) {
          this.spawnPackage();
        }
      },
      loop: true
    });
  }

  spawnPackage() {
    const x = Phaser.Math.Between(60, this.scale.width - 60);
    const isCorrect = Phaser.Math.Between(0, 100) < 70; // 70% correct packages
    const packageName = isCorrect
      ? Phaser.Utils.Array.GetRandom(this.correctPackages)
      : Phaser.Utils.Array.GetRandom(this.incorrectPackages);
    
    // Create package as container with physics
    const packageContainer = this.add.container(x, -40);
    
    // Create visual elements
    const boxColor = isCorrect ? 0x00c354 : 0xff6b6b;
    const box = this.add.rectangle(0, 0, 70, 70, boxColor, 1);
    box.setStrokeStyle(3, 0xffffff);
    
    // Package icon
    const icon = this.add.text(0, -15, "📦", {
      font: "28px Arial"
    }).setOrigin(0.5);
    
    // Package name
    const nameText = this.add.text(0, 20, packageName, {
      font: "bold 11px Arial",
      fill: "#ffffff",
      wordWrap: { width: 65 },
      align: "center"
    }).setOrigin(0.5);
    
    packageContainer.add([box, icon, nameText]);
    packageContainer.setSize(70, 70);
    
    // Enable physics for container
    this.physics.world.enable(packageContainer);
    packageContainer.body.setSize(70, 70);
    packageContainer.body.setVelocityY(150 + (this.level * 30));
    packageContainer.body.setCollideWorldBounds(false);
    packageContainer.body.setGravityY(0);
    
    // Store data
    packageContainer.setData("isCorrect", isCorrect);
    packageContainer.setData("name", packageName);
    
    // Add to group
    this.packages.add(packageContainer);
    
    // Glow effect for correct packages
    if (isCorrect) {
      this.tweens.add({
        targets: box,
        alpha: { from: 1, to: 0.7 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }
    
    // Remove if it goes off screen
    this.time.delayedCall(8000, () => {
      if (packageContainer && packageContainer.active) {
        packageContainer.destroy();
      }
    });
  }

  collectPackage(player, packageObj) {
    const isCorrect = packageObj.getData("isCorrect");
    
    if (isCorrect) {
      this.score += 50;
      this.collectedPackages++;
      
      // Success effect
      const success = this.add.text(
        packageObj.x,
        packageObj.y - 30,
        "+50",
        {
          font: "bold 24px Arial",
          fill: "#00c354"
        }
      );
      
      this.tweens.add({
        targets: success,
        y: success.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => success.destroy()
      });
      
      // Check level completion
      if (this.collectedPackages >= this.targetPackages) {
        this.completeLevel();
      }
    } else {
      this.score -= 25;
      if (this.score < 0) this.score = 0;
      
      // Error effect
      const error = this.add.text(
        packageObj.x,
        packageObj.y - 30,
        "-25",
        {
          font: "bold 24px Arial",
          fill: "#ff6b6b"
        }
      );
      
      this.tweens.add({
        targets: error,
        y: error.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => error.destroy()
      });
      
      // Shake player
      this.tweens.add({
        targets: this.player,
        x: this.player.x - 10,
        duration: 50,
        yoyo: true,
        repeat: 4
      });
    }
    
    // Destroy package
    packageObj.destroy();
    this.updateScore();
  }

  update() {
    // Player movement
    if (!this.gameOver && this.player && this.player.body) {
      this.player.body.setVelocityX(0);
      
      if (this.cursors && this.cursors.left && this.cursors.left.isDown) {
        this.player.body.setVelocityX(-400);
      } else if (this.cursors && this.cursors.right && this.cursors.right.isDown) {
        this.player.body.setVelocityX(400);
      }
    }
    
    // Remove packages that went off screen
    if (this.packages && this.packages.children) {
      this.packages.children.entries.forEach(pkg => {
        if (pkg && pkg.active && pkg.y > this.scale.height + 100) {
          pkg.destroy();
        }
      });
    }
  }

  completeLevel() {
    this.spawnEvent.remove();
    
    // Time bonus
    const timeBonus = this.timer * 3;
    this.score += timeBonus;
    
    // Success message
    const successText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Level ${this.level} Complete!\n+${timeBonus} Time Bonus`,
      {
        font: "bold 32px Arial",
        fill: "#00c354",
        stroke: "#ffffff",
        strokeThickness: 4,
        align: "center"
      }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: successText,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: "Back.easeOut"
    });
    
    // Next level
    this.time.delayedCall(2000, () => {
      successText.destroy();
      
      if (this.level < 3) {
        this.level++;
        this.collectedPackages = 0;
        this.targetPackages = 5 + (this.level * 2);
        this.timer = 60;
        this.timerText.setFill("#ff6b6b");
        
        // Clear packages
        this.packages.children.entries.forEach(pkg => pkg.destroy());
        
        // Restart spawning
        this.startSpawning();
      } else {
        this.endGame(true);
      }
    });
  }

  updateScore() {
    this.scoreText.setText(`Score: ${this.score} | Packages: ${this.collectedPackages}/${this.targetPackages}`);
    
    this.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 150,
      yoyo: true
    });
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timer--;
        this.timerText.setText(`Time: ${this.timer}`);
        
        if (this.timer <= 10) {
          this.timerText.setFill("#ff0000");
          this.tweens.add({
            targets: this.timerText,
            scale: 1.1,
            duration: 200,
            yoyo: true
          });
        }
        
        if (this.timer <= 0) {
          this.endGame(false);
        }
      },
      loop: true
    });
  }

  endGame(victory = false) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.timerEvent.remove();
    if (this.spawnEvent) this.spawnEvent.remove();
    
    this.tweens.killAll();
    if (this.player && this.player.body) {
      this.player.body.setVelocityX(0);
    }
    
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.85
    );
    
    const message = victory 
      ? `Victory!\nFinal Score: ${this.score}`
      : `Game Over!\nFinal Score: ${this.score}`;
    
    const gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      message,
      {
        font: "bold 36px Arial",
        fill: victory ? "#00c354" : "#ff6b6b",
        stroke: "#ffffff",
        strokeThickness: 4,
        align: "center"
      }
    ).setOrigin(0.5);
    
    const clickText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      "Click anywhere to continue",
      {
        font: "24px Arial",
        fill: "#ffffff"
      }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: clickText,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
    
    overlay.setInteractive();
    overlay.once("pointerdown", () => {
      if (this.onGameComplete) {
        this.onGameComplete(this.score);
      }
    });
  }
}

export default NodeMazeScene;
