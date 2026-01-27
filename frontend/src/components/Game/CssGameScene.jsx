import Phaser from "phaser";

class CssGameScene extends Phaser.Scene {
  constructor(courseId, courseData, onGameComplete) {
    super({ key: "CssGameScene" });
    this.courseId = courseId;
    this.courseData = courseData;
    this.onGameComplete = onGameComplete;
    this.score = 0;
    this.level = 1;
    this.currentChallenge = null;
    this.currentChallengeContainer = null;
    this.options = [];
    this.selectedOption = null;
    this.timer = 45;
    this.timerText = null;
    this.gameOver = false;
    this.correctAnswers = 0;
    this.totalChallenges = 0;
  }

  preload() {}

  create() {
    const { backgroundColor, titleText } = this.courseData.gameSceneConfig || {};

    this.cameras.main.setBackgroundColor(backgroundColor || "#1a1a2e");
    
    this.createBackground();
    this.createTitle(titleText || "CSS Visual Challenge");
    this.createScoreText();
    this.createTimerText();
    this.createInstructions();
    
    this.initializeGame();
    this.startTimer();
  }

  createBackground() {
    this.particles = [];
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const particle = this.add.circle(x, y, 2, 0x4ecdc4, 0.3);
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
        fill: "#4ecdc4",
        stroke: "#ffffff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  createInstructions() {
    this.add
      .text(this.scale.width / 2, 70, "Select the CSS that creates the visual effect!", {
        font: "16px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createScoreText() {
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      font: "bold 24px Arial",
      fill: "#4ecdc4",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
  }

  createTimerText() {
    this.timerText = this.add.text(this.scale.width - 150, 20, "Time: 45", {
      font: "bold 24px Arial",
      fill: "#ff6b6b",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
  }

  initializeGame() {
    // CSS challenges with visual examples
    this.challenges = [
      {
        visual: "centered-text",
        description: "Centered text",
        correct: "text-align: center;",
        options: [
          "text-align: center;",
          "text-align: left;",
          "align: center;",
          "position: center;"
        ]
      },
      {
        visual: "red-background",
        description: "Red background",
        correct: "background-color: red;",
        options: [
          "background-color: red;",
          "color: red;",
          "bg-color: red;",
          "background: red-color;"
        ]
      },
      {
        visual: "bold-text",
        description: "Bold text",
        correct: "font-weight: bold;",
        options: [
          "font-weight: bold;",
          "text-weight: bold;",
          "font-style: bold;",
          "weight: bold;"
        ]
      },
      {
        visual: "flex-row",
        description: "Items in a row",
        correct: "display: flex; flex-direction: row;",
        options: [
          "display: flex; flex-direction: row;",
          "display: row;",
          "flex: row;",
          "direction: row;"
        ]
      },
      {
        visual: "rounded-corners",
        description: "Rounded corners",
        correct: "border-radius: 10px;",
        options: [
          "border-radius: 10px;",
          "corner-radius: 10px;",
          "border: rounded;",
          "radius: 10px;"
        ]
      },
      {
        visual: "shadow",
        description: "Box shadow",
        correct: "box-shadow: 0 2px 4px rgba(0,0,0,0.2);",
        options: [
          "box-shadow: 0 2px 4px rgba(0,0,0,0.2);",
          "shadow: 0 2px 4px;",
          "box-shadow: shadow;",
          "shadow-box: 0 2px 4px;"
        ]
      },
      {
        visual: "no-display",
        description: "Hidden element",
        correct: "display: none;",
        options: [
          "display: none;",
          "visibility: hidden;",
          "hidden: true;",
          "display: hide;"
        ]
      },
      {
        visual: "uppercase",
        description: "Uppercase text",
        correct: "text-transform: uppercase;",
        options: [
          "text-transform: uppercase;",
          "text-case: uppercase;",
          "transform: uppercase;",
          "case: uppercase;"
        ]
      }
    ];

    this.totalChallenges = 0;
    this.correctAnswers = 0;
    this.showNextChallenge();
  }

  showNextChallenge() {
    // Clear previous challenge
    if (this.currentChallengeContainer) {
      this.currentChallengeContainer.destroy();
      this.currentChallengeContainer = null;
    }
    this.options.forEach(opt => {
      if (opt && opt.destroy) opt.destroy();
    });
    this.options = [];

    // Select random challenge
    const challenge = Phaser.Utils.Array.Shuffle([...this.challenges])[0];
    this.currentChallenge = challenge;
    this.totalChallenges++;

    // Create visual example
    this.createVisualExample(challenge);

    // Create option buttons (shuffled)
    const shuffledOptions = Phaser.Utils.Array.Shuffle([...challenge.options]);
    
    const optionWidth = Math.min(320, this.scale.width - 40);
    const optionHeight = 45;
    const startX = this.scale.width / 2;
    const startY = 280;
    const spacing = 50;

    shuffledOptions.forEach((option, index) => {
      const yPos = startY + index * spacing;
      const optionBtn = this.createOptionButton(
        option,
        startX,
        yPos,
        optionWidth,
        optionHeight,
        option === challenge.correct
      );
      this.options.push(optionBtn);
    });
  }

  createVisualExample(challenge) {
    const centerX = this.scale.width / 2;
    const centerY = 140;
    
    // Create a container for the visual example
    const exampleContainer = this.add.container(centerX, centerY);
    
    // Background box - make it fit better
    const bgWidth = Math.min(280, this.scale.width - 40);
    const bgHeight = 100;
    const bg = this.add.rectangle(0, 0, bgWidth, bgHeight, 0x2c3e50, 0.9);
    bg.setStrokeStyle(2, 0x4ecdc4);
    exampleContainer.add(bg);

    // Create visual based on challenge type
    let visualElement;
    
    switch (challenge.visual) {
      case "centered-text":
        visualElement = this.add.text(0, 0, "Centered Text", {
          font: "20px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        break;
        
      case "red-background":
        const redBg = this.add.rectangle(0, 0, 200, 80, 0xff0000);
        exampleContainer.add(redBg);
        visualElement = this.add.text(0, 0, "Red Box", {
          font: "18px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        break;
        
      case "bold-text":
        visualElement = this.add.text(0, 0, "Bold Text", {
          font: "bold 20px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        break;
        
      case "flex-row":
        const rowContainer = this.add.container(0, 0);
        for (let i = 0; i < 3; i++) {
          const box = this.add.rectangle(-60 + i * 60, 0, 40, 40, 0x4ecdc4);
          rowContainer.add(box);
        }
        exampleContainer.add(rowContainer);
        visualElement = this.add.text(0, -30, "Items in Row", {
          font: "14px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        break;
        
      case "rounded-corners":
        const roundedBox = this.add.rectangle(0, 0, 150, 80, 0x4ecdc4);
        roundedBox.setStrokeStyle(2, 0xffffff);
        exampleContainer.add(roundedBox);
        visualElement = this.add.text(0, 0, "Rounded", {
          font: "18px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        // Note: Phaser rectangles don't support border-radius visually, but we show the concept
        break;
        
      case "shadow":
        const shadowBox = this.add.rectangle(0, 0, 150, 80, 0x4ecdc4);
        shadowBox.setStrokeStyle(2, 0xffffff);
        exampleContainer.add(shadowBox);
        visualElement = this.add.text(0, 0, "Shadow", {
          font: "18px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        break;
        
      case "no-display":
        // Show "hidden" concept with faded element
        const hiddenBox = this.add.rectangle(0, 0, 150, 80, 0x4ecdc4, 0.3);
        hiddenBox.setStrokeStyle(2, 0xffffff, 0.3);
        exampleContainer.add(hiddenBox);
        visualElement = this.add.text(0, 0, "Hidden", {
          font: "18px Arial",
          fill: "#ffffff",
          alpha: 0.3
        }).setOrigin(0.5);
        break;
        
      case "uppercase":
        visualElement = this.add.text(0, 0, "UPPERCASE TEXT", {
          font: "20px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
        break;
        
      default:
        visualElement = this.add.text(0, 0, challenge.description, {
          font: "18px Arial",
          fill: "#ffffff"
        }).setOrigin(0.5);
    }
    
    if (visualElement) {
      exampleContainer.add(visualElement);
    }
    
    // Description text below (outside container for easier positioning)
    const descText = this.add.text(centerX, centerY + 60, challenge.description, {
      font: "bold 16px Arial",
      fill: "#4ecdc4"
    }).setOrigin(0.5);
    
    // Add description to container so it gets destroyed together
    exampleContainer.add(descText);
    this.currentChallengeContainer = exampleContainer;
  }

  createOptionButton(text, x, y, width, height, isCorrect) {
    const buttonContainer = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, width, height, 0x34495e, 0.9);
    bg.setStrokeStyle(2, 0x4ecdc4);
    
    const buttonText = this.add.text(0, 0, text, {
      font: "12px Arial",
      fill: "#ffffff",
      wordWrap: { width: width - 20 },
      align: "center"
    }).setOrigin(0.5);
    
    buttonContainer.add([bg, buttonText]);
    buttonContainer.setSize(width, height);
    buttonContainer.setInteractive();
    buttonContainer.setData("isCorrect", isCorrect);
    buttonContainer.setData("text", text);
    
    // Hover effect
    buttonContainer.on("pointerover", () => {
      bg.setFillStyle(0x4ecdc4, 0.8);
      bg.setScale(1.05);
    });
    
    buttonContainer.on("pointerout", () => {
      bg.setFillStyle(0x34495e, 0.9);
      bg.setScale(1);
    });
    
    // Click handler
    buttonContainer.on("pointerdown", () => {
      if (this.gameOver) return;
      this.handleOptionClick(buttonContainer, isCorrect);
    });
    
    return buttonContainer;
  }

  handleOptionClick(button, isCorrect) {
    // Disable all buttons
    this.options.forEach(opt => {
      opt.removeInteractive();
      const bg = opt.list[0];
      if (opt.getData("isCorrect")) {
        bg.setFillStyle(0x00c354, 1);
        bg.setStrokeStyle(3, 0xffffff);
      } else {
        bg.setFillStyle(0x666666, 0.5);
      }
    });
    
    if (isCorrect) {
      this.correctAnswers++;
      this.updateScore(50);
      
      // Success animation
      this.tweens.add({
        targets: button,
        scale: 1.1,
        duration: 200,
        yoyo: true,
        ease: "Power2"
      });
      
      // Show success message
      const successText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Correct!",
        {
          font: "bold 36px Arial",
          fill: "#00c354",
          stroke: "#ffffff",
          strokeThickness: 3
        }
      ).setOrigin(0.5);
      
      this.tweens.add({
        targets: successText,
        alpha: 0,
        y: successText.y - 50,
        duration: 1000,
        onComplete: () => successText.destroy()
      });
      
    } else {
      this.updateScore(-10);
      
      // Shake animation
      this.tweens.add({
        targets: button,
        x: button.x - 10,
        duration: 50,
        yoyo: true,
        repeat: 4
      });
      
      // Highlight correct answer
      const correctBtn = this.options.find(opt => opt.getData("isCorrect"));
      if (correctBtn) {
        const bg = correctBtn.list[0];
        bg.setFillStyle(0x00c354, 1);
        bg.setStrokeStyle(3, 0xffffff);
      }
    }
    
    // Next challenge after delay
    this.time.delayedCall(1500, () => {
      if (!this.gameOver) {
        this.showNextChallenge();
      }
    });
  }

  updateScore(points) {
    this.score += points;
    if (this.score < 0) this.score = 0;
    this.scoreText.setText(`Score: ${this.score}`);
    
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
    
    const accuracy = this.totalChallenges > 0 
      ? Math.round((this.correctAnswers / this.totalChallenges) * 100) 
      : 0;
    
    const message = `Game Over!\nScore: ${this.score}\nAccuracy: ${accuracy}%`;
    
    const gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      message,
      {
        font: "bold 36px Arial",
        fill: "#4ecdc4",
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

export default CssGameScene;
