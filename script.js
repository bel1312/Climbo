class ColorMatchGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameRunning = false;
        this.playerPosition = 1.5; // 0-3 representing zones
        this.fallingBalls = [];
        this.ballSpeed = 2;
        this.spawnRate = 60; // frames between spawns
        this.frameCount = 0;
        this.colors = ['red', 'blue', 'green', 'yellow'];
        
        this.initializeElements();
        this.setupEventListeners();
        this.startGame();
    }
    
    initializeElements() {
        this.gameArea = document.getElementById('gameArea');
        this.player = document.getElementById('player');
        this.fallingBallsContainer = document.getElementById('fallingBallsContainer');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalLevelElement = document.getElementById('finalLevel');
        this.restartBtn = document.getElementById('restartBtn');
        this.catchZones = document.querySelectorAll('.catch-zone');
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.movePlayer(-1);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.movePlayer(1);
                    break;
            }
        });
        
        // Touch controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.gameRunning) return;
                
                const direction = btn.getAttribute('data-direction');
                this.movePlayer(direction === 'left' ? -1 : 1);
            });
        });
        
        // Restart button
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    startGame() {
        this.gameRunning = true;
        this.updatePlayerPosition();
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.frameCount++;
        this.updateFallingBalls();
        this.checkCollisions();
        this.spawnBalls();
        this.updateLevel();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    movePlayer(direction) {
        this.playerPosition = Math.max(0, Math.min(3, this.playerPosition + direction));
        this.updatePlayerPosition();
        
        // Add visual feedback
        this.player.style.transform = `scale(1.1) translateX(${direction * 5}px)`;
        setTimeout(() => {
            this.player.style.transform = 'scale(1) translateX(0)';
        }, 150);
        
        // Highlight active zone
        this.catchZones.forEach((zone, index) => {
            zone.classList.toggle('active', Math.floor(this.playerPosition) === index);
        });
    }
    
    updatePlayerPosition() {
        const gameAreaWidth = this.gameArea.clientWidth;
        const zoneWidth = gameAreaWidth / 4;
        const playerLeft = (this.playerPosition * zoneWidth) + (zoneWidth / 2) - 20;
        this.player.style.left = `${playerLeft}px`;
    }
    
    spawnBalls() {
        if (this.frameCount % this.spawnRate === 0) {
            const ball = this.createBall();
            this.fallingBalls.push(ball);
            this.fallingBallsContainer.appendChild(ball.element);
        }
    }
    
    createBall() {
        const element = document.createElement('div');
        element.className = 'falling-ball';
        
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        element.classList.add(color);
        
        const gameAreaWidth = this.gameArea.clientWidth;
        const randomX = Math.random() * (gameAreaWidth - 25);
        
        element.style.left = `${randomX}px`;
        element.style.top = '0px';
        
        return {
            element: element,
            x: randomX,
            y: 0,
            color: color,
            speed: this.ballSpeed + (this.level - 1) * 0.5
        };
    }
    
    updateFallingBalls() {
        this.fallingBalls.forEach((ball, index) => {
            ball.y += ball.speed;
            ball.element.style.top = `${ball.y}px`;
            
            // Remove balls that have fallen off screen
            if (ball.y > this.gameArea.clientHeight) {
                this.fallingBalls.splice(index, 1);
                ball.element.remove();
                this.loseLife();
            }
        });
    }
    
    checkCollisions() {
        const playerZone = Math.floor(this.playerPosition);
        const playerRect = this.player.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        this.fallingBalls.forEach((ball, index) => {
            const ballRect = ball.element.getBoundingClientRect();
            
            // Check if ball is in catch zone area
            if (ball.y >= this.gameArea.clientHeight - 120) {
                const ballZone = Math.floor((ball.x + 12.5) / (this.gameArea.clientWidth / 4));
                
                // Check if player is in the same zone as the ball
                if (ballZone === playerZone) {
                    // Check color match
                    const zoneColor = this.colors[ballZone];
                    if (ball.color === zoneColor) {
                        this.catchBall(ball, index);
                    } else {
                        this.missedBall(ball, index);
                    }
                } else if (ball.y >= this.gameArea.clientHeight - 80) {
                    // Ball reached bottom without being caught
                    this.fallingBalls.splice(index, 1);
                    ball.element.remove();
                    this.loseLife();
                }
            }
        });
    }
    
    catchBall(ball, index) {
        const points = this.level * 10;
        this.score += points;
        this.updateScore();
        
        // Visual effects
        this.createScorePopup(ball.x + 12.5, ball.y, `+${points}`);
        this.createParticles(ball.x + 12.5, ball.y, ball.color);
        
        // Remove ball
        this.fallingBalls.splice(index, 1);
        ball.element.remove();
        
        // Flash the catch zone
        const zone = this.catchZones[Math.floor(this.playerPosition)];
        zone.style.transform = 'scale(1.2)';
        zone.style.boxShadow = '0 0 30px currentColor';
        setTimeout(() => {
            zone.style.transform = 'scale(1)';
            zone.style.boxShadow = '';
        }, 200);
    }
    
    missedBall(ball, index) {
        this.fallingBalls.splice(index, 1);
        ball.element.remove();
        this.loseLife();
        
        // Visual feedback for wrong color
        this.createScorePopup(ball.x + 12.5, ball.y, 'WRONG!', '#ff4757');
    }
    
    loseLife() {
        this.lives--;
        this.updateLives();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Visual feedback for losing life
            this.player.style.filter = 'brightness(0.5)';
            setTimeout(() => {
                this.player.style.filter = 'brightness(1)';
            }, 300);
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateLives() {
        this.livesElement.textContent = this.lives;
        this.livesElement.style.color = this.lives <= 1 ? '#ff4757' : '#333';
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.score / 100) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.levelElement.textContent = this.level;
            this.spawnRate = Math.max(30, 60 - (this.level - 1) * 5);
            
            // Level up visual effect
            this.createScorePopup(200, 200, `LEVEL ${this.level}!`, '#2ed573');
        }
    }
    
    createScorePopup(x, y, text, color = '#2ed573') {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = text;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.style.color = color;
        
        this.gameArea.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = getComputedStyle(document.querySelector(`.falling-ball.${color}`)).backgroundColor;
            particle.style.left = `${x + (Math.random() - 0.5) * 40}px`;
            particle.style.top = `${y + (Math.random() - 0.5) * 40}px`;
            
            this.gameArea.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.finalLevelElement.textContent = this.level;
        this.gameOverScreen.style.display = 'flex';
        
        // Clear all falling balls
        this.fallingBalls.forEach(ball => ball.element.remove());
        this.fallingBalls = [];
    }
    
    restartGame() {
        // Reset game state
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.playerPosition = 1.5;
        this.ballSpeed = 2;
        this.spawnRate = 60;
        this.frameCount = 0;
        this.fallingBalls = [];
        
        // Update UI
        this.updateScore();
        this.updateLives();
        this.levelElement.textContent = this.level;
        this.updatePlayerPosition();
        
        // Clear game area
        this.fallingBallsContainer.innerHTML = '';
        
        // Hide game over screen
        this.gameOverScreen.style.display = 'none';
        
        // Remove active states
        this.catchZones.forEach(zone => zone.classList.remove('active'));
        
        // Start game
        this.startGame();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorMatchGame();
});

// Prevent scrolling on mobile
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Handle window resize
window.addEventListener('resize', () => {
    // Update player position on resize
    const game = window.game;
    if (game) {
        game.updatePlayerPosition();
    }
});
