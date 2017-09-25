import * as Phaser from 'phaser-ce';
import PerlinNoise from '../sprites/ChaosStar';
import StarFieldBackground from '../layers/StarFieldBackground';

class PlayState extends Phaser.State {
  public static VELOCITY_X: number = 180;

  private _perlinNoise: PerlinNoise;
  private _backgroundLayer: StarFieldBackground;

  public create(): void {
    this.game.time.advancedTiming = true;
    this.stage.backgroundColor = 0x000000;
    this._perlinNoise = new PerlinNoise(this.game);
    this.camera.bounds = null;

    this._backgroundLayer = new StarFieldBackground(this.game, this.world);
    this.world.add(this._perlinNoise);
  }

  public update(): void {
    this.game.debug.text((this.game.time.fps.toString() || '--') + 'fps', 2, 14, '#00ff00');
    this.updatePhysics();
    this.camera.x += this.time.physicsElapsed * PlayState.VELOCITY_X;
    this._backgroundLayer.render(this.camera.x);
  }

  public updatePhysics(): void {
    // TODO: Complete
    this._perlinNoise.render();
  }
}

export default PlayState;
