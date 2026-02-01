import Phaser from "phaser";

class CssGameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "CssGameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.maxLevel = 5;
    this.currentChallenge = 0;
    this.correctAnswers = 0;
    this.timer = 60;
    this.timerText = null;
    this.gameOver = false;
    this.selectedSlot = null;
    this.challenges = [];
    this.propertySlots = [];
    this.valueOptions = [];
    this.previewElements = [];
  }

  preload() {}

  create() {
    // Purple/pink gradient theme for CSS game
    this.cameras.main.setBackgroundColor("#1a1025");

    this.createGradientBackground();
    this.createFloatingElements();
    this.createUI();
    this.createSplitScreen();

    this.initializeChallenges();
    this.showChallenge();
    this.startTimer();
  }

  createGradientBackground() {
    const graphics = this.add.graphics();

    // Top accent bar with gradient
    graphics.fillGradientStyle(0x9945ff, 0x14f195, 0x1a1025, 0x1a1025, 1, 1, 0, 0);
    graphics.fillRect(0, 0, this.scale.width, 5);

    // Decorative grid pattern
    graphics.lineStyle(1, 0x9945ff, 0.05);
    const gridSize = 40;
    for (let x = 0; x < this.scale.width; x += gridSize) {
      graphics.lineBetween(x, 0, x, this.scale.height);
    }
    for (let y = 0; y < this.scale.height; y += gridSize) {
      graphics.lineBetween(0, y, this.scale.width, y);
    }

    // Corner glow effects
    const glowGraphics = this.add.graphics();
    glowGraphics.fillStyle(0x9945ff, 0.1);
    glowGraphics.fillCircle(0, 0, 150);
    glowGraphics.fillStyle(0x14f195, 0.1);
    glowGraphics.fillCircle(this.scale.width, this.scale.height, 150);
  }

  createFloatingElements() {
    // Floating CSS property keywords
    const keywords = ['color', 'margin', 'flex', 'grid', 'padding', 'border', 'display', 'position'];
    this.floatingKeywords = [];

    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const y = Phaser.Math.Between(80, this.scale.height - 80);
      const keyword = Phaser.Utils.Array.GetRandom(keywords);

      const text = this.add.text(x, y, keyword, {
        fontFamily: '"Fira Code", monospace',
        fontSize: '11px',
        color: '#9945ff'
      }).setAlpha(0.08);

      this.floatingKeywords.push(text);

      this.tweens.add({
        targets: text,
        y: y + Phaser.Math.Between(-25, 25),
        alpha: 0.04,
        duration: Phaser.Math.Between(4000, 7000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createUI() {
    // Header background
    const headerBg = this.add.rectangle(this.scale.width / 2, 32, this.scale.width - 30, 48, 0x252035, 0.95);
    headerBg.setStrokeStyle(1, 0x3d3456);

    // Game title with icon
    this.add.text(25, 32, '{ }', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '18px',
      color: '#9945ff',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    this.add.text(55, 32, 'CSS DEBUGGER', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    // Level indicator
    this.levelText = this.add.text(this.scale.width / 2, 32, `LEVEL ${this.level}`, {
      fontFamily: '"Fira Code", monospace',
      fontSize: '13px',
      color: '#14f195',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Score display
    this.add.text(this.scale.width - 180, 25, 'SCORE', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '9px',
      color: '#8b7fa8'
    }).setOrigin(0, 0.5);

    this.scoreValueText = this.add.text(this.scale.width - 180, 39, '0', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '16px',
      color: '#14f195',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    // Timer display
    this.add.text(this.scale.width - 80, 25, 'TIME', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '9px',
      color: '#8b7fa8'
    }).setOrigin(0, 0.5);

    this.timerText = this.add.text(this.scale.width - 80, 39, '60', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '16px',
      color: '#ff6b6b',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    // Progress dots
    this.progressDots = [];
    const dotStartX = this.scale.width / 2 - 40;
    for (let i = 0; i < 5; i++) {
      const dot = this.add.circle(dotStartX + i * 20, 50, 4, 0x3d3456);
      dot.setStrokeStyle(1, 0x9945ff, 0.5);
      this.progressDots.push(dot);
    }
  }

  createSplitScreen() {
    const splitX = this.scale.width / 2;
    const panelY = 75;
    const panelHeight = this.scale.height - 90;
    const panelWidth = (this.scale.width - 45) / 2;

    // Left panel - Visual Preview
    this.previewPanel = this.add.rectangle(
      22 + panelWidth / 2,
      panelY + panelHeight / 2,
      panelWidth,
      panelHeight,
      0x252035
    );
    this.previewPanel.setStrokeStyle(1, 0x3d3456);

    // Preview panel header
    const previewHeaderBg = this.add.rectangle(
      22 + panelWidth / 2,
      panelY + 18,
      panelWidth,
      36,
      0x1e1a2a
    );

    this.add.text(35, panelY + 18, 'PREVIEW', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '11px',
      color: '#9945ff',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    // Browser dots decoration
    const dotsX = panelWidth - 10;
    this.add.circle(dotsX, panelY + 18, 5, 0xff5f56);
    this.add.circle(dotsX + 15, panelY + 18, 5, 0xffbd2e);
    this.add.circle(dotsX + 30, panelY + 18, 5, 0x27ca40);

    // Preview content area
    this.previewArea = {
      x: 22,
      y: panelY + 40,
      width: panelWidth,
      height: panelHeight - 45,
      centerX: 22 + panelWidth / 2,
      centerY: panelY + 40 + (panelHeight - 45) / 2
    };

    // Right panel - Code Editor
    this.codePanel = this.add.rectangle(
      splitX + 11 + panelWidth / 2,
      panelY + panelHeight / 2,
      panelWidth,
      panelHeight,
      0x1e1a2a
    );
    this.codePanel.setStrokeStyle(1, 0x3d3456);

    // Code panel header
    const codeHeaderBg = this.add.rectangle(
      splitX + 11 + panelWidth / 2,
      panelY + 18,
      panelWidth,
      36,
      0x252035
    );

    // File tab
    this.add.rectangle(splitX + 70, panelY + 18, 100, 28, 0x1e1a2a)
      .setStrokeStyle(1, 0x3d3456, 0.5);
    this.add.text(splitX + 70, panelY + 18, 'style.css', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '11px',
      color: '#e6edf3'
    }).setOrigin(0.5);

    // Code area coordinates
    this.codeArea = {
      x: splitX + 25,
      y: panelY + 50,
      width: panelWidth - 30,
      height: panelHeight - 60
    };

    // Line numbers
    for (let i = 1; i <= 12; i++) {
      this.add.text(splitX + 25, panelY + 50 + (i - 1) * 22, i.toString(), {
        fontFamily: '"Fira Code", monospace',
        fontSize: '11px',
        color: '#484f58'
      }).setOrigin(0, 0);
    }
  }

  initializeChallenges() {
    const allChallenges = [
      // Level 1: Basic Colors & Backgrounds
      {
        level: 1,
        title: "Button Styling",
        description: "Style the button with correct background",
        previewType: "button",
        targetStyles: { background: "#9945ff", color: "#ffffff" },
        code: [
          ".button {",
          "  background: ____;",
          "  color: #ffffff;",
          "  padding: 12px 24px;",
          "}"
        ],
        slots: [{ line: 1, property: "background", correct: "#9945ff" }],
        options: ["#9945ff", "#ff0000", "transparent", "#000000"]
      },
      {
        level: 1,
        title: "Text Color",
        description: "Set the heading color to green",
        previewType: "heading",
        targetStyles: { color: "#14f195" },
        code: [
          "h1 {",
          "  color: ____;",
          "  font-size: 24px;",
          "}"
        ],
        slots: [{ line: 1, property: "color", correct: "#14f195" }],
        options: ["#14f195", "#9945ff", "#ffffff", "#ff6b6b"]
      },
      {
        level: 1,
        title: "Background Color",
        description: "Set the card background to dark",
        previewType: "card",
        targetStyles: { background: "#252035" },
        code: [
          ".card {",
          "  background: ____;",
          "  border-radius: 8px;",
          "  padding: 20px;",
          "}"
        ],
        slots: [{ line: 1, property: "background", correct: "#252035" }],
        options: ["#252035", "#ffffff", "#14f195", "none"]
      },
      {
        level: 1,
        title: "Border Color",
        description: "Add a purple border to the box",
        previewType: "box",
        targetStyles: { border: "2px solid #9945ff" },
        code: [
          ".box {",
          "  border: 2px solid ____;",
          "  padding: 16px;",
          "}"
        ],
        slots: [{ line: 1, property: "border-color", correct: "#9945ff" }],
        options: ["#9945ff", "#ffffff", "transparent", "#14f195"]
      },
      {
        level: 1,
        title: "Text Background",
        description: "Highlight the text with yellow background",
        previewType: "highlight",
        targetStyles: { background: "#ffbd2e", color: "#000000" },
        code: [
          ".highlight {",
          "  background: ____;",
          "  color: #000000;",
          "  padding: 2px 6px;",
          "}"
        ],
        slots: [{ line: 1, property: "background", correct: "#ffbd2e" }],
        options: ["#ffbd2e", "#9945ff", "#ff5f56", "#14f195"]
      },

      // Level 2: Layout & Spacing
      {
        level: 2,
        title: "Flexbox Layout",
        description: "Center items using flexbox",
        previewType: "flex-center",
        targetStyles: { display: "flex", justifyContent: "center" },
        code: [
          ".container {",
          "  display: flex;",
          "  justify-content: ____;",
          "  align-items: center;",
          "}"
        ],
        slots: [{ line: 2, property: "justify-content", correct: "center" }],
        options: ["center", "flex-start", "flex-end", "space-between"]
      },
      {
        level: 2,
        title: "Spacing Items",
        description: "Add equal spacing between items",
        previewType: "flex-between",
        targetStyles: { display: "flex", justifyContent: "space-between" },
        code: [
          ".nav {",
          "  display: flex;",
          "  justify-content: ____;",
          "}"
        ],
        slots: [{ line: 2, property: "justify-content", correct: "space-between" }],
        options: ["space-between", "center", "flex-start", "space-around"]
      },
      {
        level: 2,
        title: "Column Layout",
        description: "Stack items vertically",
        previewType: "flex-column",
        targetStyles: { display: "flex", flexDirection: "column" },
        code: [
          ".stack {",
          "  display: flex;",
          "  flex-direction: ____;",
          "  gap: 10px;",
          "}"
        ],
        slots: [{ line: 2, property: "flex-direction", correct: "column" }],
        options: ["column", "row", "row-reverse", "column-reverse"]
      },
      {
        level: 2,
        title: "Padding",
        description: "Add padding to the container",
        previewType: "padding-box",
        targetStyles: { padding: "20px" },
        code: [
          ".container {",
          "  padding: ____;",
          "  background: #252035;",
          "}"
        ],
        slots: [{ line: 1, property: "padding", correct: "20px" }],
        options: ["20px", "0px", "5px", "50px"]
      },
      {
        level: 2,
        title: "Margin Auto",
        description: "Center the block horizontally",
        previewType: "margin-auto",
        targetStyles: { margin: "0 auto" },
        code: [
          ".centered {",
          "  width: 200px;",
          "  margin: ____;",
          "}"
        ],
        slots: [{ line: 2, property: "margin", correct: "0 auto" }],
        options: ["0 auto", "0", "auto", "10px"]
      },

      // Level 3: Typography
      {
        level: 3,
        title: "Bold Text",
        description: "Make the text bold",
        previewType: "bold-text",
        targetStyles: { fontWeight: "bold" },
        code: [
          ".title {",
          "  font-weight: ____;",
          "  font-size: 20px;",
          "}"
        ],
        slots: [{ line: 1, property: "font-weight", correct: "bold" }],
        options: ["bold", "normal", "lighter", "100"]
      },
      {
        level: 3,
        title: "Text Transform",
        description: "Make text uppercase",
        previewType: "uppercase",
        targetStyles: { textTransform: "uppercase" },
        code: [
          ".label {",
          "  text-transform: ____;",
          "  letter-spacing: 2px;",
          "}"
        ],
        slots: [{ line: 1, property: "text-transform", correct: "uppercase" }],
        options: ["uppercase", "lowercase", "capitalize", "none"]
      },
      {
        level: 3,
        title: "Text Alignment",
        description: "Center the paragraph text",
        previewType: "text-center",
        targetStyles: { textAlign: "center" },
        code: [
          "p {",
          "  text-align: ____;",
          "  line-height: 1.6;",
          "}"
        ],
        slots: [{ line: 1, property: "text-align", correct: "center" }],
        options: ["center", "left", "right", "justify"]
      },
      {
        level: 3,
        title: "Line Height",
        description: "Improve text readability",
        previewType: "line-height",
        targetStyles: { lineHeight: "1.8" },
        code: [
          ".paragraph {",
          "  line-height: ____;",
          "  font-size: 14px;",
          "}"
        ],
        slots: [{ line: 1, property: "line-height", correct: "1.8" }],
        options: ["1.8", "1", "0.5", "3"]
      },
      {
        level: 3,
        title: "Font Size",
        description: "Set appropriate heading size",
        previewType: "font-size",
        targetStyles: { fontSize: "32px" },
        code: [
          "h1 {",
          "  font-size: ____;",
          "  margin-bottom: 16px;",
          "}"
        ],
        slots: [{ line: 1, property: "font-size", correct: "32px" }],
        options: ["32px", "12px", "16px", "8px"]
      },

      // Level 4: Visual Effects
      {
        level: 4,
        title: "Border Radius",
        description: "Round the corners",
        previewType: "rounded",
        targetStyles: { borderRadius: "12px" },
        code: [
          ".card {",
          "  border-radius: ____;",
          "  overflow: hidden;",
          "}"
        ],
        slots: [{ line: 1, property: "border-radius", correct: "12px" }],
        options: ["12px", "0px", "50%", "2px"]
      },
      {
        level: 4,
        title: "Box Shadow",
        description: "Add depth with shadow",
        previewType: "shadow",
        targetStyles: { boxShadow: "0 4px 12px rgba(0,0,0,0.3)" },
        code: [
          ".elevated {",
          "  box-shadow: ____;",
          "  background: #252035;",
          "}"
        ],
        slots: [{ line: 1, property: "box-shadow", correct: "0 4px 12px rgba(0,0,0,0.3)" }],
        options: ["0 4px 12px rgba(0,0,0,0.3)", "none", "inset 0 0 5px", "0 0 0 1px #fff"]
      },
      {
        level: 4,
        title: "Opacity",
        description: "Make element semi-transparent",
        previewType: "opacity",
        targetStyles: { opacity: "0.6" },
        code: [
          ".overlay {",
          "  opacity: ____;",
          "  background: #000;",
          "}"
        ],
        slots: [{ line: 1, property: "opacity", correct: "0.6" }],
        options: ["0.6", "1", "0", "0.1"]
      },
      {
        level: 4,
        title: "Circle Shape",
        description: "Make a perfect circle",
        previewType: "circle",
        targetStyles: { borderRadius: "50%" },
        code: [
          ".avatar {",
          "  width: 60px;",
          "  height: 60px;",
          "  border-radius: ____;",
          "}"
        ],
        slots: [{ line: 3, property: "border-radius", correct: "50%" }],
        options: ["50%", "10px", "100px", "25%"]
      },
      {
        level: 4,
        title: "Gradient Background",
        description: "Apply gradient to button",
        previewType: "gradient",
        targetStyles: { background: "linear-gradient" },
        code: [
          ".btn {",
          "  background: ____;",
          "  color: white;",
          "}"
        ],
        slots: [{ line: 1, property: "background", correct: "linear-gradient(90deg, #9945ff, #14f195)" }],
        options: ["linear-gradient(90deg, #9945ff, #14f195)", "#9945ff", "radial-gradient(#fff, #000)", "#14f195"]
      },

      // Level 5: Advanced Layout
      {
        level: 5,
        title: "Position Fixed",
        description: "Fix element to viewport",
        previewType: "fixed",
        targetStyles: { position: "fixed" },
        code: [
          ".navbar {",
          "  position: ____;",
          "  top: 0;",
          "  width: 100%;",
          "}"
        ],
        slots: [{ line: 1, property: "position", correct: "fixed" }],
        options: ["fixed", "relative", "absolute", "static"]
      },
      {
        level: 5,
        title: "Absolute Position",
        description: "Position element precisely",
        previewType: "absolute",
        targetStyles: { position: "absolute" },
        code: [
          ".badge {",
          "  position: ____;",
          "  top: -5px;",
          "  right: -5px;",
          "}"
        ],
        slots: [{ line: 1, property: "position", correct: "absolute" }],
        options: ["absolute", "relative", "fixed", "sticky"]
      },
      {
        level: 5,
        title: "Z-Index",
        description: "Bring element to front",
        previewType: "z-index",
        targetStyles: { zIndex: "100" },
        code: [
          ".modal {",
          "  position: fixed;",
          "  z-index: ____;",
          "}"
        ],
        slots: [{ line: 2, property: "z-index", correct: "100" }],
        options: ["100", "0", "-1", "1"]
      },
      {
        level: 5,
        title: "Overflow Hidden",
        description: "Hide overflowing content",
        previewType: "overflow",
        targetStyles: { overflow: "hidden" },
        code: [
          ".container {",
          "  overflow: ____;",
          "  max-height: 100px;",
          "}"
        ],
        slots: [{ line: 1, property: "overflow", correct: "hidden" }],
        options: ["hidden", "visible", "scroll", "auto"]
      },
      {
        level: 5,
        title: "Grid Layout",
        description: "Create a grid container",
        previewType: "grid",
        targetStyles: { display: "grid" },
        code: [
          ".gallery {",
          "  display: ____;",
          "  grid-template-columns:",
          "    repeat(3, 1fr);",
          "}"
        ],
        slots: [{ line: 1, property: "display", correct: "grid" }],
        options: ["grid", "flex", "block", "inline"]
      }
    ];

    // Filter challenges for current level and shuffle
    const levelChallenges = allChallenges.filter(c => c.level === this.level);
    this.challenges = Phaser.Utils.Array.Shuffle([...levelChallenges]).slice(0, 5);
    this.currentChallenge = 0;
  }

  showChallenge() {
    // Clear previous challenge elements
    this.clearChallengeElements();

    if (this.currentChallenge >= this.challenges.length) {
      this.completeLevel();
      return;
    }

    const challenge = this.challenges[this.currentChallenge];

    // Update progress dots
    this.progressDots.forEach((dot, i) => {
      if (i < this.currentChallenge) {
        dot.setFillStyle(0x14f195);
      } else if (i === this.currentChallenge) {
        dot.setFillStyle(0x9945ff);
        dot.setStrokeStyle(2, 0x9945ff);
      }
    });

    // Show challenge title
    this.challengeTitle = this.add.text(this.previewArea.centerX, this.previewArea.y + 15, challenge.title, {
      fontFamily: '"Fira Code", monospace',
      fontSize: '14px',
      color: '#9945ff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.challengeDesc = this.add.text(this.previewArea.centerX, this.previewArea.y + 35, challenge.description, {
      fontFamily: '"Fira Code", monospace',
      fontSize: '11px',
      color: '#8b7fa8'
    }).setOrigin(0.5);

    // Create visual preview
    this.createPreview(challenge);

    // Create code display with slots
    this.createCodeDisplay(challenge);

    // Create draggable options
    this.createOptions(challenge);
  }

  clearChallengeElements() {
    if (this.challengeTitle) this.challengeTitle.destroy();
    if (this.challengeDesc) this.challengeDesc.destroy();

    this.previewElements.forEach(el => {
      if (el && el.destroy) el.destroy();
    });
    this.previewElements = [];

    this.propertySlots.forEach(slot => {
      if (slot.container) slot.container.destroy();
    });
    this.propertySlots = [];

    this.valueOptions.forEach(opt => {
      if (opt.container) opt.container.destroy();
    });
    this.valueOptions = [];

    if (this.codeLines) {
      this.codeLines.forEach(line => line.destroy());
    }
    this.codeLines = [];
  }

  createPreview(challenge) {
    const centerX = this.previewArea.centerX;
    const centerY = this.previewArea.centerY + 20;

    switch (challenge.previewType) {
      case "button":
        const btn = this.add.rectangle(centerX, centerY, 120, 40, 0x9945ff);
        btn.setStrokeStyle(0);
        const btnText = this.add.text(centerX, centerY, "Click Me", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '13px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.previewElements.push(btn, btnText);
        break;

      case "heading":
        const heading = this.add.text(centerX, centerY, "Hello World", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '22px',
          color: '#14f195',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        this.previewElements.push(heading);
        break;

      case "card":
        const card = this.add.rectangle(centerX, centerY, 160, 100, 0x252035);
        card.setStrokeStyle(1, 0x3d3456);
        const cardTitle = this.add.text(centerX, centerY - 20, "Card Title", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '13px',
          color: '#ffffff'
        }).setOrigin(0.5);
        const cardDesc = this.add.text(centerX, centerY + 10, "Description text", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '10px',
          color: '#8b7fa8'
        }).setOrigin(0.5);
        this.previewElements.push(card, cardTitle, cardDesc);
        break;

      case "box":
        const box = this.add.rectangle(centerX, centerY, 100, 100, 0x1e1a2a);
        box.setStrokeStyle(2, 0x9945ff);
        this.previewElements.push(box);
        break;

      case "highlight":
        const hlBg = this.add.rectangle(centerX, centerY, 120, 28, 0xffbd2e);
        const hlText = this.add.text(centerX, centerY, "Highlighted", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '12px',
          color: '#000000'
        }).setOrigin(0.5);
        this.previewElements.push(hlBg, hlText);
        break;

      case "flex-center":
        const fcContainer = this.add.rectangle(centerX, centerY, 180, 60, 0x1e1a2a);
        fcContainer.setStrokeStyle(1, 0x3d3456);
        const fcItem = this.add.rectangle(centerX, centerY, 50, 30, 0x9945ff);
        this.previewElements.push(fcContainer, fcItem);
        break;

      case "flex-between":
        const fbContainer = this.add.rectangle(centerX, centerY, 180, 50, 0x1e1a2a);
        fbContainer.setStrokeStyle(1, 0x3d3456);
        const fbItem1 = this.add.rectangle(centerX - 60, centerY, 30, 25, 0x9945ff);
        const fbItem2 = this.add.rectangle(centerX, centerY, 30, 25, 0x14f195);
        const fbItem3 = this.add.rectangle(centerX + 60, centerY, 30, 25, 0x9945ff);
        this.previewElements.push(fbContainer, fbItem1, fbItem2, fbItem3);
        break;

      case "flex-column":
        const colContainer = this.add.rectangle(centerX, centerY, 80, 120, 0x1e1a2a);
        colContainer.setStrokeStyle(1, 0x3d3456);
        for (let i = 0; i < 3; i++) {
          const item = this.add.rectangle(centerX, centerY - 40 + i * 40, 50, 25, 0x9945ff);
          this.previewElements.push(item);
        }
        this.previewElements.push(colContainer);
        break;

      case "padding-box":
        const outerBox = this.add.rectangle(centerX, centerY, 140, 80, 0x252035);
        outerBox.setStrokeStyle(1, 0x9945ff);
        const innerBox = this.add.rectangle(centerX, centerY, 100, 40, 0x9945ff, 0.3);
        const padText = this.add.text(centerX, centerY, "Content", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '11px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.previewElements.push(outerBox, innerBox, padText);
        break;

      case "margin-auto":
        const maParent = this.add.rectangle(centerX, centerY, 180, 80, 0x1e1a2a);
        maParent.setStrokeStyle(1, 0x3d3456);
        const maChild = this.add.rectangle(centerX, centerY, 80, 40, 0x9945ff);
        this.previewElements.push(maParent, maChild);
        break;

      case "bold-text":
        const boldText = this.add.text(centerX, centerY, "Bold Title", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '18px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        this.previewElements.push(boldText);
        break;

      case "uppercase":
        const upperText = this.add.text(centerX, centerY, "UPPERCASE", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '16px',
          color: '#9945ff',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        this.previewElements.push(upperText);
        break;

      case "text-center":
        const lines = ["Centered text", "Second line", "Third line"];
        lines.forEach((line, i) => {
          const text = this.add.text(centerX, centerY - 20 + i * 18, line, {
            fontFamily: '"Fira Code", monospace',
            fontSize: '12px',
            color: '#e6edf3'
          }).setOrigin(0.5);
          this.previewElements.push(text);
        });
        break;

      case "line-height":
        const lhText = this.add.text(centerX, centerY, "Line one\nLine two\nLine three", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '12px',
          color: '#e6edf3',
          lineSpacing: 10,
          align: 'center'
        }).setOrigin(0.5);
        this.previewElements.push(lhText);
        break;

      case "font-size":
        const fsText = this.add.text(centerX, centerY, "Big Title", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '28px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        this.previewElements.push(fsText);
        break;

      case "rounded":
        const roundedCard = this.add.rectangle(centerX, centerY, 120, 70, 0x9945ff);
        roundedCard.setStrokeStyle(0);
        // Note: Phaser doesn't support border-radius visually, but the concept is shown
        this.previewElements.push(roundedCard);
        break;

      case "shadow":
        // Simulate shadow with multiple rectangles
        const shadowLayer = this.add.rectangle(centerX + 4, centerY + 4, 120, 70, 0x000000, 0.3);
        const shadowBox = this.add.rectangle(centerX, centerY, 120, 70, 0x252035);
        shadowBox.setStrokeStyle(1, 0x3d3456);
        this.previewElements.push(shadowLayer, shadowBox);
        break;

      case "opacity":
        const opacityBg = this.add.rectangle(centerX, centerY, 140, 80, 0x9945ff, 0.6);
        const opacityText = this.add.text(centerX, centerY, "60% Opacity", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '12px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.previewElements.push(opacityBg, opacityText);
        break;

      case "circle":
        const circle = this.add.circle(centerX, centerY, 35, 0x9945ff);
        this.previewElements.push(circle);
        break;

      case "gradient":
        // Simulate gradient with multiple colors
        const gradLeft = this.add.rectangle(centerX - 40, centerY, 60, 36, 0x9945ff);
        const gradRight = this.add.rectangle(centerX + 40, centerY, 60, 36, 0x14f195);
        const gradMid = this.add.rectangle(centerX, centerY, 40, 36, 0x5a7ac7);
        const gradText = this.add.text(centerX, centerY, "Gradient", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '12px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.previewElements.push(gradLeft, gradMid, gradRight, gradText);
        break;

      case "fixed":
      case "absolute":
      case "sticky":
        const posContainer = this.add.rectangle(centerX, centerY, 160, 100, 0x1e1a2a);
        posContainer.setStrokeStyle(1, 0x3d3456);
        const posElement = this.add.rectangle(centerX, centerY - 30, 140, 25, 0x9945ff);
        const posLabel = this.add.text(centerX, centerY - 30, challenge.previewType, {
          fontFamily: '"Fira Code", monospace',
          fontSize: '10px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.previewElements.push(posContainer, posElement, posLabel);
        break;

      case "z-index":
        const zBox1 = this.add.rectangle(centerX - 20, centerY, 80, 60, 0x3d3456);
        const zBox2 = this.add.rectangle(centerX + 20, centerY, 80, 60, 0x9945ff);
        const zLabel = this.add.text(centerX + 20, centerY, "z:100", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '10px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.previewElements.push(zBox1, zBox2, zLabel);
        break;

      case "overflow":
        const overflowBox = this.add.rectangle(centerX, centerY, 120, 60, 0x1e1a2a);
        overflowBox.setStrokeStyle(1, 0x9945ff);
        const overflowText = this.add.text(centerX, centerY, "Hidden\nContent", {
          fontFamily: '"Fira Code", monospace',
          fontSize: '11px',
          color: '#ffffff',
          align: 'center'
        }).setOrigin(0.5);
        this.previewElements.push(overflowBox, overflowText);
        break;

      case "grid":
        const gridContainer = this.add.rectangle(centerX, centerY, 140, 90, 0x1e1a2a);
        gridContainer.setStrokeStyle(1, 0x3d3456);
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            const gridItem = this.add.rectangle(
              centerX - 45 + col * 45,
              centerY - 20 + row * 40,
              35,
              30,
              0x9945ff
            );
            this.previewElements.push(gridItem);
          }
        }
        this.previewElements.push(gridContainer);
        break;

      default:
        const defaultBox = this.add.rectangle(centerX, centerY, 100, 60, 0x9945ff);
        this.previewElements.push(defaultBox);
    }
  }

  createCodeDisplay(challenge) {
    const startX = this.codeArea.x + 30;
    const startY = this.codeArea.y;
    const lineHeight = 22;

    this.codeLines = [];

    challenge.code.forEach((line, index) => {
      const y = startY + index * lineHeight;

      if (line.includes("____")) {
        // Line with slot
        const parts = line.split("____");

        // Before slot
        const beforeText = this.add.text(startX, y, parts[0], {
          fontFamily: '"Fira Code", monospace',
          fontSize: '12px',
          color: '#79c0ff'
        });
        this.codeLines.push(beforeText);

        // Create slot
        const slotX = startX + beforeText.width;
        const slot = this.createSlot(slotX, y, challenge.slots[0]);
        this.propertySlots.push(slot);

        // After slot
        if (parts[1]) {
          const afterText = this.add.text(slotX + 130, y, parts[1], {
            fontFamily: '"Fira Code", monospace',
            fontSize: '12px',
            color: '#79c0ff'
          });
          this.codeLines.push(afterText);
        }
      } else {
        // Regular line
        let color = '#e6edf3';
        if (line.includes('{') || line.includes('}')) color = '#ffa657';
        if (line.startsWith('  ') && line.includes(':')) {
          // Property line - color property name differently
          const colonIndex = line.indexOf(':');
          const propName = this.add.text(startX, y, line.substring(0, colonIndex), {
            fontFamily: '"Fira Code", monospace',
            fontSize: '12px',
            color: '#79c0ff'
          });
          const propValue = this.add.text(startX + propName.width, y, line.substring(colonIndex), {
            fontFamily: '"Fira Code", monospace',
            fontSize: '12px',
            color: '#a5d6ff'
          });
          this.codeLines.push(propName, propValue);
        } else {
          const text = this.add.text(startX, y, line, {
            fontFamily: '"Fira Code", monospace',
            fontSize: '12px',
            color: color
          });
          this.codeLines.push(text);
        }
      }
    });
  }

  createSlot(x, y, slotData) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(60, 8, 120, 22, 0x3d3456, 0.8);
    bg.setStrokeStyle(2, 0x9945ff, 0.8);

    const placeholder = this.add.text(60, 8, "Select value...", {
      fontFamily: '"Fira Code", monospace',
      fontSize: '11px',
      color: '#8b7fa8'
    }).setOrigin(0.5);

    container.add([bg, placeholder]);

    return {
      container,
      bg,
      placeholder,
      data: slotData,
      filled: false,
      value: null
    };
  }

  createOptions(challenge) {
    const shuffledOptions = Phaser.Utils.Array.Shuffle([...challenge.options]);
    const startY = this.codeArea.y + challenge.code.length * 22 + 30;
    const optionWidth = 140;
    const optionHeight = 32;
    const gap = 10;
    const optionsPerRow = 2;

    shuffledOptions.forEach((option, index) => {
      const row = Math.floor(index / optionsPerRow);
      const col = index % optionsPerRow;

      const x = this.codeArea.x + 40 + col * (optionWidth + gap) + optionWidth / 2;
      const y = startY + row * (optionHeight + gap);

      const container = this.add.container(x, y);

      const bg = this.add.rectangle(0, 0, optionWidth, optionHeight, 0x252035);
      bg.setStrokeStyle(1, 0x3d3456);

      // Truncate long options
      let displayText = option;
      if (option.length > 18) {
        displayText = option.substring(0, 15) + "...";
      }

      const text = this.add.text(0, 0, displayText, {
        fontFamily: '"Fira Code", monospace',
        fontSize: '10px',
        color: '#e6edf3'
      }).setOrigin(0.5);

      container.add([bg, text]);
      container.setSize(optionWidth, optionHeight);
      container.setInteractive({ cursor: 'pointer' });

      container.setData('value', option);
      container.setData('isCorrect', option === challenge.slots[0].correct);
      container.setData('bg', bg);

      // Hover effects
      container.on('pointerover', () => {
        bg.setFillStyle(0x3d3456);
        bg.setStrokeStyle(2, 0x9945ff);
      });

      container.on('pointerout', () => {
        bg.setFillStyle(0x252035);
        bg.setStrokeStyle(1, 0x3d3456);
      });

      container.on('pointerdown', () => {
        this.handleOptionSelect(container);
      });

      // Entrance animation
      container.setAlpha(0);
      container.y = y + 20;
      this.tweens.add({
        targets: container,
        alpha: 1,
        y: y,
        duration: 200,
        delay: index * 50,
        ease: 'Power2'
      });

      this.valueOptions.push({ container, bg, text });
    });
  }

  handleOptionSelect(optionContainer) {
    if (this.gameOver) return;

    const isCorrect = optionContainer.getData('isCorrect');
    const value = optionContainer.getData('value');
    const slot = this.propertySlots[0];

    // Disable all options
    this.valueOptions.forEach(opt => {
      opt.container.disableInteractive();
    });

    // Fill the slot
    slot.placeholder.setText(value.length > 18 ? value.substring(0, 15) + "..." : value);
    slot.placeholder.setColor('#e6edf3');

    if (isCorrect) {
      // Correct answer
      slot.bg.setFillStyle(0x238636, 0.8);
      slot.bg.setStrokeStyle(2, 0x2ea043);
      optionContainer.getData('bg').setFillStyle(0x238636);

      this.correctAnswers++;
      const points = 100 + Math.floor(this.timer);
      this.updateScore(points);

      // Success animation
      this.showSuccessEffect();

      this.tweens.add({
        targets: optionContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        yoyo: true
      });
    } else {
      // Wrong answer
      slot.bg.setFillStyle(0x8b0000, 0.8);
      slot.bg.setStrokeStyle(2, 0xda3633);
      optionContainer.getData('bg').setFillStyle(0x8b0000);

      // Show correct answer
      this.valueOptions.forEach(opt => {
        if (opt.container.getData('isCorrect')) {
          opt.bg.setFillStyle(0x238636);
          opt.bg.setStrokeStyle(2, 0x2ea043);
        }
      });

      // Shake animation
      this.tweens.add({
        targets: optionContainer,
        x: optionContainer.x - 8,
        duration: 50,
        yoyo: true,
        repeat: 3
      });

      this.updateScore(-20);
    }

    // Next challenge
    this.time.delayedCall(1500, () => {
      this.currentChallenge++;
      this.showChallenge();
    });
  }

  showSuccessEffect() {
    const centerX = this.previewArea.centerX;
    const centerY = this.previewArea.centerY;

    // Create burst effect
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const particle = this.add.circle(centerX, centerY, 5, 0x14f195);

      this.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * 80,
        y: centerY + Math.sin(angle) * 60,
        alpha: 0,
        scale: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }

    // Flash the preview panel
    this.tweens.add({
      targets: this.previewPanel,
      fillAlpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1
    });
  }

  updateScore(points) {
    this.score += points;
    if (this.score < 0) this.score = 0;

    this.scoreValueText.setText(this.score.toString());

    const color = points > 0 ? '#14f195' : '#ff6b6b';
    this.scoreValueText.setColor(color);

    this.tweens.add({
      targets: this.scoreValueText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
      onComplete: () => {
        this.scoreValueText.setColor('#14f195');
      }
    });
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timer--;
        this.timerText.setText(this.timer.toString());

        if (this.timer <= 15) {
          this.timerText.setColor('#ff6b6b');
          this.tweens.add({
            targets: this.timerText,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 100,
            yoyo: true
          });
        } else if (this.timer <= 30) {
          this.timerText.setColor('#ffbd2e');
        }

        if (this.timer <= 0) {
          this.endGame(false);
        }
      },
      loop: true
    });
  }

  completeLevel() {
    if (this.timerEvent) this.timerEvent.remove();

    const accuracy = Math.round((this.correctAnswers / this.challenges.length) * 100);
    const timeBonus = this.timer * 5;
    const levelBonus = this.level * 75;

    this.updateScore(timeBonus + levelBonus);

    // Level complete overlay
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x1a1025,
      0.95
    );

    const container = this.add.container(this.scale.width / 2, this.scale.height / 2);

    // Success badge
    const badge = this.add.circle(0, -70, 40, 0x238636);
    const checkMark = this.add.text(0, -70, '✓', {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const title = this.add.text(0, -10, `LEVEL ${this.level} COMPLETE`, {
      fontFamily: '"Fira Code", monospace',
      fontSize: '22px',
      color: '#14f195',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const stats = this.add.text(0, 40, [
      `Accuracy: ${accuracy}%`,
      `Time Bonus: +${timeBonus}`,
      `Level Bonus: +${levelBonus}`
    ].join('\n'), {
      fontFamily: '"Fira Code", monospace',
      fontSize: '13px',
      color: '#8b7fa8',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    container.add([badge, checkMark, title, stats]);

    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    if (this.level >= this.maxLevel) {
      this.time.delayedCall(2500, () => {
        container.destroy();
        overlay.destroy();
        this.endGame(true);
      });
    } else {
      this.time.delayedCall(1000, () => {
        const continueBtn = this.add.container(0, 110);

        const btnBg = this.add.rectangle(0, 0, 160, 40, 0x9945ff);
        btnBg.setStrokeStyle(2, 0x14f195);

        const btnText = this.add.text(0, 0, 'NEXT LEVEL →', {
          fontFamily: '"Fira Code", monospace',
          fontSize: '13px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        continueBtn.add([btnBg, btnText]);
        continueBtn.setSize(160, 40);
        continueBtn.setInteractive({ cursor: 'pointer' });
        container.add(continueBtn);

        continueBtn.on('pointerover', () => {
          btnBg.setFillStyle(0x14f195);
        });

        continueBtn.on('pointerout', () => {
          btnBg.setFillStyle(0x9945ff);
        });

        continueBtn.on('pointerdown', () => {
          container.destroy();
          overlay.destroy();
          this.startNextLevel();
        });

        continueBtn.setAlpha(0);
        this.tweens.add({
          targets: continueBtn,
          alpha: 1,
          duration: 300
        });
      });
    }
  }

  startNextLevel() {
    this.level++;
    this.timer = Math.max(40, 60 - (this.level - 1) * 5);
    this.currentChallenge = 0;
    this.correctAnswers = 0;

    // Update UI
    this.levelText.setText(`LEVEL ${this.level}`);
    this.timerText.setText(this.timer.toString());
    this.timerText.setColor('#ff6b6b');

    // Reset progress dots
    this.progressDots.forEach(dot => {
      dot.setFillStyle(0x3d3456);
      dot.setStrokeStyle(1, 0x9945ff, 0.5);
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

    // Game over overlay
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x1a1025,
      0.95
    );

    const container = this.add.container(this.scale.width / 2, this.scale.height / 2);

    // Result icon
    const iconColor = victory ? 0x238636 : 0x8b0000;
    const iconBg = this.add.circle(0, -75, 45, iconColor);
    const icon = this.add.text(0, -75, victory ? '★' : '✗', {
      fontSize: '42px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const title = this.add.text(0, -10, victory ? 'CSS MASTER!' : 'TIME\'S UP!', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '24px',
      color: victory ? '#14f195' : '#ff6b6b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const scoreLabel = this.add.text(0, 30, 'FINAL SCORE', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '11px',
      color: '#8b7fa8'
    }).setOrigin(0.5);

    const finalScore = this.add.text(0, 60, this.score.toString(), {
      fontFamily: '"Fira Code", monospace',
      fontSize: '34px',
      color: '#14f195',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const levelInfo = this.add.text(0, 100, `Level ${this.level} reached`, {
      fontFamily: '"Fira Code", monospace',
      fontSize: '13px',
      color: '#8b7fa8'
    }).setOrigin(0.5);

    container.add([iconBg, icon, title, scoreLabel, finalScore, levelInfo]);

    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    const clickText = this.add.text(this.scale.width / 2, this.scale.height - 50, 'Click anywhere to continue', {
      fontFamily: '"Fira Code", monospace',
      fontSize: '11px',
      color: '#8b7fa8'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: clickText,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    overlay.setInteractive();
    overlay.once('pointerdown', () => {
      if (this.onGameComplete) {
        this.onGameComplete(this.score);
      }
    });
  }
}

export default CssGameScene;
