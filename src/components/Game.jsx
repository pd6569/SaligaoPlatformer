import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../game/config';
import { BootScene } from '../game/scenes/BootScene';
import { PreloadScene } from '../game/scenes/PreloadScene';
import { GameScene } from '../game/scenes/GameScene';

const Game = () => {
  useEffect(() => {
    const config = {
      ...gameConfig,
      scene: [BootScene, PreloadScene, GameScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container"></div>;
};

export default Game;