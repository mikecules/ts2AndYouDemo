// Assets
import '../www/css/main.css';
import '../www/index.html';
import '../assets/images/star.png';
import '../assets/images/edWiz.png';
///

// Import the Phaser libs
import 'p2';
import 'pixi';

// 'phaser-ce' resolves to the 'phaser.comments.d.ts' declaration file in node_modules
import * as Phaser from 'phaser-ce';

// States
import BootState from './states/BootState';
import PlayState from './states/PlayState';
import PreloadState from './states/PreloadState';

// Config
import Config from './config/Config';

class Game extends Phaser.Game {

  constructor() {
    const docElement: HTMLElement = document.documentElement;
    const width: number = Math.min(Config.gameContainer.width, docElement.clientWidth);
    const height: number = Math.min(Config.gameContainer.height, docElement.clientHeight);

    super(width, height, Config.phaserOptions.renderer, Config.gameContainer.id, null);

    this.state.add('Boot', BootState, false);
    this.state.add('Preload', PreloadState, false);
    this.state.add('Play', PlayState, false);

    this.state.start('Boot');
  }
}

declare global {
    interface Window { game: Game; }
}

window.game = window.game || new Game();
