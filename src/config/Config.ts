import * as Phaser from 'phaser-ce';

interface GameContainer {
  id: string;
  height: number;
  width: number;
}

interface PhaserConfig {
  readonly antialias?: boolean;
  readonly multiTexture?: boolean;
  readonly renderer: any;
}

interface GameConfig {
  gameContainer: GameContainer;
  phaserOptions: PhaserConfig;
}

const CONFIG: GameConfig = {
  gameContainer: {
    id: 'game-container',
    width: 1024,
    height: 768,
  },
  phaserOptions: {
    renderer: Phaser.AUTO,
    antialias: true,
  },
};

export default CONFIG;
export { GameConfig, PhaserConfig };
