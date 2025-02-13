// game.config.js
import Phaser from 'phaser';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 }, // Increased gravity for faster falling
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Add window resize handler
window.addEventListener('resize', () => {
  if (window.game) {
    window.game.scale.resize(window.innerWidth, window.innerHeight);
  }
});