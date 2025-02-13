import Phaser from 'phaser';

import characterSprite from '../../assets/sprites/placeholder-character.png';
import platformSprite from '../../assets/sprites/platform.png';
import goalSprite from '../../assets/sprites/goal.png';
import frogSprite from '../../assets/sprites/obstacle-frog.png';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Debug logging
    console.log('PreloadScene: Starting asset load');
    
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

    // Add loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px monospace',
      fill: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);

    // Load game assets
    this.load.on('filecomplete', (key) => {
      console.log('Loaded asset:', key);
    });

    // Load the assets with explicit dimensions
    this.load.image('player', characterSprite);
    this.load.image('platform', platformSprite);
    this.load.image('goal', goalSprite);
    this.load.image('obstacleFrog', frogSprite);

    // Update the progress bar
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
    });

    this.load.on('complete', () => {
      console.log('PreloadScene: All assets loaded');
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  create() {
    console.log('PreloadScene: Starting GameScene');
    this.scene.start('GameScene');
  }
}