import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.platforms = null;
  }

  create() {
    // Set background color
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Create platforms group
    this.platforms = this.physics.add.staticGroup();
    
    // Create ground platform
    this.platforms.create(400, 550, 'platform')
      .setScale(2)
      .refreshBody();
    
    // Create some floating platforms
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    // Create player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setScale(0.5); // Scale down the player sprite if needed
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Add collider between player and platforms
    this.physics.add.collider(this.player, this.platforms);

    // Set up controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add debug text
    this.add.text(16, 16, 'Use arrow keys to move & jump', {
      fontSize: '18px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}