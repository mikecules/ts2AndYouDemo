import * as Phaser from 'phaser-ce';
import ChaosStar from '../sprites/ChaosStar';
import CosmicEd from '../sprites/CosmicEd';
import StarFieldBackground from '../layers/StarFieldBackground';

class PlayState extends Phaser.State {
  public static VELOCITY_X: number = 180;

  private _chaosStar: ChaosStar;
  private _cosmicEd: CosmicEd;
  private _backgroundLayer: StarFieldBackground;

  public create(): void {
    this.game.time.advancedTiming = true;
    this.stage.backgroundColor = 0x000000;
    this._chaosStar = new ChaosStar(this.game);
    this.camera.bounds = null;

    this._cosmicEd = new CosmicEd(this.game);
    this._cosmicEd.scale.set(0.4);
    this._backgroundLayer = new StarFieldBackground(this.game, this.world);
    this.world.add(this._chaosStar);
    this.world.add(this._cosmicEd);
  }

  public update(): void {
    this.game.debug.text((this.game.time.fps.toString() || '--') + 'fps', 2, 14, '#00ff00');
    this.updatePhysics();
    this.camera.x += this.time.physicsElapsed * PlayState.VELOCITY_X;
    this._backgroundLayer.render(this.camera.x);
    this._cosmicEd.x = this.camera.x + (this.game.width - this._cosmicEd.width)/2 ;
    this._cosmicEd.y = (this.game.height - this._cosmicEd.height)/2;
    this._cosmicEd.render();
  }

  public updatePhysics(): void {
    // TODO: Complete
    this._chaosStar.render();
  }
}

export default PlayState;
