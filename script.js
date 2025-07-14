class ClimbingGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.gameStarted = false;
    this.gameOver = false;

    // Game state
    this.score = 0;
    this.height = 0;
    this.lives = 3;
    this.cameraY = 0;
    this.gameSpeed = 1;
    this.combo = 0;
    this.maxCombo = 0;
    this.powerUpActive = false;
    this.powerUpTimer = 0;

    // Player object with improved stats - start on ground
    this.player = {
      x: this.canvas.width / 2 - 15,
      y: this.canvas.height - 140, // Start above the platform
      width: 30,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      climbing: false,
      invulnerable: false,
      invulnerabilityTimer: 0,
      doubleJumpAvailable: true,
      wallJumpTimer: 0,
      lastPlatform: null,
      airTime: 0,
      onMovingPlatform: null, // Track which moving platform player is on
    };

    // Game objects
    this.platforms = [];
    this.obstacles = [];
    this.powerUps = [];
    this.particles = [];
    this.clouds = [];

    // Controls
    this.keys = {};
    this.jumpPressed = false;
    this.jumpReleased = true;

    this.initializeGame();
    this.setupEventListeners();
    this.generateInitialLevel();
    this.gameLoop();
  }

  initializeGame() {
    // Generate clouds for background
    for (let i = 0; i < 15; i++) {
      this.clouds.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 3,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
  }

  setupEventListeners() {
    // Keyboard controls (including space bar)
    document.addEventListener("keydown", (e) => {
      const wasPressed = this.keys[e.code];
      this.keys[e.code] = true;

      // Track jump button press for reliable jumping
      if (["ArrowUp", "KeyW", "Space"].includes(e.code) && !wasPressed) {
        this.jumpPressed = true;
      }

      // Only prevent default for game keys
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    });

    document.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;

      // Track jump button release
      if (["ArrowUp", "KeyW", "Space"].includes(e.code)) {
        this.jumpReleased = true;
      }
    });

    // Button controls
    document.getElementById("startBtn").addEventListener("click", () => {
      this.startGame();
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
      this.restartGame();
    });
  }

  startGame() {
    this.gameStarted = true;
    document.getElementById("startScreen").classList.add("hidden");
  }

  restartGame() {
    this.gameOver = false;
    this.score = 0;
    this.height = 0;
    this.lives = 3;
    this.cameraY = 0;
    this.gameSpeed = 1;

    // Reset player position to be on the starting platform
    this.player.x = this.canvas.width / 2 - 15;
    this.player.y = this.canvas.height - 140; // Above the starting platform
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.onGround = false;
    this.player.climbing = false;
    this.player.invulnerable = false;
    this.player.invulnerabilityTimer = 0;
    this.player.doubleJumpAvailable = true;
    this.player.wallJumpTimer = 0;
    this.player.lastPlatform = null;
    this.player.airTime = 0;
    this.player.onMovingPlatform = null;

    // Clear game objects
    this.platforms = [];
    this.obstacles = [];
    this.powerUps = [];
    this.particles = [];

    this.generateInitialLevel();
    document.getElementById("gameOver").classList.add("hidden");
    this.updateUI();
  }

  generateInitialLevel() {
    // Generate initial platforms closer together and starting platform

    // Add a starting platform right below the player
    this.platforms.push({
      x: this.canvas.width / 2 - 100,
      y: this.canvas.height - 80,
      width: 200,
      height: 20,
      type: "normal",
      direction: 1,
      speed: 0,
      health: -1,
      bounceForce: 0,
    });

    // Generate more platforms going up
    for (let i = 1; i < 25; i++) {
      this.generatePlatform(this.canvas.height - 80 - i * 120);
    }
  }

  generatePlatform(y) {
    const platformTypes = ["normal", "small", "moving", "breakable", "bouncy"];
    const weights = [50, 25, 15, 5, 5]; // Reduced breakable from 15 to 5, increased normal
    const random = Math.random() * 100;
    let type = "normal";
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        type = platformTypes[i];
        break;
      }
    }

    let width = type === "small" ? 60 : type === "bouncy" ? 100 : 120;
    let x = Math.random() * (this.canvas.width - width);

    const platform = {
      x: x,
      y: y,
      width: width,
      height: 20,
      type: type,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: type === "moving" ? 2 : 0,
      health: type === "breakable" ? 2 : -1,
      bounceForce: type === "bouncy" ? 18 : 0,
    };

    this.platforms.push(platform);

    // Add obstacles and power-ups with better distribution
    if (Math.random() < 0.25) {
      this.generateObstacle(y - 60);
    }

    if (Math.random() < 0.3) {
      this.generatePowerUp(y - 40);
    }
  }

  generateObstacle(y) {
    const obstacles = ["rock", "bird"]; // Removed 'ice' to eliminate blue deadly obstacles
    const type = obstacles[Math.floor(Math.random() * obstacles.length)];

    this.obstacles.push({
      x: Math.random() * (this.canvas.width - 30),
      y: y,
      width: 30,
      height: 30,
      type: type,
      velocityX: type === "bird" ? (Math.random() - 0.5) * 4 : 0,
      velocityY: type === "rock" ? 2 : 0,
    });
  }

  generatePowerUp(y) {
    const powerUps = ["life", "score", "speed", "shield", "magnet"];
    const type = powerUps[Math.floor(Math.random() * powerUps.length)];

    this.powerUps.push({
      x: Math.random() * (this.canvas.width - 25),
      y: y,
      width: 25,
      height: 25,
      type: type,
      collected: false,
      bobOffset: Math.random() * Math.PI * 2,
      pulseOffset: Math.random() * Math.PI * 2,
    });
  }

  handleInput() {
    if (!this.gameStarted || this.gameOver) return;

    const moveSpeed = this.powerUpActive ? 5 : 4; // Reduced from 8/6 to 5/4
    const jumpPower = this.powerUpActive ? 16 : 14;

    // Reduced movement acceleration for less responsive controls
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
      this.player.velocityX = Math.max(this.player.velocityX - 0.8, -moveSpeed); // Reduced from 1.2
    }
    // Reduced movement acceleration for less responsive controls
    else if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
      this.player.velocityX = Math.min(this.player.velocityX + 0.8, moveSpeed); // Reduced from 1.2
    }
    // Better friction
    else {
      this.player.velocityX *= 0.85; // Slightly more friction
    }

    // Enhanced jump with reliable input detection
    if (this.jumpPressed && this.jumpReleased) {
      if (this.player.onGround) {
        // Normal jump from ground
        this.player.velocityY = -jumpPower;
        this.player.onGround = false;
        this.player.doubleJumpAvailable = true;
        this.createJumpParticles();
        this.jumpPressed = false;
        this.jumpReleased = false;
      } else if (this.player.doubleJumpAvailable) {
        // Double jump in air
        this.player.velocityY = -jumpPower * 0.8;
        this.player.doubleJumpAvailable = false;
        this.createDoubleJumpParticles();
        this.combo++;
        this.jumpPressed = false;
        this.jumpReleased = false;
      }
    }

    // Reset jump if no keys are pressed
    if (!this.keys["ArrowUp"] && !this.keys["KeyW"] && !this.keys["Space"]) {
      this.jumpPressed = false;
    }

    // Fast fall
    if (this.keys["ArrowDown"] || this.keys["KeyS"]) {
      this.player.velocityY += 1.2;
    }
  }

  updatePlayer() {
    // Apply gravity
    this.player.velocityY += 0.5;

    // Terminal velocity
    this.player.velocityY = Math.min(this.player.velocityY, 15);

    // Move with moving platform if on one
    if (this.player.onMovingPlatform && this.player.onGround) {
      const platform = this.player.onMovingPlatform;
      this.player.x += platform.direction * platform.speed;
    }

    // Update position
    this.player.x += this.player.velocityX;
    this.player.y += this.player.velocityY;

    // Track air time for combos
    if (!this.player.onGround) {
      this.player.airTime++;
    } else {
      this.player.airTime = 0;
      this.player.doubleJumpAvailable = true;
    }

    // Keep player in bounds horizontally with screen wrapping
    if (this.player.x < -this.player.width) {
      this.player.x = this.canvas.width;
    }
    if (this.player.x > this.canvas.width) {
      this.player.x = -this.player.width;
    }

    // Update power-up timer
    if (this.powerUpActive) {
      this.powerUpTimer--;
      if (this.powerUpTimer <= 0) {
        this.powerUpActive = false;
      }
    }

    // Update invulnerability
    if (this.player.invulnerable) {
      this.player.invulnerabilityTimer--;
      if (this.player.invulnerabilityTimer <= 0) {
        this.player.invulnerable = false;
      }
    }

    // Update camera to follow player climbing with smooth movement
    const targetCameraY = this.player.y - this.canvas.height * 0.4;
    if (targetCameraY < this.cameraY) {
      this.cameraY += (targetCameraY - this.cameraY) * 0.1;
      const newHeight = Math.floor(-this.cameraY / 8);
      if (newHeight > this.height) {
        const heightGained = newHeight - this.height;
        this.height = newHeight;
        this.score += heightGained * (this.combo + 1); // Combo multiplier
      }
    }

    // Generate new platforms as player climbs
    if (-this.cameraY > this.platforms[this.platforms.length - 1].y + 200) {
      for (let i = 0; i < 6; i++) {
        this.generatePlatform(
          this.platforms[this.platforms.length - 1].y - 120
        );
      }
    }

    // Increase game speed and difficulty gradually
    this.gameSpeed = Math.min(2.5, 1 + this.height / 800);
  }

  updateGameObjects() {
    // Update platforms
    this.platforms.forEach((platform) => {
      if (platform.type === "moving") {
        platform.x += platform.direction * platform.speed;
        if (
          platform.x <= 0 ||
          platform.x + platform.width >= this.canvas.width
        ) {
          platform.direction *= -1;
        }
      }
    });

    // Update obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.x += obstacle.velocityX;
      obstacle.y += obstacle.velocityY;

      if (obstacle.type === "bird") {
        obstacle.velocityX += (Math.random() - 0.5) * 0.2;
        obstacle.velocityX = Math.max(-3, Math.min(3, obstacle.velocityX));
      }
    });

    // Update power-ups (bobbing animation)
    this.powerUps.forEach((powerUp) => {
      powerUp.bobOffset += 0.1;
    });

    // Update particles
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life--;
      particle.velocityY += 0.1;
      return particle.life > 0;
    });

    // Update clouds
    this.clouds.forEach((cloud) => {
      cloud.x += cloud.speed;
      if (cloud.x > this.canvas.width + cloud.size) {
        cloud.x = -cloud.size;
        cloud.y = Math.random() * this.canvas.height * 3;
      }
    });
  }

  checkCollisions() {
    this.player.onGround = false;
    this.player.onMovingPlatform = null; // Reset moving platform tracking

    // Platform collisions with enhanced mechanics
    this.platforms.forEach((platform, index) => {
      if (this.isColliding(this.player, platform)) {
        if (this.player.velocityY > 0 && this.player.y < platform.y) {
          // Handle different platform types
          if (platform.type === "breakable" && platform.health > 0) {
            platform.health--;
            this.createBreakParticles(platform);
            if (platform.health <= 0) {
              // Mark for removal
              platform.broken = true;
            }
          }

          if (!platform.broken) {
            this.player.y = platform.y - this.player.height;

            if (platform.type === "bouncy") {
              this.player.velocityY = -platform.bounceForce;
              this.createBounceParticles(platform);
              this.combo++;
            } else {
              this.player.velocityY = 0;
            }

            this.player.onGround = true;
            this.player.lastPlatform = platform;

            // Track if player is on a moving platform
            if (platform.type === "moving") {
              this.player.onMovingPlatform = platform;
            }

            // Combo system - landing on different platforms
            if (this.player.lastPlatform !== platform) {
              this.combo++;
              this.maxCombo = Math.max(this.maxCombo, this.combo);
            }
          }
        }
      }
    });

    // Remove broken platforms
    this.platforms = this.platforms.filter((platform) => !platform.broken);

    // Reset combo if on ground too long
    if (this.player.onGround && this.player.airTime === 0) {
      this.combo = Math.max(0, this.combo - 0.1);
    }

    // Obstacle collisions
    this.obstacles.forEach((obstacle) => {
      if (
        this.isColliding(this.player, obstacle) &&
        !this.player.invulnerable
      ) {
        this.takeDamage();
      }
    });

    // Power-up collisions
    this.powerUps.forEach((powerUp) => {
      if (this.isColliding(this.player, powerUp) && !powerUp.collected) {
        this.collectPowerUp(powerUp);
      }
    });

    // Check if player fell too far
    if (this.player.y > this.cameraY + this.canvas.height + 200) {
      this.takeDamage();
    }
  }

  isColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  takeDamage() {
    this.lives--;
    this.player.invulnerable = true;
    this.player.invulnerabilityTimer = 120; // 2 seconds at 60fps
    this.createDamageParticles();

    if (this.lives <= 0) {
      this.endGame();
    } else {
      // Respawn player on nearest platform
      this.respawnPlayer();
    }
  }

  respawnPlayer() {
    const nearestPlatform = this.platforms
      .filter(
        (p) => p.y > this.cameraY && p.y < this.cameraY + this.canvas.height
      )
      .sort(
        (a, b) => Math.abs(a.y - this.player.y) - Math.abs(b.y - this.player.y)
      )[0];

    if (nearestPlatform) {
      this.player.x =
        nearestPlatform.x + nearestPlatform.width / 2 - this.player.width / 2;
      this.player.y = nearestPlatform.y - this.player.height;
      this.player.velocityX = 0;
      this.player.velocityY = 0;
    }
  }

  collectPowerUp(powerUp) {
    powerUp.collected = true;
    this.createCollectionParticles(powerUp);

    const comboBonus = Math.floor(this.combo);

    switch (powerUp.type) {
      case "life":
        this.lives = Math.min(5, this.lives + 1);
        this.score += 100 + comboBonus * 10;
        break;
      case "score":
        this.score += 200 + comboBonus * 20;
        break;
      case "speed":
        this.powerUpActive = true;
        this.powerUpTimer = 300; // 5 seconds at 60fps
        this.score += 150 + comboBonus * 15;
        break;
      case "shield":
        this.player.invulnerable = true;
        this.player.invulnerabilityTimer = 600; // 10 seconds
        this.score += 250 + comboBonus * 25;
        break;
      case "magnet":
        // Attract nearby power-ups (simplified implementation)
        this.score += 300 + comboBonus * 30;
        break;
    }

    this.combo += 0.5; // Bonus for collecting power-ups
  }

  createJumpParticles() {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2 + (Math.random() - 0.5) * 20,
        y: this.player.y + this.player.height,
        velocityX: (Math.random() - 0.5) * 6,
        velocityY: Math.random() * 3 + 1,
        life: 40,
        color: "#DEB887",
        size: Math.random() * 4 + 2,
      });
    }
  }

  createDoubleJumpParticles() {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height / 2,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: (Math.random() - 0.5) * 8,
        life: 60,
        color: "#4CAF50",
        size: Math.random() * 5 + 3,
      });
    }
  }

  createBounceParticles(platform) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: platform.x + Math.random() * platform.width,
        y: platform.y,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: -Math.random() * 6 - 2,
        life: 50,
        color: "#FF69B4",
        size: Math.random() * 4 + 2,
      });
    }
  }

  createBreakParticles(platform) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: platform.x + Math.random() * platform.width,
        y: platform.y + Math.random() * platform.height,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: -Math.random() * 8 - 2,
        life: 80,
        color: "#8B4513",
        size: Math.random() * 6 + 2,
      });
    }
  }

  createDamageParticles() {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height / 2,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: (Math.random() - 0.5) * 8,
        life: 80,
        color: "#FF6B6B",
        size: Math.random() * 6 + 3,
      });
    }
  }

  createCollectionParticles(powerUp) {
    const colors = {
      life: "#4CAF50",
      score: "#FFD700",
      speed: "#2196F3",
      shield: "#9C27B0",
      magnet: "#FF9800",
    };

    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: powerUp.x + powerUp.width / 2,
        y: powerUp.y + powerUp.height / 2,
        velocityX: (Math.random() - 0.5) * 6,
        velocityY: (Math.random() - 0.5) * 6,
        life: 60,
        color: colors[powerUp.type],
        size: Math.random() * 5 + 2,
      });
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(0, -this.cameraY);

    // Draw clouds
    this.drawClouds();

    // Draw platforms
    this.drawPlatforms();

    // Draw obstacles
    this.drawObstacles();

    // Draw power-ups
    this.drawPowerUps();

    // Draw player
    this.drawPlayer();

    // Draw particles
    this.drawParticles();

    // Restore context
    this.ctx.restore();
  }

  drawClouds() {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.clouds.forEach((cloud) => {
      this.ctx.beginPath();
      this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawPlatforms() {
    this.platforms.forEach((platform) => {
      if (
        platform.y > this.cameraY - 50 &&
        platform.y < this.cameraY + this.canvas.height + 50
      ) {
        const gradient = this.ctx.createLinearGradient(
          0,
          platform.y,
          0,
          platform.y + platform.height
        );

        switch (platform.type) {
          case "moving":
            gradient.addColorStop(0, "#FF8C00");
            gradient.addColorStop(1, "#FF6347");
            break;
          case "small":
            gradient.addColorStop(0, "#32CD32");
            gradient.addColorStop(1, "#228B22");
            break;
          case "breakable":
            const health = platform.health || 0;
            if (health > 1) {
              gradient.addColorStop(0, "#CD853F");
              gradient.addColorStop(1, "#8B4513");
            } else {
              gradient.addColorStop(0, "#A0522D");
              gradient.addColorStop(1, "#654321");
            }
            break;
          case "bouncy":
            gradient.addColorStop(0, "#FF69B4");
            gradient.addColorStop(1, "#FF1493");
            break;
          default:
            gradient.addColorStop(0, "#8B4513");
            gradient.addColorStop(1, "#654321");
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );

        // Add platform border and effects
        this.ctx.strokeStyle = "#4A4A4A";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );

        // Add special effects for certain platforms
        if (platform.type === "bouncy") {
          this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          this.ctx.fillRect(
            platform.x + 5,
            platform.y + 5,
            platform.width - 10,
            5
          );
        }

        if (platform.type === "breakable" && platform.health <= 1) {
          // Add cracks
          this.ctx.strokeStyle = "#2F4F4F";
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            const x = platform.x + Math.random() * platform.width;
            const y = platform.y + Math.random() * platform.height;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(
              x + Math.random() * 20 - 10,
              y + Math.random() * 10 - 5
            );
          }
          this.ctx.stroke();
        }
      }
    });
  }

  drawObstacles() {
    this.obstacles.forEach((obstacle) => {
      if (
        obstacle.y > this.cameraY - 50 &&
        obstacle.y < this.cameraY + this.canvas.height + 50
      ) {
        this.ctx.fillStyle = obstacle.type === "rock" ? "#696969" : "#8B4513"; // Only rock (gray) and bird (brown)

        if (obstacle.type === "bird") {
          // Draw simple bird shape
          this.ctx.beginPath();
          this.ctx.ellipse(
            obstacle.x + 15,
            obstacle.y + 15,
            12,
            8,
            0,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        } else {
          this.ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
          );
        }
      }
    });
  }

  drawPowerUps() {
    this.powerUps.forEach((powerUp) => {
      if (
        !powerUp.collected &&
        powerUp.y > this.cameraY - 50 &&
        powerUp.y < this.cameraY + this.canvas.height + 50
      ) {
        const bobY = powerUp.y + Math.sin(powerUp.bobOffset) * 4;
        const pulseScale = 1 + Math.sin(powerUp.pulseOffset) * 0.2;

        powerUp.bobOffset += 0.15;
        powerUp.pulseOffset += 0.1;

        const colors = {
          life: "#4CAF50",
          score: "#FFD700",
          speed: "#2196F3",
          shield: "#9C27B0",
          magnet: "#FF9800",
        };

        const size = powerUp.width * pulseScale;
        const x = powerUp.x + (powerUp.width - size) / 2;
        const y = bobY + (powerUp.height - size) / 2;

        // Draw glow effect
        this.ctx.shadowColor = colors[powerUp.type];
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = colors[powerUp.type];
        this.ctx.fillRect(x, y, size, size);

        // Draw inner highlight
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        this.ctx.fillRect(
          x + size * 0.2,
          y + size * 0.2,
          size * 0.3,
          size * 0.3
        );

        // Draw icon/symbol for power-up type
        this.ctx.fillStyle = "white";
        this.ctx.font = `${Math.floor(size * 0.4)}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        const symbols = {
          life: "♥",
          score: "★",
          speed: "⚡",
          shield: "🛡",
          magnet: "🧲",
        };

        this.ctx.fillText(
          symbols[powerUp.type] || "?",
          x + size / 2,
          y + size / 2
        );
      }
    });
  }

  drawPlayer() {
    const alpha =
      this.player.invulnerable && Math.floor(Date.now() / 100) % 2 ? 0.5 : 1;
    this.ctx.globalAlpha = alpha;

    // Add power-up visual effects
    if (this.powerUpActive) {
      this.ctx.shadowColor = "#FFD700";
      this.ctx.shadowBlur = 10;
    }

    // Player body with improved design
    const gradient = this.ctx.createLinearGradient(
      this.player.x,
      this.player.y,
      this.player.x,
      this.player.y + this.player.height
    );
    gradient.addColorStop(0, "#FF8E53");
    gradient.addColorStop(1, "#FF6B6B");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    // Player face
    this.ctx.fillStyle = "#FFE4B5";
    this.ctx.fillRect(this.player.x + 5, this.player.y + 5, 20, 15);

    // Eyes with animation
    this.ctx.fillStyle = "#000";
    const eyeOffset =
      this.player.velocityX > 0 ? 1 : this.player.velocityX < 0 ? -1 : 0;
    this.ctx.fillRect(this.player.x + 8 + eyeOffset, this.player.y + 8, 3, 3);
    this.ctx.fillRect(this.player.x + 19 + eyeOffset, this.player.y + 8, 3, 3);

    // Mouth based on state
    if (this.player.velocityY < 0) {
      // Happy mouth when jumping
      this.ctx.beginPath();
      this.ctx.arc(this.player.x + 15, this.player.y + 13, 3, 0, Math.PI);
      this.ctx.stroke();
    }

    // Reset shadow
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      const alpha = particle.life / 80;
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = alpha;

      const size = particle.size || 3;
      this.ctx.fillRect(
        particle.x - size / 2,
        particle.y - size / 2,
        size,
        size
      );
    });
    this.ctx.globalAlpha = 1;
  }

  updateUI() {
    document.getElementById("score").textContent = Math.ceil(this.score);
    document.getElementById("height").textContent = this.height;
    document.getElementById("lives").textContent = this.lives;
    document.getElementById("combo").textContent = Math.floor(this.combo);

    // Add visual feedback for combo
    const comboElement = document.getElementById("combo");
    if (this.combo > 5) {
      comboElement.style.color = "#FFD700";
      comboElement.style.textShadow = "0 0 10px #FFD700";
    } else if (this.combo > 2) {
      comboElement.style.color = "#FF6B6B";
      comboElement.style.textShadow = "0 0 5px #FF6B6B";
    } else {
      comboElement.style.color = "white";
      comboElement.style.textShadow = "none";
    }
  }

  endGame() {
    this.gameOver = true;
    document.getElementById("finalScore").textContent = Math.ceil(this.score);
    document.getElementById("finalHeight").textContent = this.height;
    document.getElementById("gameOver").classList.remove("hidden");
  }

  gameLoop() {
    if (this.gameStarted && !this.gameOver) {
      this.handleInput();
      this.updatePlayer();
      this.updateGameObjects();
      this.checkCollisions();
      this.updateUI();
    }

    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start the game when page loads
window.addEventListener("load", () => {
  new ClimbingGame();
});
