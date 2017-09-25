import * as Phaser from 'phaser-ce';

class CosmicEd extends Phaser.Sprite {
  public static ID = 'cosmic_ed';
  private _isInTween: boolean = false;

  public constructor(game: Phaser.Game) {
    super(game, game.width / 2, game.height / 2, CosmicEd.ID);
  }

  public tweenEd(onUpdate: (step: number) => void,
                 time: number = 250,
                 callback: (f?: any) => any = (f) => f) {

    const steps: any = { step: 0 };
    const tween: Phaser.Tween = this.game.add.tween(steps).to({ step: 100 }, time);

    tween.onUpdateCallback(() => {
      onUpdate(steps.step);
    });

    if (callback) {
      tween.onComplete.add(() => {
        callback();
      });
    }

    tween.start();
  }

  public render() {
    if (!this._isInTween) {
      this._animate();
    }
  }

  private _animate() {
    const startColour: number = 0x111111;
    const endColour: number = 0xffffff;
    const startScale: number = 0.0;
    const endScale: number = 0.4;
    const tMS: number = 1000 * 60;

    const colourFn1: (step: number) => void = (step: number) => {
      this.tint = Phaser.Color.interpolateColor(startColour, endColour, 100, step);
    };

    const colourFn2: (step: number) => void = (step: number) => {
      this.tint = Phaser.Color.interpolateColor(endColour, startColour , 100, step);
    };

    const scaleFn1: (step: number) => void = (step: number) => {
      this.scale.set(Phaser.Math.linearInterpolation([startScale, endScale], step / 100));
    };

    const scaleFn2: (step: number) => void = (step: number) => {
      this.scale.set(Phaser.Math.linearInterpolation([endScale, startScale], step / 100));
    };

    this._isInTween = true;
    this.tint = startColour;
    this.scale.set(startScale);

    this.tweenEd(colourFn1, tMS, () => this.tweenEd(colourFn2, tMS));
    this.tweenEd(scaleFn1, tMS, () => this.tweenEd(scaleFn2, tMS, () => this._isInTween = false));
  }
}

export default CosmicEd;
