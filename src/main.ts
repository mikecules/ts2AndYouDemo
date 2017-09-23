// Assets
import '../www/css/main.css';
import '../www/index.html';
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
  public blah: boolean;

  private _secret: any;

  constructor() {
    const docElement = document.documentElement;
    const width = Math.min(Config.gameContainer.width, docElement.clientWidth);
    const height = Math.min(Config.gameContainer.height, docElement.clientHeight);

    super(width, height, Phaser.CANVAS, Config.gameContainer.id, null);

    this.state.add('Boot', BootState, false);
    this.state.add('Preload', PreloadState, false);
    this.state.add('Play', PlayState, false);

    this.state.start('Boot');
    this.blah = true;
    this._secret = 'this is secret!';
  }
}

declare global {
    interface Window { game: Game; }
}

window.game = window.game || new Game();
