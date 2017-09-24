import * as Phaser from 'phaser-ce';
import PerlinNoise from '../sprites/PerlinNoise';

class PlayState extends Phaser.State {

  private _perlinNoise: PerlinNoise;

  public create(): void {
    this.game.time.advancedTiming = true;
    this.stage.backgroundColor = 0x000000;
    this._perlinNoise = new PerlinNoise(this.game);
    this.camera.bounds = null;
    this.world.add(this._perlinNoise);
  }

  public render(): void {
    this.game.debug.text((this.game.time.fps.toString() || '--') + 'fps', 2, 14, '#00ff00');
    this.updatePhysics();
  }

  public updatePhysics(): void {
    // TODO: Complete
    this._perlinNoise.render();
  }
}

export default PlayState;
