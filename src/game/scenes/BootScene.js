import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load initial assets needed for loading screen
    this.load.image('logo', 'path-to-your-logo.png');
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
