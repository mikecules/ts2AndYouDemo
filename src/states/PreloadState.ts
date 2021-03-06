import * as Phaser from 'phaser-ce';
import StarfieldBackground from '../layers/StarFieldBackground';
import CosmicEd from '../sprites/CosmicEd';

class PreloadState extends Phaser.State {
  private _isGameReady: boolean = false;

  public preload(): void {
    this.load.image(StarfieldBackground.ID, 'assets/images/star.png');
    this.load.image(CosmicEd.ID, 'assets/images/edWiz.png');
  }

  public update(): void {
    if (this._isGameReady === false) {
      this._isGameReady = true;
      this.game.state.start('Play');
    }
  }
}

export default PreloadState;
