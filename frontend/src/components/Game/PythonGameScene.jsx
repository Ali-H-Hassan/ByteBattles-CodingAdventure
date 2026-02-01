import Phaser from "phaser";

class PythonGameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "PythonGameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.maxLevel = 5;
    this.timer = 60;
    this.gameOver = false;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 6;
    this.canFlip = true;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2e");
    this.createUI();
    this.initializeLevel();
  }

  createUI() {
    // Header
    this.add.rectangle(400, 22, 800, 44, 0x16213e);

    // Title with Python colors
    this.add.rectangle(15, 22, 8, 20, 0x3776ab);
    this.add.rectangle(25, 22, 8, 20, 0xffd43b);
    this.add.text(40, 22, "Python Memory", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffd43b",
      fontStyle: "bold"
    }).setOrigin(0, 0.5);

    // Level
    this.levelText = this.add.text(400, 22, `Level ${this.level}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#4fc3f7",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Pairs counter
    this.add.text(550, 15, "Pairs", {
      fontFamily: "Arial, sans-serif",
      fontSize: "9px",
      color: "#6c7086"
    });
    this.pairsText = this.add.text(550, 28, "0/6", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#81c784",
      fontStyle: "bold"
    });

    // Score
    this.add.text(630, 15, "Score", {
      fontFamily: "Arial, sans-serif",
      fontSize: "9px",
      color: "#6c7086"
    });
    this.scoreText = this.add.text(630, 28, "0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffd43b",
      fontStyle: "bold"
    });

    // Timer
    this.add.text(720, 15, "Time", {
      fontFamily: "Arial, sans-serif",
      fontSize: "9px",
      color: "#6c7086"
    });
    this.timerText = this.add.text(720, 28, "60", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ff8a65",
      fontStyle: "bold"
    });

    // Instructions
    this.add.text(400, 55, "Match Python concepts with their examples", {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#6c7086"
    }).setOrigin(0.5);

    this.startTimer();
  }

  initializeLevel() {
    this.clearLevel();

    const pairsByLevel = [
      // Level 1 - Variables
      [
        { concept: "Integer", example: "x = 42" },
        { concept: "String", example: 'name = "Hi"' },
        { concept: "Float", example: "pi = 3.14" },
        { concept: "Boolean", example: "flag = True" },
        { concept: "List", example: "arr = [1,2]" },
        { concept: "None", example: "val = None" }
      ],
      // Level 2 - Operations
      [
        { concept: "Add", example: "5 + 3" },
        { concept: "Multiply", example: "4 * 2" },
        { concept: "Divide", example: "10 / 2" },
        { concept: "Modulo", example: "7 % 3" },
        { concept: "Power", example: "2 ** 3" },
        { concept: "Floor Div", example: "7 // 2" }
      ],
      // Level 3 - Control Flow
      [
        { concept: "If", example: "if x > 0:" },
        { concept: "Else", example: "else:" },
        { concept: "Elif", example: "elif x == 0:" },
        { concept: "For Loop", example: "for i in x:" },
        { concept: "While", example: "while True:" },
        { concept: "Break", example: "break" }
      ],
      // Level 4 - Functions
      [
        { concept: "Define", example: "def func():" },
        { concept: "Return", example: "return val" },
        { concept: "Lambda", example: "lambda x: x" },
        { concept: "Args", example: "*args" },
        { concept: "Kwargs", example: "**kwargs" },
        { concept: "Default", example: "def f(x=1):" }
      ],
      // Level 5 - Advanced
      [
        { concept: "Class", example: "class Dog:" },
        { concept: "Init", example: "__init__" },
        { concept: "Self", example: "self.name" },
        { concept: "Import", example: "import os" },
        { concept: "Try", example: "try:" },
        { concept: "Except", example: "except:" }
      ]
    ];

    const pairs = pairsByLevel[this.level - 1];
    this.totalPairs = pairs.length;
    this.matchedPairs = 0;
    this.pairsText.setText(`0/${this.totalPairs}`);

    // Create card data - concepts and examples
    const cardData = [];
    pairs.forEach((pair, idx) => {
      cardData.push({ id: idx, type: "concept", text: pair.concept, pairId: idx });
      cardData.push({ id: idx, type: "example", text: pair.example, pairId: idx });
    });

    // Shuffle
    Phaser.Utils.Array.Shuffle(cardData);

    // Grid layout: 4 columns x 3 rows
    const cols = 4;
    const rows = 3;
    const cardW = 175;
    const cardH = 140;
    const startX = 112;
    const startY = 115;
    const gapX = 10;
    const gapY = 10;

    cardData.forEach((data, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const card = this.createCard(x, y, cardW, cardH, data);
      this.cards.push(card);
    });
  }

  createCard(x, y, w, h, data) {
    const container = this.add.container(x, y);

    // Card back (visible initially)
    const back = this.add.rectangle(0, 0, w, h, 0x3776ab);
    back.setStrokeStyle(2, 0x4fc3f7);

    // Python logo on back
    const logo = this.add.text(0, 0, "Py", {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      color: "#ffd43b",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Card front (hidden initially)
    const isConcept = data.type === "concept";
    const frontColor = isConcept ? 0x2e7d32 : 0x1565c0;
    const front = this.add.rectangle(0, 0, w, h, frontColor);
    front.setStrokeStyle(2, isConcept ? 0x81c784 : 0x64b5f6);
    front.setVisible(false);

    // Card label
    const label = this.add.text(0, -40, isConcept ? "CONCEPT" : "EXAMPLE", {
      fontFamily: "Arial, sans-serif",
      fontSize: "9px",
      color: "#aaaaaa"
    }).setOrigin(0.5);
    label.setVisible(false);

    // Card text
    const text = this.add.text(0, 5, data.text, {
      fontFamily: '"Courier New", monospace',
      fontSize: isConcept ? "16px" : "13px",
      color: "#ffffff",
      fontStyle: isConcept ? "bold" : "normal",
      align: "center"
    }).setOrigin(0.5);
    text.setVisible(false);

    container.add([back, logo, front, label, text]);
    container.setSize(w, h);
    container.setInteractive({ cursor: "pointer" });

    container.setData("pairId", data.pairId);
    container.setData("type", data.type);
    container.setData("flipped", false);
    container.setData("matched", false);
    container.setData("back", back);
    container.setData("logo", logo);
    container.setData("front", front);
    container.setData("label", label);
    container.setData("text", text);

    container.on("pointerdown", () => this.flipCard(container));

    container.on("pointerover", () => {
      if (!container.getData("flipped") && !container.getData("matched")) {
        back.setFillStyle(0x4a90d9);
      }
    });

    container.on("pointerout", () => {
      if (!container.getData("flipped") && !container.getData("matched")) {
        back.setFillStyle(0x3776ab);
      }
    });

    return container;
  }

  flipCard(card) {
    if (!this.canFlip || card.getData("flipped") || card.getData("matched") || this.gameOver) {
      return;
    }

    // Flip animation
    card.setData("flipped", true);
    this.flippedCards.push(card);

    const back = card.getData("back");
    const logo = card.getData("logo");
    const front = card.getData("front");
    const label = card.getData("label");
    const text = card.getData("text");

    // Flip effect
    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 100,
      onComplete: () => {
        back.setVisible(false);
        logo.setVisible(false);
        front.setVisible(true);
        label.setVisible(true);
        text.setVisible(true);

        this.tweens.add({
          targets: card,
          scaleX: 1,
          duration: 100,
          onComplete: () => {
            if (this.flippedCards.length === 2) {
              this.checkMatch();
            }
          }
        });
      }
    });
  }

  checkMatch() {
    this.canFlip = false;
    const [card1, card2] = this.flippedCards;

    const pairId1 = card1.getData("pairId");
    const pairId2 = card2.getData("pairId");
    const type1 = card1.getData("type");
    const type2 = card2.getData("type");

    // Match: same pairId but different types (concept + example)
    if (pairId1 === pairId2 && type1 !== type2) {
      this.handleMatch(card1, card2);
    } else {
      this.handleNoMatch(card1, card2);
    }
  }

  handleMatch(card1, card2) {
    card1.setData("matched", true);
    card2.setData("matched", true);

    // Success effect
    const front1 = card1.getData("front");
    const front2 = card2.getData("front");
    front1.setStrokeStyle(3, 0xffd43b);
    front2.setStrokeStyle(3, 0xffd43b);

    // Update score
    this.matchedPairs++;
    this.score += 100 + Math.floor(this.timer * 2);
    this.scoreText.setText(this.score.toString());
    this.pairsText.setText(`${this.matchedPairs}/${this.totalPairs}`);

    // Disable cards
    card1.disableInteractive();
    card2.disableInteractive();

    this.flippedCards = [];
    this.canFlip = true;

    // Check level complete
    if (this.matchedPairs >= this.totalPairs) {
      this.time.delayedCall(500, () => this.completeLevel());
    }
  }

  handleNoMatch(card1, card2) {
    // Wrong match feedback
    this.score = Math.max(0, this.score - 10);
    this.scoreText.setText(this.score.toString());

    // Shake cards
    this.tweens.add({
      targets: [card1, card2],
      x: "+=5",
      duration: 50,
      yoyo: true,
      repeat: 2
    });

    // Flip back after delay
    this.time.delayedCall(800, () => {
      [card1, card2].forEach(card => {
        if (!card.getData("matched")) {
          const back = card.getData("back");
          const logo = card.getData("logo");
          const front = card.getData("front");
          const label = card.getData("label");
          const text = card.getData("text");

          this.tweens.add({
            targets: card,
            scaleX: 0,
            duration: 100,
            onComplete: () => {
              front.setVisible(false);
              label.setVisible(false);
              text.setVisible(false);
              back.setVisible(true);
              logo.setVisible(true);

              this.tweens.add({
                targets: card,
                scaleX: 1,
                duration: 100
              });
            }
          });

          card.setData("flipped", false);
        }
      });

      this.flippedCards = [];
      this.canFlip = true;
    });
  }

  clearLevel() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];
    this.flippedCards = [];
    this.canFlip = true;
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timer--;
        this.timerText.setText(this.timer.toString());
        if (this.timer <= 10) this.timerText.setColor("#f44336");
        else if (this.timer <= 20) this.timerText.setColor("#ff8a65");
        if (this.timer <= 0) this.endGame(false);
      },
      loop: true
    });
  }

  completeLevel() {
    const timeBonus = this.timer * 5;
    const levelBonus = this.level * 75;
    this.score += timeBonus + levelBonus;
    this.scoreText.setText(this.score.toString());

    if (this.level >= this.maxLevel) {
      this.time.delayedCall(400, () => this.endGame(true));
      return;
    }

    // Level complete popup
    const box = this.add.rectangle(400, 300, 260, 150, 0x1a1a2e, 0.98);
    box.setStrokeStyle(2, 0x81c784);

    const title = this.add.text(400, 260, `Level ${this.level} Complete!`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#81c784",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const bonus = this.add.text(400, 295, `+${timeBonus + levelBonus} bonus`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#ffd43b"
    }).setOrigin(0.5);

    const nextBtn = this.add.text(400, 335, "[ Next Level ]", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#4fc3f7",
      fontStyle: "bold"
    }).setOrigin(0.5).setInteractive({ cursor: "pointer" });

    nextBtn.on("pointerover", () => nextBtn.setColor("#ffffff"));
    nextBtn.on("pointerout", () => nextBtn.setColor("#4fc3f7"));
    nextBtn.on("pointerdown", () => {
      box.destroy();
      title.destroy();
      bonus.destroy();
      nextBtn.destroy();
      this.level++;
      this.timer = Math.max(40, 60 - (this.level - 1) * 5);
      this.timerText.setText(this.timer.toString());
      this.timerText.setColor("#ff8a65");
      this.levelText.setText(`Level ${this.level}`);
      this.initializeLevel();
    });
  }

  endGame(victory) {
    if (this.gameOver) return;
    this.gameOver = true;
    if (this.timerEvent) this.timerEvent.remove();

    const overlay = this.add.rectangle(400, 300, 800, 600, 0x0d0d1a, 0.92);

    const box = this.add.rectangle(400, 300, 280, 200, 0x1a1a2e);
    box.setStrokeStyle(2, victory ? 0x81c784 : 0xf44336);

    this.add.text(400, 230, victory ? "Victory!" : "Time's Up!", {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: victory ? "#81c784" : "#f44336",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(400, 275, "Final Score", {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#6c7086"
    }).setOrigin(0.5);

    this.add.text(400, 305, this.score.toString(), {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      color: "#ffd43b",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(400, 345, `Level ${this.level} reached`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#9399b2"
    }).setOrigin(0.5);

    const clickText = this.add.text(400, 380, "Click to continue", {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#6c7086"
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

export default PythonGameScene;
