import * as Phaser from 'phaser-ce';
import Config from '../config/Config';

class BootState extends Phaser.State {
  private _userScale: Phaser.Point = new Phaser.Point(1, 1);
  private _gameDimensions: Phaser.Point = new Phaser.Point();

  public create() {
    this.game.state.start('Preload');
  }

  public init(): void {
    this._calculateGameDimensions();
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(this._userScale.x, this._userScale.y);

    // center our game canvas on the page
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.scale.setResizeCallback(this._gameResizedHandler, this);

    if (!this.game.device.desktop) {
      this.scale.forceOrientation(true, false);
      this.scale.onOrientationChange.add(this._orientationChangeHandler, this);
    }
  }

  private _calculateGameDimensions(): void {
    const winWidth: number = window.innerWidth;
    const winHeight: number = window.innerHeight;

    // add .01 line because of number precision
    const scaleY: number = (winHeight + .01) / Config.gameContainer.height;

    // Get game width with dividing window width with scale y (we want scale y
    // to be equal to scale x to avoid stretching).
    // Adjust scale x in the same way...
    const gameWidth: number = Math.round(winWidth / scaleY);
    const scaleX: number = (winWidth + .01) / gameWidth;

    // save new computed values
    this._userScale.set(scaleY, scaleX);
    this._gameDimensions.set(gameWidth, Config.gameContainer.height);
  }

  private _gameResizedHandler(scaleManger: Phaser.ScaleManager): void {

    if (scaleManger.incorrectOrientation) {
      return;
    }

    const oldScaleX = this._userScale.x;
    const oldScaleY = this._userScale.y;

    // recalculate game dims
    this._calculateGameDimensions();

    const newGameDimensions: Phaser.Point = this._gameDimensions;
    const diffThreshold: number = 0.001;
    const newGameScale: Phaser.Point = this._userScale;

    // any changes made in our dimensions or our scale
    if (
      newGameDimensions.x !== this.game.width ||
      newGameDimensions.y !== this.game.height ||
      Math.abs(newGameScale.x - oldScaleX) > diffThreshold ||
      Math.abs(newGameScale.y - oldScaleY) > diffThreshold
    ) {

      // set new game size and new scale parameters
      this.scale.setGameSize(newGameDimensions.x, newGameDimensions.y);
      this.scale.setUserScale(newGameScale.x, newGameScale.y);

      // has current state onResize method? If yes call it.
      const currentState: Phaser.State = this.game.state.getCurrentState();

      if (typeof (currentState as any).onResize === 'function') {
        (currentState as any).onResize(newGameDimensions.x, newGameDimensions.y);
      }
    }
  }

  private _orientationChangeHandler(scaleManger: Phaser.ScaleManager): void {
    const currentState: Phaser.State = this.game.state.getCurrentState();

    if (scaleManger.isLandscape) {
      this._pauseGame(currentState);
    } else {
      this._resumeGame(currentState);
    }
  }

  private _pauseGame(currentState: any): void {
    // Invoke the game's pause handler...
    if (typeof currentState.onPause === 'function') {
      (currentState as any).onPause();
    }
  }

  private _resumeGame(currentState: any): void {
    // Revoke the game's pause state...
    if (typeof currentState.onResume === 'function') {
      (currentState as any).onResume();
    }
  }
}

export default BootState;
