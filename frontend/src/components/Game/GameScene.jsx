import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "GameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.matchedPairs = 0;
    this.totalPairs = 0;
    this.openingTags = [];
    this.closingTags = [];
    this.selectedTag = null;
    this.timer = 60; // 60 seconds per level
    this.timerText = null;
    this.gameOver = false;
  }

  preload() {}

  create() {
    const { backgroundColor, titleText } = this.courseData.gameSceneConfig || {};

    this.cameras.main.setBackgroundColor(backgroundColor || "#1a1a2e");
    
    // Create gradient background effect
    this.createBackground();
    
    this.createTitle(titleText || "HTML Tag Matcher");
    this.createScoreText();
    this.createTimerText();
    this.createInstructions();
    
    // Initialize game with HTML tags
    this.initializeGame();
    
    // Start timer
    this.startTimer();
  }

  createBackground() {
    // Create animated background particles
    this.particles = [];
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const particle = this.add.circle(x, y, 2, 0x00c354, 0.3);
      this.particles.push(particle);
      
      this.tweens.add({
        targets: particle,
        y: y + Phaser.Math.Between(-50, 50),
        x: x + Phaser.Math.Between(-50, 50),
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }
  }

  createTitle(titleText) {
    this.add
      .text(this.scale.width / 2, 30, titleText, {
        font: "bold 32px Arial",
        fill: "#00c354",
        stroke: "#ffffff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  createInstructions() {
    this.add
      .text(this.scale.width / 2, 70, "Match opening tags with their closing tags!", {
        font: "16px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createScoreText() {
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      font: "bold 24px Arial",
      fill: "#00c354",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
  }

  createTimerText() {
    this.timerText = this.add.text(this.scale.width - 150, 20, "Time: 60", {
      font: "bold 24px Arial",
      fill: "#ff6b6b",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
  }

  initializeGame() {
    // HTML tag pairs for matching
    const tagPairs = [
      { open: "<div>", close: "</div>" },
      { open: "<p>", close: "</p>" },
      { open: "<h1>", close: "</h1>" },
      { open: "<span>", close: "</span>" },
      { open: "<a>", close: "</a>" },
      { open: "<button>", close: "</button>" },
      { open: "<ul>", close: "</ul>" },
      { open: "<li>", close: "</li>" },
      { open: "<section>", close: "</section>" },
      { open: "<article>", close: "</article>" },
    ];

    // Fixed number of pairs per level: Level 1 = 3, Level 2 = 4, Level 3 = 5
    const pairsPerLevel = [3, 4, 5];
    const numPairs = pairsPerLevel[Math.min(this.level - 1, pairsPerLevel.length - 1)] || 3;
    const selectedPairs = Phaser.Utils.Array.Shuffle([...tagPairs]).slice(0, numPairs);
    this.totalPairs = selectedPairs.length;
    this.matchedPairs = 0;

    // Get actual game dimensions
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    
    // Reserve space for UI elements - reduced top margin
    const topMargin = 80; // Reduced space between header and blocks
    const bottomMargin = 10;
    const availableHeight = gameHeight - topMargin - bottomMargin;
    
    // Fixed tag dimensions
    const tagHeight = 50;
    const tagWidth = 120;
    
    // Fixed spacing between blocks - limited to 20px max
    const spacing = 20;
    
    // Calculate starting Y position to center tags vertically
    const totalTagsHeight = numPairs * tagHeight;
    const totalSpacingHeight = (numPairs - 1) * spacing;
    const totalContentHeight = totalTagsHeight + totalSpacingHeight;
    const leftStartY = topMargin + (availableHeight - totalContentHeight) / 2 + tagHeight / 2;

    // Create opening tags on the left
    selectedPairs.forEach((pair, index) => {
      const yPos = leftStartY + index * (tagHeight + spacing);
      const tag = this.createTag(
        pair.open,
        150,
        yPos,
        "opening",
        pair.close,
        1
      );
      this.openingTags.push({ tag, correctClose: pair.close });
    });

    // Create closing tags on the right (shuffled)
    const closingTags = selectedPairs.map(pair => pair.close);
    const shuffledCloses = Phaser.Utils.Array.Shuffle([...closingTags]);
    
    shuffledCloses.forEach((closeTag, index) => {
      const yPos = leftStartY + index * (tagHeight + spacing);
      const tag = this.createTag(
        closeTag,
        gameWidth - 150,
        yPos,
        "closing",
        null,
        1
      );
      this.closingTags.push({ tag, text: closeTag });
    });
  }

  createTag(text, x, y, type, correctMatch = null, scaleFactor = 1) {
    const color = type === "opening" ? "#4ecdc4" : "#ff6b6b";
    const bgColor = type === "opening" ? 0x4ecdc4 : 0xff6b6b;
    
    // Adjust tag size based on scale factor
    const tagWidth = Math.floor(120 * scaleFactor);
    const tagHeight = Math.floor(50 * scaleFactor);
    const fontSize = Math.floor(18 * scaleFactor);
    
    const tagContainer = this.add.container(x, y);
    
    // Create background rectangle
    const bg = this.add.rectangle(0, 0, tagWidth, tagHeight, bgColor, 0.8);
    bg.setStrokeStyle(2, 0xffffff);
    
    // Create text
    const tagText = this.add.text(0, 0, text, {
      font: `bold ${fontSize}px Arial`,
            fill: "#ffffff",
    }).setOrigin(0.5);
    
    tagContainer.add([bg, tagText]);
    tagContainer.setSize(tagWidth, tagHeight);
    tagContainer.setInteractive();
    
    // Store metadata
    tagContainer.setData("type", type);
    tagContainer.setData("text", text);
    tagContainer.setData("correctMatch", correctMatch);
    tagContainer.setData("matched", false);
    
    // Add hover effect
    tagContainer.on("pointerover", () => {
      if (!tagContainer.getData("matched")) {
        bg.setFillStyle(bgColor, 1);
        bg.setScale(1.1);
      }
    });
    
    tagContainer.on("pointerout", () => {
      if (!tagContainer.getData("matched")) {
        bg.setFillStyle(bgColor, 0.8);
        bg.setScale(1);
      }
    });
    
    // Click handler
    tagContainer.on("pointerdown", () => {
      if (this.gameOver || tagContainer.getData("matched")) return;
      
      this.handleTagClick(tagContainer);
    });
    
    return tagContainer;
  }

  handleTagClick(clickedTag) {
    const tagType = clickedTag.getData("type");
    
    if (tagType === "opening") {
      // Deselect previous selection
      if (this.selectedTag) {
        this.resetTagHighlight(this.selectedTag);
      }
      
      // Select this opening tag
      this.selectedTag = clickedTag;
      this.highlightTag(clickedTag, 0xffff00);
      
    } else if (tagType === "closing") {
      if (this.selectedTag) {
        // Check if match is correct
        const correctClose = this.selectedTag.getData("correctMatch");
        const clickedText = clickedTag.getData("text");
        
        if (correctClose === clickedText) {
          // Correct match!
          this.matchTags(this.selectedTag, clickedTag);
          this.selectedTag = null;
        } else {
          // Wrong match - shake and reset
          this.shakeTag(clickedTag);
          this.resetTagHighlight(this.selectedTag);
          this.selectedTag = null;
          this.updateScore(-10);
        }
      }
    }
  }

  highlightTag(tag, color) {
    const bg = tag.list[0];
    bg.setStrokeStyle(3, color);
    bg.setScale(1.05);
  }

  resetTagHighlight(tag) {
    if (!tag) return;
    const bg = tag.list[0];
    const type = tag.getData("type");
    const bgColor = type === "opening" ? 0x4ecdc4 : 0xff6b6b;
    bg.setFillStyle(bgColor, 0.8);
    bg.setStrokeStyle(2, 0xffffff);
    bg.setScale(1);
  }

  shakeTag(tag) {
    this.tweens.add({
      targets: tag,
      x: tag.x - 10,
      duration: 50,
      yoyo: true,
      repeat: 4,
      onComplete: () => {
        tag.x = tag.x; // Reset
      }
    });
  }

  matchTags(openingTag, closingTag) {
    // Mark as matched
    openingTag.setData("matched", true);
    closingTag.setData("matched", true);
    
    // Visual feedback
    const successColor = 0x00c354;
    openingTag.list[0].setFillStyle(successColor, 1);
    closingTag.list[0].setFillStyle(successColor, 1);
    openingTag.list[0].setStrokeStyle(3, 0xffffff);
    closingTag.list[0].setStrokeStyle(3, 0xffffff);
    
    // Animate match
    this.tweens.add({
      targets: [openingTag, closingTag],
      scale: 1.2,
      duration: 200,
      yoyo: true,
      ease: "Power2"
    });
    
    // Draw line connecting them
    const line = this.add.line(
      0, 0,
      openingTag.x, openingTag.y,
      closingTag.x, closingTag.y,
      0x00c354, 1
    );
    line.setLineWidth(3);
    line.setDepth(-1);
    
    this.tweens.add({
      targets: line,
      alpha: 0,
      duration: 1000,
      onComplete: () => line.destroy()
    });
    
    this.matchedPairs++;
    this.updateScore(50);
    
    // Check level completion
    if (this.matchedPairs >= this.totalPairs) {
      this.completeLevel();
    }
  }

  updateScore(points) {
    this.score += points;
    if (this.score < 0) this.score = 0;
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Animate score change
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
        
        // Change color as time runs out
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

  completeLevel() {
    this.timerEvent.remove();
    
    // Bonus points for remaining time
    const timeBonus = this.timer * 5;
    this.updateScore(timeBonus);
    
    // Show level complete message
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Level ${this.level} Complete!\n+${timeBonus} Time Bonus`,
      {
        font: "bold 36px Arial",
        fill: "#00c354",
        stroke: "#ffffff",
        strokeThickness: 4,
        align: "center"
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: message,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: "Back.easeOut"
    });
    
    // Check if we've reached max level (3 levels)
    const maxLevel = 3;
    
    if (this.level >= maxLevel) {
      // Game complete - end after showing message
      this.time.delayedCall(2000, () => {
        message.destroy();
        this.endGame(true);
      });
    } else {
      // Next level after 2 seconds
      this.time.delayedCall(2000, () => {
        message.destroy();
        this.level++;
        this.timer = 60 - (this.level * 5); // Less time per level
        if (this.timer < 30) this.timer = 30; // Minimum 30 seconds
        
        // Clear old tags
        this.openingTags.forEach(item => item.tag.destroy());
        this.closingTags.forEach(item => item.tag.destroy());
        this.openingTags = [];
        this.closingTags = [];
        this.selectedTag = null;
        
        // Reset timer text color
        this.timerText.setFill("#ff6b6b");
        
        // Initialize next level
        this.initializeGame();
        this.startTimer();
      });
    }
  }

  endGame(victory = false) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.timerEvent.remove();
    
    // Stop all tweens
    this.tweens.killAll();
    
    // Create game over overlay
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.8
    );
    
    const message = victory 
      ? `Victory!\nFinal Score: ${this.score}`
      : `Time's Up!\nFinal Score: ${this.score}`;
    
    const gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      message,
      {
        font: "bold 48px Arial",
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

export default GameScene;
