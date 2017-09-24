import * as Phaser from 'phaser-ce';

class PreloadState extends Phaser.State {
  private _isGameReady: boolean = false;

  public preload(): void {
    // TODO: loading stuff
  }

  public update(): void {
    if (this._isGameReady === false) {
      this._isGameReady = true;
      this.game.state.start('Play');
    }
  }
}

export default PreloadState;
