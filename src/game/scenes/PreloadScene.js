import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Add loading bar here
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    // Load game assets
    this.load.image('player', '/assets/sprites/placeholder-character.png');
    this.load.image('platform', '/assets/sprites/platform.png');
    // Add more asset loading here
  }

  create() {
    this.scene.start('GameScene');
  }
}
