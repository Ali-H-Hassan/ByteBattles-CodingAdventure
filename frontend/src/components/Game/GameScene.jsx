import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "GameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.maxLevel = 5;
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.timer = 60;
    this.gameOver = false;
    this.options = [];
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#0f0f23");
    this.createUI();
    this.initializeLevel();
  }

  createUI() {
    // Header
    this.add.rectangle(400, 20, 800, 40, 0x1a1a3e);

    // Title
    this.add.text(15, 20, "<HTML/>", {
      fontFamily: '"Courier New", monospace',
      fontSize: "14px",
      color: "#f48041",
      fontStyle: "bold"
    }).setOrigin(0, 0.5);

    this.add.text(75, 20, "Tag Master", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#ffffff"
    }).setOrigin(0, 0.5);

    // Level
    this.levelText = this.add.text(400, 20, `Level ${this.level}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#00cc00",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Score
    this.add.text(600, 13, "Score", { fontFamily: "Arial", fontSize: "9px", color: "#666" });
    this.scoreText = this.add.text(600, 26, "0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffcc00",
      fontStyle: "bold"
    });

    // Timer
    this.add.text(720, 13, "Time", { fontFamily: "Arial", fontSize: "9px", color: "#666" });
    this.timerText = this.add.text(720, 26, "60", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ff6b6b",
      fontStyle: "bold"
    });

    // Question area
    this.questionBg = this.add.rectangle(400, 100, 760, 80, 0x1e1e3f);
    this.questionBg.setStrokeStyle(2, 0x3d3d6b);

    this.questionLabel = this.add.text(400, 75, "Which tag is used for:", {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#888"
    }).setOrigin(0.5);

    this.questionText = this.add.text(400, 105, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Progress
    this.add.rectangle(400, 560, 760, 6, 0x1a1a3e);
    this.progressBar = this.add.rectangle(24, 560, 0, 4, 0x00cc00).setOrigin(0, 0.5);

    this.progressText = this.add.text(400, 580, "Question 1/5", {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#666"
    }).setOrigin(0.5);

    this.startTimer();
  }

  initializeLevel() {
    const questionsByLevel = [
      // Level 1 - Basic Structure
      [
        { q: "The root element of an HTML page", a: "<html>", opts: ["<html>", "<body>", "<head>", "<root>"] },
        { q: "Container for metadata", a: "<head>", opts: ["<head>", "<meta>", "<title>", "<header>"] },
        { q: "Visible page content", a: "<body>", opts: ["<body>", "<main>", "<content>", "<div>"] },
        { q: "Page title in browser tab", a: "<title>", opts: ["<title>", "<h1>", "<name>", "<head>"] },
        { q: "A paragraph of text", a: "<p>", opts: ["<p>", "<text>", "<para>", "<t>"] }
      ],
      // Level 2 - Text Elements
      [
        { q: "Main heading (largest)", a: "<h1>", opts: ["<h1>", "<heading>", "<title>", "<big>"] },
        { q: "Bold/strong text", a: "<strong>", opts: ["<strong>", "<bold>", "<b>", "<em>"] },
        { q: "Italic/emphasized text", a: "<em>", opts: ["<em>", "<italic>", "<i>", "<stress>"] },
        { q: "Line break", a: "<br>", opts: ["<br>", "<break>", "<lb>", "<nl>"] },
        { q: "Inline text container", a: "<span>", opts: ["<span>", "<inline>", "<text>", "<s>"] }
      ],
      // Level 3 - Links & Media
      [
        { q: "Hyperlink to another page", a: "<a>", opts: ["<a>", "<link>", "<href>", "<url>"] },
        { q: "Display an image", a: "<img>", opts: ["<img>", "<image>", "<pic>", "<photo>"] },
        { q: "Embed a video", a: "<video>", opts: ["<video>", "<media>", "<movie>", "<vid>"] },
        { q: "Embed audio content", a: "<audio>", opts: ["<audio>", "<sound>", "<music>", "<mp3>"] },
        { q: "External resource link (CSS)", a: "<link>", opts: ["<link>", "<style>", "<css>", "<href>"] }
      ],
      // Level 4 - Lists & Tables
      [
        { q: "Unordered (bullet) list", a: "<ul>", opts: ["<ul>", "<list>", "<ol>", "<bullets>"] },
        { q: "Ordered (numbered) list", a: "<ol>", opts: ["<ol>", "<ul>", "<numbers>", "<list>"] },
        { q: "List item", a: "<li>", opts: ["<li>", "<item>", "<list>", "<bullet>"] },
        { q: "Create a table", a: "<table>", opts: ["<table>", "<grid>", "<data>", "<rows>"] },
        { q: "Table row", a: "<tr>", opts: ["<tr>", "<row>", "<trow>", "<line>"] }
      ],
      // Level 5 - Forms & Semantic
      [
        { q: "User input form", a: "<form>", opts: ["<form>", "<input>", "<submit>", "<data>"] },
        { q: "Text input field", a: "<input>", opts: ["<input>", "<text>", "<field>", "<form>"] },
        { q: "Clickable button", a: "<button>", opts: ["<button>", "<btn>", "<click>", "<submit>"] },
        { q: "Page header section", a: "<header>", opts: ["<header>", "<head>", "<top>", "<banner>"] },
        { q: "Navigation links", a: "<nav>", opts: ["<nav>", "<menu>", "<links>", "<navigation>"] }
      ]
    ];

    this.questions = questionsByLevel[this.level - 1];
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.showQuestion();
  }

  showQuestion() {
    // Clear old options
    this.options.forEach(o => o.destroy());
    this.options = [];

    if (this.currentQuestion >= this.questions.length) {
      this.completeLevel();
      return;
    }

    const q = this.questions[this.currentQuestion];
    this.questionText.setText(q.q);
    this.progressText.setText(`Question ${this.currentQuestion + 1}/5`);

    // Update progress bar
    const progress = (this.currentQuestion / 5) * 752;
    this.tweens.add({ targets: this.progressBar, width: progress, duration: 200 });

    // Create 4 option buttons in 2x2 grid
    const shuffled = Phaser.Utils.Array.Shuffle([...q.opts]);
    const positions = [
      { x: 250, y: 220 }, { x: 550, y: 220 },
      { x: 250, y: 340 }, { x: 550, y: 340 }
    ];

    shuffled.forEach((opt, i) => {
      const btn = this.createOptionButton(positions[i].x, positions[i].y, opt, opt === q.a);
      this.options.push(btn);
    });
  }

  createOptionButton(x, y, text, isCorrect) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 260, 90, 0x1e1e3f);
    bg.setStrokeStyle(2, 0x4d4d8a);

    const tagText = this.add.text(0, 0, text, {
      fontFamily: '"Courier New", monospace',
      fontSize: "22px",
      color: "#f48041",
      fontStyle: "bold"
    }).setOrigin(0.5);

    container.add([bg, tagText]);
    container.setSize(260, 90);
    container.setInteractive({ cursor: "pointer" });

    container.setData("correct", isCorrect);
    container.setData("bg", bg);

    container.on("pointerover", () => {
      bg.setFillStyle(0x2a2a5a);
      bg.setStrokeStyle(2, 0x6d6daa);
    });

    container.on("pointerout", () => {
      bg.setFillStyle(0x1e1e3f);
      bg.setStrokeStyle(2, 0x4d4d8a);
    });

    container.on("pointerdown", () => this.selectOption(container, isCorrect));

    return container;
  }

  selectOption(selected, isCorrect) {
    // Disable all options
    this.options.forEach(o => o.disableInteractive());

    if (isCorrect) {
      // Correct answer
      const bg = selected.getData("bg");
      bg.setFillStyle(0x1a4d1a);
      bg.setStrokeStyle(3, 0x00cc00);

      this.correctAnswers++;
      const points = 100 + Math.floor(this.timer * 2);
      this.score += points;
      this.scoreText.setText(this.score.toString());

      // Flash effect
      this.tweens.add({
        targets: selected,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        yoyo: true
      });
    } else {
      // Wrong answer
      const bg = selected.getData("bg");
      bg.setFillStyle(0x4d1a1a);
      bg.setStrokeStyle(3, 0xff4444);

      // Show correct answer
      this.options.forEach(o => {
        if (o.getData("correct")) {
          const correctBg = o.getData("bg");
          correctBg.setFillStyle(0x1a4d1a);
          correctBg.setStrokeStyle(3, 0x00cc00);
        }
      });

      this.score = Math.max(0, this.score - 25);
      this.scoreText.setText(this.score.toString());

      // Shake effect
      this.tweens.add({
        targets: selected,
        x: selected.x + 8,
        duration: 50,
        yoyo: true,
        repeat: 2
      });
    }

    // Next question
    this.time.delayedCall(1000, () => {
      this.currentQuestion++;
      this.showQuestion();
    });
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timer--;
        this.timerText.setText(this.timer.toString());
        if (this.timer <= 10) this.timerText.setColor("#ff4444");
        else if (this.timer <= 20) this.timerText.setColor("#ff8844");
        if (this.timer <= 0) this.endGame(false);
      },
      loop: true
    });
  }

  completeLevel() {
    const timeBonus = this.timer * 5;
    const levelBonus = this.level * 50;
    const accuracy = Math.round((this.correctAnswers / 5) * 100);
    this.score += timeBonus + levelBonus;
    this.scoreText.setText(this.score.toString());

    if (this.level >= this.maxLevel) {
      this.time.delayedCall(400, () => this.endGame(true));
      return;
    }

    // Level complete popup
    const box = this.add.rectangle(400, 300, 280, 180, 0x0f0f23, 0.98);
    box.setStrokeStyle(2, 0x00cc00);

    const title = this.add.text(400, 240, `Level ${this.level} Complete!`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#00cc00",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const stats = this.add.text(400, 280, `Accuracy: ${accuracy}%\n+${timeBonus + levelBonus} bonus`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#aaa",
      align: "center"
    }).setOrigin(0.5);

    const nextBtn = this.add.text(400, 340, "[ Next Level ]", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffcc00",
      fontStyle: "bold"
    }).setOrigin(0.5).setInteractive({ cursor: "pointer" });

    nextBtn.on("pointerover", () => nextBtn.setColor("#ffffff"));
    nextBtn.on("pointerout", () => nextBtn.setColor("#ffcc00"));
    nextBtn.on("pointerdown", () => {
      box.destroy();
      title.destroy();
      stats.destroy();
      nextBtn.destroy();
      this.level++;
      this.timer = Math.max(45, 60 - (this.level - 1) * 5);
      this.timerText.setText(this.timer.toString());
      this.timerText.setColor("#ff6b6b");
      this.levelText.setText(`Level ${this.level}`);
      this.initializeLevel();
    });
  }

  endGame(victory) {
    if (this.gameOver) return;
    this.gameOver = true;
    if (this.timerEvent) this.timerEvent.remove();

    const overlay = this.add.rectangle(400, 300, 800, 600, 0x050510, 0.92);

    const box = this.add.rectangle(400, 300, 280, 200, 0x0f0f23);
    box.setStrokeStyle(2, victory ? 0x00cc00 : 0xff4444);

    this.add.text(400, 230, victory ? "Victory!" : "Time's Up!", {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: victory ? "#00cc00" : "#ff4444",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(400, 275, "Final Score", {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#666"
    }).setOrigin(0.5);

    this.add.text(400, 305, this.score.toString(), {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      color: "#ffcc00",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(400, 345, `Level ${this.level} reached`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#888"
    }).setOrigin(0.5);

    const clickText = this.add.text(400, 380, "Click to continue", {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#555"
    }).setOrigin(0.5);

    this.tweens.add({
      targets: clickText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    overlay.setInteractive();
    overlay.once("pointerdown", () => {
      if (this.onGameComplete) this.onGameComplete(this.score);
    });
  }
}

export default GameScene;
