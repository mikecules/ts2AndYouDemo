import 'pixi';
import 'p2';
import * as Phaser from 'phaser-ce';
import '../www/index.html';
import '../www/css/main.css';

declare global {
  interface Window { game: any; }
}

window.game = window.game || {};

import BootState from './states/BootState';
import PreloadState from './states/PreloadState';
import PlayState from './states/PlayState';

import Config from './config/Config';

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement;
    const width = Math.min(Config.width, docElement.clientWidth);
    const height = Math.min(Config.height, docElement.clientHeight);

    super(width, height, Phaser.CANVAS, 'game-container', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Preload', PreloadState, false);
    this.state.add('Play', PlayState, false);

    this.state.start('Boot');
  }
}

window.game = new Game();
