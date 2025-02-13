export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // We don't actually need to load a logo for the boot scene
    // Just proceed to the preload scene
  }

  create() {
    this.scene.start('PreloadScene');
  }
}