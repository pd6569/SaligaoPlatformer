export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    // Core game properties
    this.player = null;
    this.ground = null;
    this.enemies = null;
    this.coins = null;
    this.goal = null;
    this.levelWidth = 3200;
    
    // Physics constants
    this.MOVEMENT_SPEED = 200;
    this.MAX_SPEED = 400;
    this.ACCELERATION = 1500;
    this.DRAG = 1800;
    this.JUMP_VELOCITY = -600;
    this.JUMP_HOLD_DURATION = 150;
    this.MIN_JUMP_VELOCITY = -300;
    
    // Game state
    this.gameOver = false;
    this.score = 0;
    this.jumpTimer = 0;
    this.isJumping = false;
    this.playerFacingRight = true;
    this.backgroundTrees = [];
  }

  init() {
    this.gameOver = false;
    this.score = 0;
    this.jumpTimer = 0;
    this.isJumping = false;
    if (this.backgroundTrees) {
      this.backgroundTrees.forEach(tree => tree.destroy());
      this.backgroundTrees = [];
    }
  }

  createGradientBackground() {
    const width = this.levelWidth;
    const height = window.innerHeight;
    const skyHeight = height * 0.7;
    const groundHeight = height * 0.3;

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4, 1);
    graphics.fillRect(0, 0, width, skyHeight);
    graphics.fillGradientStyle(0x90EE90, 0x90EE90, 0x228B22, 0x228B22, 1);
    graphics.fillRect(0, skyHeight, width, groundHeight);
    graphics.setScrollFactor(0.1);
    graphics.setDepth(0);
  }

  create() {
    this.gameOver = false;
    this.score = 0;
    
    // Set the world bounds (levelWidth wide and full window height)
    this.physics.world.setBounds(0, 0, this.levelWidth, window.innerHeight);
    
    this.createGradientBackground();

    // Create background trees (for visual flair)
    for (let i = 0; i < 20; i++) {
      const tree = this.add.image(
        i * 400,
        window.innerHeight - 300,
        'tree'
      );
      const scale = Phaser.Math.FloatBetween(0.8, 1.2);
      tree.setScale(scale);
      tree.setScrollFactor(0.5);
      tree.setDepth(1);
      this.backgroundTrees.push(tree);
    }

    // Create the platform (ground)
    // platformY is the center of the platform; we want it to be 40 pixels high.
    const platformY = window.innerHeight - 40;
    this.ground = this.physics.add.staticImage(this.levelWidth / 2, platformY, 'platform');
    this.ground.setDisplaySize(this.levelWidth, 40);
    this.ground.setImmovable(true);
    this.ground.refreshBody();
    this.ground.setDepth(2);
    
    // Setup all game elements.
    this.setupPlayer();
    this.setupGoal();
    this.setupEnemies();
    this.setupCollectibles();
    this.setupCollisions();
    this.setupUI();
    
    // Set up camera to follow the player.
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setDeadzone(100, 100);
    this.cameras.main.setBounds(0, 0, this.levelWidth, window.innerHeight);
    
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setupPlayer() {
    // We want the player to stand on the platform.
    // The platform sprite is centered at platformY with a height of 40, so its top is at:
    //   platformTop = platformY - (40/2) = window.innerHeight - 40 - 20 = window.innerHeight - 60.
    const platformY = window.innerHeight - 40;
    const platformTop = platformY - 20;

    // Use the original texture dimensions multiplied by the scale.
    // (This avoids relying on displayHeight, which may not be correct immediately.)
    const playerTexture = this.textures.get('player').getSourceImage();
    const originalHeight = playerTexture.height; // original image height
    const scale = 0.2;
    const scaledHeight = originalHeight * scale;

    // With the sprite’s origin at (0.5, 0.5), its bottom edge is at (player.y + scaledHeight/2).
    // To have the bottom exactly at platformTop, set:
    const playerY = platformTop - scaledHeight / 2;

    // Create the player at (100, playerY)
    this.player = this.physics.add.sprite(100, playerY, 'player');
    this.player.setScale(scale);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(1000);
    this.player.setDepth(3);

    // Do not adjust the physics body manually – use the default body.
    // (This ensures the physics body matches the scaled sprite exactly.)
    this.player.setFlipX(true);
  }

  setupGoal() {
    const platformY = window.innerHeight - 40;
    const goalY = platformY - 60; // position goal above the platform
    this.goal = this.physics.add.sprite(this.levelWidth - 100, goalY, 'goal');
    this.goal.setScale(0.3);
    this.goal.setImmovable(true);
    this.goal.body.setAllowGravity(false);
    this.goal.setDepth(3);
  }

  setupEnemies() {
    this.enemies = this.physics.add.group();
    
    // Create some patrolling enemies.
    const enemyPositions = [
      { x: 600, y: window.innerHeight - 80 },
      { x: 1200, y: window.innerHeight - 80 },
      { x: 1800, y: window.innerHeight - 80 }
    ];
    
    enemyPositions.forEach(pos => {
      const enemy = this.enemies.create(pos.x, pos.y, 'obstacleFrog');
      enemy.setScale(0.15);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(100);
      enemy.patrolPoint = pos.x;
      enemy.patrolDistance = 200;
      enemy.setDepth(3);
    });
  }

  setupCollectibles() {
    this.coins = this.physics.add.group();
    
    // Create coins in a pattern.
    for (let i = 0; i < 20; i++) {
      const x = 300 + i * 150;
      const y = window.innerHeight - 150 - Math.sin(i * 0.5) * 100;
      const coin = this.coins.create(x, y, 'coin');
      coin.setScale(0.5);
      coin.setBounceY(0.2);
      coin.setDepth(2);
      
      // Add a floating animation.
      this.tweens.add({
        targets: coin,
        y: y - 10,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  setupCollisions() {
    // Set up collisions between player and the static ground.
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.enemies, this.ground);
    
    // Set up overlap collisions for the goal, enemies, and coins.
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  }

  setupUI() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '18px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    })
      .setScrollFactor(0)
      .setDepth(5);

    this.gameOverText = this.add.text(window.innerWidth / 2, window.innerHeight / 2,
      'Game Over!\nPress SPACE to restart', {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 20, y: 10 },
        align: 'center'
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setVisible(false)
      .setDepth(5);

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.gameOver) {
        this.scene.restart();
      }
    });
  }

  reachGoal(player, goal) {
    if (!this.gameOver) {
      this.gameOver = true;
      this.scoreText.setText('Level Complete!\nScore: ' + this.score);
      player.setTint(0x00ff00);
      this.gameOverText.setText('Level Complete!\nPress SPACE to play again')
        .setVisible(true);
      player.setVelocityX(0);
    }
  }

  hitEnemy(player, enemy) {
    const playerBottom = player.body.bottom;
    const enemyTop = enemy.body.top;
    
    if (playerBottom < enemyTop + 10) {
      // Bounce the player off and destroy the enemy.
      player.setVelocityY(this.JUMP_VELOCITY * 0.7);
      enemy.destroy();
      this.score += 100;
      this.scoreText.setText('Score: ' + this.score);
    } else {
      // Otherwise, the player dies.
      this.handlePlayerDeath();
    }
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    
    // Add a particle effect for coin collection.
    const particles = this.add.particles(coin.x, coin.y, 'coin', {
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.4, end: 0 },
      lifespan: 500,
      quantity: 1,
      frequency: 100,
      maxParticles: 5
    });
    
    this.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  handlePlayerDeath() {
    if (!this.gameOver) {
      this.gameOver = true;
      this.player.setTint(0xff0000);
      this.player.setVelocityX(0);
      this.player.setAccelerationX(0);
      
      this.tweens.add({
        targets: this.player,
        alpha: 0.5,
        yoyo: true,
        repeat: 2,
        duration: 200,
        onComplete: () => {
          this.gameOverText.setVisible(true);
        }
      });
    }
  }

  update(time, delta) {
    if (this.gameOver) return;

    this.handlePlayerMovement(time);
    this.updateEnemies();
    
    // Update background trees for a parallax effect.
    this.backgroundTrees.forEach((tree, index) => {
      const treeX = (index * 400) - (this.cameras.main.scrollX * 0.5) % 8000;
      tree.x = treeX < this.cameras.main.scrollX - 400 ? treeX + 8000 : treeX;
    });
  }

  handlePlayerMovement(time) {
    // Use blocked.down for reliable ground detection.
    const onGround = this.player.body.blocked.down;
    
    // Horizontal movement.
    if (this.cursors.left.isDown) {
      this.player.setAccelerationX(-this.ACCELERATION);
      if (this.playerFacingRight) {
        this.player.setFlipX(false);
        this.playerFacingRight = false;
      }
    } else if (this.cursors.right.isDown) {
      this.player.setAccelerationX(this.ACCELERATION);
      if (!this.playerFacingRight) {
        this.player.setFlipX(true);
        this.playerFacingRight = true;
      }
    } else {
      this.player.setAccelerationX(0);
    }

    // Variable height jumping.
    if (this.cursors.up.isDown && onGround && !this.isJumping) {
      this.player.setVelocityY(this.JUMP_VELOCITY);
      this.isJumping = true;
      this.jumpTimer = time;
    } else if (this.cursors.up.isDown && this.isJumping) {
      if (time - this.jumpTimer < this.JUMP_HOLD_DURATION) {
        this.player.setVelocityY(this.JUMP_VELOCITY);
      }
    } else if (this.cursors.up.isUp) {
      this.isJumping = false;
      if (this.player.body.velocity.y < this.MIN_JUMP_VELOCITY) {
        this.player.setVelocityY(this.MIN_JUMP_VELOCITY);
      }
    }

    if (onGround) {
      this.isJumping = false;
    }
  }

  updateEnemies() {
    this.enemies.children.iterate(enemy => {
      if (enemy.x < enemy.patrolPoint - enemy.patrolDistance) {
        enemy.setVelocityX(100);
        enemy.setFlipX(false);
      } else if (enemy.x > enemy.patrolPoint + enemy.patrolDistance) {
        enemy.setVelocityX(-100);
        enemy.setFlipX(true);
      }
    });
  }
}
