import Phaser from "phaser";

class NodeGameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "NodeGameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.maxLevel = 5;
    this.currentChallenge = 0;
    this.correctAnswers = 0;
    this.timer = 90;
    this.timerText = null;
    this.gameOver = false;
    this.challenges = [];
    this.codeBlocks = [];
    this.dropZones = [];
    this.draggedBlock = null;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#1e1e1e");

    this.createBackground();
    this.createUI();

    this.initializeChallenges();
    this.showChallenge();
    this.startTimer();
  }

  createBackground() {
    const graphics = this.add.graphics();

    // VS Code-like background
    graphics.fillStyle(0x252526, 1);
    graphics.fillRect(0, 45, this.scale.width, this.scale.height - 75);

    // Subtle grid
    graphics.lineStyle(1, 0x333333, 0.3);
    for (let x = 0; x < this.scale.width; x += 40) {
      graphics.lineBetween(x, 45, x, this.scale.height - 30);
    }
  }

  createUI() {
    // Top bar - dark header
    const topBar = this.add.rectangle(this.scale.width / 2, 22, this.scale.width, 44, 0x323233);

    // Node.js branding
    const nodeIcon = this.add.circle(25, 22, 12, 0x68a063);
    this.add.text(45, 22, "Node.js Pipeline", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "14px",
      color: "#68a063",
      fontStyle: "bold",
    }).setOrigin(0, 0.5);

    // Level badge
    this.levelBadge = this.add.container(this.scale.width / 2, 22);
    const levelBg = this.add.rectangle(0, 0, 80, 24, 0x68a063);
    levelBg.setStrokeStyle(0);
    this.levelText = this.add.text(0, 0, `Level ${this.level}`, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "11px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.levelBadge.add([levelBg, this.levelText]);

    // Score
    this.add.text(this.scale.width - 170, 15, "SCORE", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "9px",
      color: "#888888",
    });
    this.scoreText = this.add.text(this.scale.width - 170, 28, "0", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "14px",
      color: "#68a063",
      fontStyle: "bold",
    });

    // Timer
    this.add.text(this.scale.width - 80, 15, "TIME", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "9px",
      color: "#888888",
    });
    this.timerText = this.add.text(this.scale.width - 80, 28, "90", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "14px",
      color: "#ffd700",
      fontStyle: "bold",
    });

    // Bottom bar
    const bottomBar = this.add.rectangle(this.scale.width / 2, this.scale.height - 15, this.scale.width, 30, 0x007acc);

    // Instructions
    this.instructionText = this.add.text(this.scale.width / 2, this.scale.height - 15, "Drag code blocks into the correct order!", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "11px",
      color: "#ffffff",
    }).setOrigin(0.5);

    // Progress dots
    this.progressDots = [];
    for (let i = 0; i < 5; i++) {
      const dot = this.add.circle(this.scale.width / 2 - 50 + i * 25, this.scale.height - 15, 4, 0x005a9e);
      dot.setStrokeStyle(1, 0xffffff, 0.5);
      this.progressDots.push(dot);
    }
    this.progressDots.forEach(d => d.setVisible(false));
  }

  initializeChallenges() {
    const allChallenges = [
      // Level 1: Basic Setup
      {
        level: 1,
        title: "Create an HTTP Server",
        blocks: [
          { code: "const http = require('http');", order: 1 },
          { code: "const server = http.createServer();", order: 2 },
          { code: "server.listen(3000);", order: 3 },
        ],
      },
      {
        level: 1,
        title: "Initialize NPM Project",
        blocks: [
          { code: "npm init -y", order: 1 },
          { code: "npm install express", order: 2 },
          { code: "node index.js", order: 3 },
        ],
      },
      {
        level: 1,
        title: "Read a File",
        blocks: [
          { code: "const fs = require('fs');", order: 1 },
          { code: "const data = fs.readFileSync('file.txt');", order: 2 },
          { code: "console.log(data.toString());", order: 3 },
        ],
      },

      // Level 2: Express Basics
      {
        level: 2,
        title: "Create Express App",
        blocks: [
          { code: "const express = require('express');", order: 1 },
          { code: "const app = express();", order: 2 },
          { code: "app.use(express.json());", order: 3 },
          { code: "app.listen(3000);", order: 4 },
        ],
      },
      {
        level: 2,
        title: "Add a GET Route",
        blocks: [
          { code: "const app = express();", order: 1 },
          { code: "app.get('/api/users', (req, res) => {", order: 2 },
          { code: "  res.json({ users: [] });", order: 3 },
          { code: "});", order: 4 },
        ],
      },
      {
        level: 2,
        title: "Handle POST Request",
        blocks: [
          { code: "app.use(express.json());", order: 1 },
          { code: "app.post('/api/data', (req, res) => {", order: 2 },
          { code: "  const body = req.body;", order: 3 },
          { code: "  res.status(201).json(body);", order: 4 },
        ],
      },

      // Level 3: Async Operations
      {
        level: 3,
        title: "Async File Read",
        blocks: [
          { code: "const fs = require('fs').promises;", order: 1 },
          { code: "async function readFile() {", order: 2 },
          { code: "  const data = await fs.readFile('data.txt');", order: 3 },
          { code: "  return data.toString();", order: 4 },
          { code: "}", order: 5 },
        ],
      },
      {
        level: 3,
        title: "Promise Chain",
        blocks: [
          { code: "fetch('https://api.example.com')", order: 1 },
          { code: "  .then(response => response.json())", order: 2 },
          { code: "  .then(data => console.log(data))", order: 3 },
          { code: "  .catch(err => console.error(err));", order: 4 },
        ],
      },
      {
        level: 3,
        title: "Try-Catch Async",
        blocks: [
          { code: "async function fetchData() {", order: 1 },
          { code: "  try {", order: 2 },
          { code: "    const data = await getData();", order: 3 },
          { code: "  } catch (error) {", order: 4 },
          { code: "    console.error(error);", order: 5 },
        ],
      },

      // Level 4: Middleware
      {
        level: 4,
        title: "Create Middleware",
        blocks: [
          { code: "const logger = (req, res, next) => {", order: 1 },
          { code: "  console.log(`${req.method} ${req.url}`);", order: 2 },
          { code: "  next();", order: 3 },
          { code: "};", order: 4 },
          { code: "app.use(logger);", order: 5 },
        ],
      },
      {
        level: 4,
        title: "Auth Middleware",
        blocks: [
          { code: "const auth = (req, res, next) => {", order: 1 },
          { code: "  const token = req.headers.authorization;", order: 2 },
          { code: "  if (!token) return res.status(401).send();", order: 3 },
          { code: "  req.user = verifyToken(token);", order: 4 },
          { code: "  next();", order: 5 },
        ],
      },
      {
        level: 4,
        title: "Error Handler",
        blocks: [
          { code: "app.use((err, req, res, next) => {", order: 1 },
          { code: "  console.error(err.stack);", order: 2 },
          { code: "  res.status(500).json({", order: 3 },
          { code: "    error: err.message", order: 4 },
          { code: "  });", order: 5 },
        ],
      },

      // Level 5: Advanced Patterns
      {
        level: 5,
        title: "Module Export",
        blocks: [
          { code: "const db = require('./database');", order: 1 },
          { code: "class UserService {", order: 2 },
          { code: "  async getUsers() {", order: 3 },
          { code: "    return await db.query('SELECT * FROM users');", order: 4 },
          { code: "  }", order: 5 },
          { code: "}", order: 6 },
        ],
      },
      {
        level: 5,
        title: "Router Setup",
        blocks: [
          { code: "const router = express.Router();", order: 1 },
          { code: "router.get('/', getAll);", order: 2 },
          { code: "router.post('/', create);", order: 3 },
          { code: "router.delete('/:id', remove);", order: 4 },
          { code: "module.exports = router;", order: 5 },
        ],
      },
      {
        level: 5,
        title: "Environment Config",
        blocks: [
          { code: "require('dotenv').config();", order: 1 },
          { code: "const config = {", order: 2 },
          { code: "  port: process.env.PORT || 3000,", order: 3 },
          { code: "  dbUrl: process.env.DATABASE_URL", order: 4 },
          { code: "};", order: 5 },
          { code: "module.exports = config;", order: 6 },
        ],
      },
    ];

    const levelChallenges = allChallenges.filter((c) => c.level === this.level);
    this.challenges = Phaser.Utils.Array.Shuffle([...levelChallenges]).slice(0, 5);
    this.currentChallenge = 0;
  }

  showChallenge() {
    this.clearChallenge();

    if (this.currentChallenge >= this.challenges.length) {
      this.completeLevel();
      return;
    }

    const challenge = this.challenges[this.currentChallenge];

    // Update progress
    this.progressDots.forEach((dot, i) => {
      dot.setVisible(true);
      if (i < this.currentChallenge) {
        dot.setFillStyle(0x68a063);
      } else if (i === this.currentChallenge) {
        dot.setFillStyle(0xffd700);
      } else {
        dot.setFillStyle(0x005a9e);
      }
    });

    // Show task title
    this.taskTitle = this.add.text(this.scale.width / 2, 60, challenge.title, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "16px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.taskSubtitle = this.add.text(this.scale.width / 2, 80, "Arrange the code blocks in correct order", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "11px",
      color: "#888888",
    }).setOrigin(0.5);

    // Create drop zones on the left
    this.createDropZones(challenge.blocks.length);

    // Create draggable blocks on the right (shuffled)
    this.createCodeBlocks(challenge.blocks);
  }

  clearChallenge() {
    if (this.taskTitle) this.taskTitle.destroy();
    if (this.taskSubtitle) this.taskSubtitle.destroy();
    if (this.checkButton) this.checkButton.destroy();
    if (this.feedbackText) this.feedbackText.destroy();

    this.codeBlocks.forEach((block) => {
      if (block.container) block.container.destroy();
    });
    this.codeBlocks = [];

    this.dropZones.forEach((zone) => {
      if (zone.container) zone.container.destroy();
    });
    this.dropZones = [];
  }

  createDropZones(count) {
    const startY = 105;
    const zoneHeight = 36;
    const gap = 6;
    const zoneWidth = 340;
    const startX = 30;

    for (let i = 0; i < count; i++) {
      const y = startY + i * (zoneHeight + gap);
      const container = this.add.container(startX + zoneWidth / 2, y);

      // Zone background
      const bg = this.add.rectangle(0, 0, zoneWidth, zoneHeight, 0x2d2d2d);
      bg.setStrokeStyle(2, 0x3c3c3c, 1);

      // Line number
      const lineNum = this.add.text(-zoneWidth / 2 + 10, 0, `${i + 1}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: "12px",
        color: "#858585",
      }).setOrigin(0, 0.5);

      // Placeholder text
      const placeholder = this.add.text(0, 0, "Drop code here...", {
        fontFamily: '"Courier New", monospace',
        fontSize: "11px",
        color: "#555555",
      }).setOrigin(0.5);

      container.add([bg, lineNum, placeholder]);

      // Set up as drop zone
      const zone = this.add.zone(startX + zoneWidth / 2, y, zoneWidth, zoneHeight);
      zone.setRectangleDropZone(zoneWidth, zoneHeight);

      this.dropZones.push({
        container,
        zone,
        bg,
        placeholder,
        index: i,
        occupiedBy: null,
        correctOrder: i + 1,
      });
    }
  }

  createCodeBlocks(blocks) {
    const shuffled = Phaser.Utils.Array.Shuffle([...blocks]);
    const startY = 105;
    const blockHeight = 36;
    const gap = 6;
    const blockWidth = 380;
    const startX = 400;

    shuffled.forEach((block, i) => {
      const y = startY + i * (blockHeight + gap);
      const container = this.add.container(startX + blockWidth / 2, y);

      // Block background
      const bg = this.add.rectangle(0, 0, blockWidth, blockHeight, 0x1e1e1e);
      bg.setStrokeStyle(2, 0x68a063);

      // Code text
      const codeText = this.add.text(0, 0, block.code, {
        fontFamily: '"Courier New", monospace',
        fontSize: "11px",
        color: "#d4d4d4",
      }).setOrigin(0.5);

      // Drag handle indicator
      const handle = this.add.text(-blockWidth / 2 + 12, 0, "⋮⋮", {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#68a063",
      }).setOrigin(0.5);

      container.add([bg, codeText, handle]);
      container.setSize(blockWidth, blockHeight);
      container.setInteractive({ draggable: true, cursor: "grab" });

      container.setData("originalX", startX + blockWidth / 2);
      container.setData("originalY", y);
      container.setData("order", block.order);
      container.setData("code", block.code);
      container.setData("inZone", null);
      container.setData("bg", bg);

      // Drag events
      container.on("dragstart", () => {
        container.setDepth(100);
        bg.setFillStyle(0x2a2a2a);
        bg.setStrokeStyle(2, 0x8bc34a);
        this.draggedBlock = container;

        // If dragged from a zone, free that zone
        const currentZone = container.getData("inZone");
        if (currentZone !== null) {
          this.dropZones[currentZone].occupiedBy = null;
          this.dropZones[currentZone].placeholder.setVisible(true);
        }
      });

      container.on("drag", (pointer, dragX, dragY) => {
        container.x = dragX;
        container.y = dragY;

        // Highlight potential drop zone
        this.dropZones.forEach((zone) => {
          if (this.isOverZone(pointer, zone.zone) && zone.occupiedBy === null) {
            zone.bg.setStrokeStyle(2, 0x68a063);
          } else {
            zone.bg.setStrokeStyle(2, 0x3c3c3c);
          }
        });
      });

      container.on("dragend", (pointer) => {
        container.setDepth(1);
        bg.setFillStyle(0x1e1e1e);
        bg.setStrokeStyle(2, 0x68a063);

        let dropped = false;

        // Check if dropped in a zone
        this.dropZones.forEach((zone) => {
          zone.bg.setStrokeStyle(2, 0x3c3c3c);

          if (this.isOverZone(pointer, zone.zone) && zone.occupiedBy === null) {
            // Snap to zone
            container.x = zone.container.x;
            container.y = zone.container.y;
            zone.occupiedBy = container;
            zone.placeholder.setVisible(false);
            container.setData("inZone", zone.index);
            dropped = true;
          }
        });

        if (!dropped) {
          // Return to original position
          container.x = container.getData("originalX");
          container.y = container.getData("originalY");
          container.setData("inZone", null);
        }

        this.draggedBlock = null;
        this.checkIfAllPlaced();
      });

      // Hover effects
      container.on("pointerover", () => {
        if (!this.draggedBlock) {
          bg.setFillStyle(0x2a2a2a);
        }
      });

      container.on("pointerout", () => {
        if (!this.draggedBlock) {
          bg.setFillStyle(0x1e1e1e);
        }
      });

      this.codeBlocks.push({ container, bg, order: block.order });
    });

    this.input.setDraggable(this.codeBlocks.map((b) => b.container));
  }

  isOverZone(pointer, zone) {
    const bounds = zone.getBounds();
    return (
      pointer.x >= bounds.x &&
      pointer.x <= bounds.x + bounds.width &&
      pointer.y >= bounds.y &&
      pointer.y <= bounds.y + bounds.height
    );
  }

  checkIfAllPlaced() {
    const allPlaced = this.dropZones.every((zone) => zone.occupiedBy !== null);

    if (allPlaced && !this.checkButton) {
      this.createCheckButton();
    } else if (!allPlaced && this.checkButton) {
      this.checkButton.destroy();
      this.checkButton = null;
    }
  }

  createCheckButton() {
    const challenge = this.challenges[this.currentChallenge];
    const buttonY = 105 + challenge.blocks.length * 42 + 20;

    this.checkButton = this.add.container(200, buttonY);

    const btnBg = this.add.rectangle(0, 0, 160, 36, 0x68a063);
    btnBg.setStrokeStyle(0);

    const btnText = this.add.text(0, 0, "Check Order", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "13px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.checkButton.add([btnBg, btnText]);
    this.checkButton.setSize(160, 36);
    this.checkButton.setInteractive({ cursor: "pointer" });

    this.checkButton.on("pointerover", () => {
      btnBg.setFillStyle(0x7cb342);
    });

    this.checkButton.on("pointerout", () => {
      btnBg.setFillStyle(0x68a063);
    });

    this.checkButton.on("pointerdown", () => {
      this.verifyOrder();
    });

    // Entrance animation
    this.checkButton.setAlpha(0);
    this.checkButton.y = buttonY + 20;
    this.tweens.add({
      targets: this.checkButton,
      alpha: 1,
      y: buttonY,
      duration: 200,
      ease: "Power2",
    });
  }

  verifyOrder() {
    let allCorrect = true;

    this.dropZones.forEach((zone, index) => {
      const block = zone.occupiedBy;
      if (block) {
        const blockOrder = block.getData("order");
        const bg = block.getData("bg");

        if (blockOrder === zone.correctOrder) {
          // Correct position
          bg.setStrokeStyle(2, 0x4caf50);
          zone.bg.setFillStyle(0x1b3d1b);
        } else {
          // Wrong position
          bg.setStrokeStyle(2, 0xf44336);
          zone.bg.setFillStyle(0x3d1b1b);
          allCorrect = false;
        }
      }
    });

    // Disable further dragging
    this.codeBlocks.forEach((block) => {
      block.container.disableInteractive();
    });

    if (this.checkButton) {
      this.checkButton.disableInteractive();
    }

    if (allCorrect) {
      this.handleCorrect();
    } else {
      this.handleIncorrect();
    }
  }

  handleCorrect() {
    this.correctAnswers++;
    const points = 150 + Math.floor(this.timer * 2);
    this.updateScore(points);

    // Success feedback
    this.feedbackText = this.add.text(200, this.checkButton.y + 40, "Correct!", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "14px",
      color: "#4caf50",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Success animation
    this.tweens.add({
      targets: this.dropZones.map((z) => z.container),
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 150,
      yoyo: true,
    });

    this.time.delayedCall(1500, () => {
      this.currentChallenge++;
      this.showChallenge();
    });
  }

  handleIncorrect() {
    this.updateScore(-30);

    // Show correct order hint
    this.feedbackText = this.add.text(200, this.checkButton.y + 40, "Wrong order! Check the sequence.", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "12px",
      color: "#f44336",
    }).setOrigin(0.5);

    // Shake animation
    this.tweens.add({
      targets: this.dropZones.map((z) => z.container),
      x: "+=5",
      duration: 50,
      yoyo: true,
      repeat: 3,
    });

    this.time.delayedCall(2000, () => {
      this.currentChallenge++;
      this.showChallenge();
    });
  }

  updateScore(points) {
    this.score += points;
    if (this.score < 0) this.score = 0;

    this.scoreText.setText(this.score.toString());

    const color = points > 0 ? "#4caf50" : "#f44336";
    this.scoreText.setColor(color);

    this.tweens.add({
      targets: this.scoreText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
      onComplete: () => {
        this.scoreText.setColor("#68a063");
      },
    });
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timer--;
        this.timerText.setText(this.timer.toString());

        if (this.timer <= 20) {
          this.timerText.setColor("#f44336");
        } else if (this.timer <= 40) {
          this.timerText.setColor("#ff9800");
        }

        if (this.timer <= 0) {
          this.endGame(false);
        }
      },
      loop: true,
    });
  }

  completeLevel() {
    if (this.timerEvent) this.timerEvent.remove();

    const accuracy = Math.round((this.correctAnswers / this.challenges.length) * 100);
    const timeBonus = this.timer * 3;
    const levelBonus = this.level * 100;

    this.updateScore(timeBonus + levelBonus);

    // Level complete overlay
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x1e1e1e,
      0.95
    );

    const container = this.add.container(this.scale.width / 2, this.scale.height / 2);

    const cardBg = this.add.rectangle(0, 0, 280, 200, 0x252526);
    cardBg.setStrokeStyle(2, 0x68a063);

    const icon = this.add.circle(0, -60, 25, 0x68a063);
    const checkMark = this.add.text(0, -60, "✓", {
      fontSize: "24px",
      color: "#ffffff",
    }).setOrigin(0.5);

    const title = this.add.text(0, -15, `Level ${this.level} Complete!`, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "18px",
      color: "#68a063",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const stats = this.add.text(0, 30, `Accuracy: ${accuracy}%\nTime Bonus: +${timeBonus}\nLevel Bonus: +${levelBonus}`, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "11px",
      color: "#888888",
      align: "center",
      lineSpacing: 4,
    }).setOrigin(0.5);

    container.add([cardBg, icon, checkMark, title, stats]);

    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: "Back.easeOut",
    });

    if (this.level >= this.maxLevel) {
      this.time.delayedCall(2500, () => {
        container.destroy();
        overlay.destroy();
        this.endGame(true);
      });
    } else {
      this.time.delayedCall(1000, () => {
        const continueBtn = this.add.container(0, 85);

        const btnBg = this.add.rectangle(0, 0, 140, 32, 0x68a063);
        const btnText = this.add.text(0, 0, "Next Level →", {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: "12px",
          color: "#ffffff",
          fontStyle: "bold",
        }).setOrigin(0.5);

        continueBtn.add([btnBg, btnText]);
        continueBtn.setSize(140, 32);
        continueBtn.setInteractive({ cursor: "pointer" });
        container.add(continueBtn);

        continueBtn.on("pointerover", () => btnBg.setFillStyle(0x7cb342));
        continueBtn.on("pointerout", () => btnBg.setFillStyle(0x68a063));
        continueBtn.on("pointerdown", () => {
          container.destroy();
          overlay.destroy();
          this.startNextLevel();
        });

        continueBtn.setAlpha(0);
        this.tweens.add({
          targets: continueBtn,
          alpha: 1,
          duration: 300,
        });
      });
    }
  }

  startNextLevel() {
    this.level++;
    this.timer = Math.max(60, 90 - (this.level - 1) * 10);
    this.currentChallenge = 0;
    this.correctAnswers = 0;

    this.levelText.setText(`Level ${this.level}`);
    this.timerText.setText(this.timer.toString());
    this.timerText.setColor("#ffd700");

    this.progressDots.forEach((dot) => {
      dot.setFillStyle(0x005a9e);
      dot.setVisible(false);
    });

    this.initializeChallenges();
    this.showChallenge();
    this.startTimer();
  }

  endGame(victory) {
    if (this.gameOver) return;
    this.gameOver = true;

    if (this.timerEvent) this.timerEvent.remove();
    this.tweens.killAll();

    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x1e1e1e,
      0.95
    );

    const container = this.add.container(this.scale.width / 2, this.scale.height / 2);

    const cardBg = this.add.rectangle(0, 0, 300, 240, 0x252526);
    cardBg.setStrokeStyle(2, victory ? 0x68a063 : 0xf44336);

    const icon = this.add.text(0, -80, victory ? "🎉" : "⏰", {
      fontSize: "40px",
    }).setOrigin(0.5);

    const title = this.add.text(0, -30, victory ? "Pipeline Complete!" : "Time's Up!", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "20px",
      color: victory ? "#68a063" : "#f44336",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const subtitle = this.add.text(0, 5, victory ? "All levels completed!" : "Keep practicing!", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "12px",
      color: "#888888",
    }).setOrigin(0.5);

    const scoreLabel = this.add.text(0, 40, "Final Score", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "10px",
      color: "#666666",
    }).setOrigin(0.5);

    const finalScore = this.add.text(0, 70, this.score.toString(), {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "32px",
      color: "#68a063",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const levelInfo = this.add.text(0, 105, `Level ${this.level} reached`, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "11px",
      color: "#666666",
    }).setOrigin(0.5);

    container.add([cardBg, icon, title, subtitle, scoreLabel, finalScore, levelInfo]);

    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: "Back.easeOut",
    });

    const clickText = this.add.text(this.scale.width / 2, this.scale.height - 40, "Click anywhere to continue", {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: "11px",
      color: "#666666",
    }).setOrigin(0.5);

    this.tweens.add({
      targets: clickText,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    overlay.setInteractive();
    overlay.once("pointerdown", () => {
      if (this.onGameComplete) {
        this.onGameComplete(this.score);
      }
    });
  }
}

export default NodeGameScene;
