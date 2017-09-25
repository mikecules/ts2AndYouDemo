import * as Phaser from 'phaser-ce';
import StarfieldBackground from '../layers/StarFieldBackground';

class PreloadState extends Phaser.State {
  private _isGameReady: boolean = false;

  public preload(): void {
    this.load.image(StarfieldBackground.STAR_ID, 'assets/images/star.png');
  }

  public update(): void {
    if (this._isGameReady === false) {
      this._isGameReady = true;
      this.game.state.start('Play');
    }
  }
}

export default PreloadState;
