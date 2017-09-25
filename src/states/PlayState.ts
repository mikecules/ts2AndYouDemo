import * as Phaser from 'phaser-ce';
import ChaosStar from '../sprites/ChaosStar';
import StarFieldBackground from '../layers/StarFieldBackground';

class PlayState extends Phaser.State {
  public static VELOCITY_X: number = 180;

  private _chaosStar: ChaosStar;
  private _backgroundLayer: StarFieldBackground;

  public create(): void {
    this.game.time.advancedTiming = true;
    this.stage.backgroundColor = 0x000000;
    this._chaosStar = new ChaosStar(this.game);
    this.camera.bounds = null;

    this._backgroundLayer = new StarFieldBackground(this.game, this.world);
    this.world.add(this._chaosStar);
  }

  public update(): void {
    this.game.debug.text((this.game.time.fps.toString() || '--') + 'fps', 2, 14, '#00ff00');
    this.updatePhysics();
    this.camera.x += this.time.physicsElapsed * PlayState.VELOCITY_X;
    this._backgroundLayer.render(this.camera.x);
  }

  public updatePhysics(): void {
    // TODO: Complete
    this._chaosStar.render();
  }
}

export default PlayState;
