import Phaser from 'phaser';

import treeSprite from '../../assets/backgrounds/tree.png';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.ground = null;
    this.goal = null;
    this.platforms = null;
    this.obstacles = null;
    this.gameOver = false;
    this.score = 0;
    this.levelWidth = 3200;
    this.MOVEMENT_SPEED = 200;
    this.JUMP_VELOCITY = -700;
    this.backgroundTrees = [];
    this.playerFacingRight = false;
  }

  init() {
    this.gameOver = false;
    this.score = 0;
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

  preload() {
    this.load.image('tree', treeSprite);
  }

  create() {
    this.gameOver = false;
    this.score = 0;
    
    this.physics.world.setBounds(0, 0, this.levelWidth, window.innerHeight);
    
    this.createGradientBackground();

    // Create trees
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

    // Create ground
    const groundY = window.innerHeight - 40;
    this.ground = this.physics.add.staticImage(this.levelWidth / 2, groundY, 'platform');
    this.ground.setDisplaySize(this.levelWidth, 20);
    this.ground.setImmovable(true);
    this.ground.refreshBody();
    this.ground.setDepth(2);
    this.ground.setTint(0xFFFFFF);
    
    // Create player
    const playerStartY = groundY - 60;
    this.player = this.physics.add.sprite(100, playerStartY, 'player');
    this.player.setScale(0.2);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(1000);
    this.player.setDepth(3);
    
    // Adjust player hitbox
    this.player.body.setSize(
      this.player.width * 0.3,
      this.player.height * 0.8
    );
    this.player.body.setOffset(
      this.player.width * 0.35,
      this.player.height * 0.2
    );
    
    this.setupGameObjects();
    this.setupPlatforms();
    this.setupUI();
    
    // Set up camera with deadzone
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setDeadzone(100, 100);
    this.cameras.main.setBounds(0, 0, this.levelWidth, window.innerHeight);
    
    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setupGameObjects() {
    const playerStartY = window.innerHeight - 100;
    
    // Create goal
    this.goal = this.physics.add.sprite(this.levelWidth - 100, playerStartY, 'goal');
    this.goal.setScale(0.3);
    this.goal.setImmovable(true);
    this.goal.body.setAllowGravity(false);
    this.goal.setDepth(3);
    
    // Create obstacles group
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    
    // Set up collisions
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
  }

  setupPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    
    const platformPositions = [
      { x: 400, y: window.innerHeight - 150 },
      { x: 800, y: window.innerHeight - 250 },
      { x: 1200, y: window.innerHeight - 180 },
      { x: 1600, y: window.innerHeight - 300 },
      { x: 2000, y: window.innerHeight - 200 }
    ];

    platformPositions.forEach(pos => {
      const platform = this.platforms.create(pos.x, pos.y, 'platform');
      platform.setScale(0.5, 0.3).refreshBody();
      platform.setDepth(2);
      platform.setTint(0xFFFFFF);
      platform.clearTint();
      platform.setTint(0xFFFFFF);
    });

    this.physics.add.collider(this.player, this.platforms);
  }

  setupUI() {
    this.scoreText = this.add.text(16, 16, 'Distance: 0m', {
      fontSize: '18px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    })
    .setScrollFactor(0)
    .setDepth(5);

    this.gameOverText = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Game Over!\nPress SPACE to restart', {
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
      this.scoreText.setText('Level Complete!\nDistance: ' + Math.floor(this.score) + 'm');
      player.setTint(0x00ff00);
      this.gameOverText
        .setText('Level Complete!\nPress SPACE to play again')
        .setVisible(true);
      player.setVelocityX(0);
    }
  }

  hitObstacle(player, obstacle) {
    if (!this.gameOver) {
      this.gameOver = true;
      player.setTint(0xff0000);
      player.setVelocityX(0);
      
      this.tweens.add({
        targets: player,
        alpha: 0.5,
        yoyo: true,
        repeat: 2,
        duration: 200
      });
      
      this.gameOverText.setVisible(true);
    }
  }

  update() {
    if (this.gameOver) return;

    // Handle horizontal movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.MOVEMENT_SPEED);
      if (this.playerFacingRight) {
        this.player.setFlipX(false);
        this.playerFacingRight = false;
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.MOVEMENT_SPEED);
      if (!this.playerFacingRight) {
        this.player.setFlipX(true);
        this.playerFacingRight = true;
      }
    } else {
      // Decelerate when no movement keys are pressed
      this.player.setVelocityX(0);
    }

    // Handle jumping
    const canJump = this.player.body.touching.down || this.player.body.blocked.down;
    if (this.cursors.up.isDown && canJump) {
      this.player.setVelocityY(this.JUMP_VELOCITY);
      
      // Jump squash and stretch animation
      this.tweens.add({
        targets: this.player,
        scaleX: 0.22,
        scaleY: 0.18,
        duration: 100,
        yoyo: true
      });
    }

    // Update score based on maximum distance reached
    const currentDistance = Math.floor(this.player.x / 50);
    if (currentDistance > this.score) {
      this.score = currentDistance;
      this.scoreText.setText('Distance: ' + this.score + 'm');
    }

    // Update background trees
    this.backgroundTrees.forEach((tree, index) => {
      const treeX = (index * 400) - (this.cameras.main.scrollX * 0.5) % 8000;
      tree.x = treeX < this.cameras.main.scrollX - 400 ? treeX + 8000 : treeX;
    });
  }
}