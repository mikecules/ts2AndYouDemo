import * as Phaser from 'phaser-ce';

export class StarFieldBackground extends Phaser.Group {
  public static MAX_STARS: number = 25;
  public static STAR_DIST_MIN: number= 0;
  public static STAR_DIST_MAX: number = 25;
  public static ID: string = 'stars';

  private _closerStars: Phaser.Group;
  private _fartherStars: Phaser.Group;
  private _starWidth: number = 0;
  private _nextFarthestStarX: number = 0;
  private _nextClosestStarX: number = 0;
  private _prevX: number = -1;

  public constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
    super(game, parent);

    this._starWidth = this.game.cache.getImage(StarFieldBackground.ID).width;

    this._fartherStars = new Phaser.Group(game, this);
    this._fartherStars.createMultiple(
      Math.round(StarFieldBackground.MAX_STARS * 3),
      StarFieldBackground.ID,
      0,
      true);

    this._closerStars = new Phaser.Group(game, this);
    this._closerStars.createMultiple(StarFieldBackground.MAX_STARS, StarFieldBackground.ID, 0, true);

    this._closerStars.forEach( (star: Phaser.Sprite) => {
      star.scale = new Phaser.Point(1.1, 1.1);
    }, this);

  }

  public render(x: number): void {

    if (this._prevX < x) {
      this._manageStars(x * 0.5);
    }

    this._prevX = x;
  }

  private _manageStars(x: number) {

    this._closerStars.x = x;
    this._fartherStars.x = x;

    // remove old
    this._closerStars.forEachExists((star: Phaser.Sprite) => {

      star.x--;

      if (star.x < (x - this._starWidth)) {
        star.exists = false;
      }
    }, this);

    this._fartherStars.forEachExists((star: Phaser.Sprite) => {

      if (star.x < (x - this._starWidth)) {
        star.exists = false;
      }
    }, this);

    const screenX: number = x + this.game.width;

    while (this._nextFarthestStarX < screenX) {
      // save new star position
      const starX = this._nextFarthestStarX;

      // calculate position for next star
      this._nextFarthestStarX += this.game.rnd.integerInRange(
        StarFieldBackground.STAR_DIST_MIN, StarFieldBackground.STAR_DIST_MAX
      );

      // get unused tree sprite
      const star: Phaser.Sprite = this._fartherStars.getFirstExists(false) as Phaser.Sprite;
      // if no free sprites, exit loop
      if (star === null) {
        break;
      }

      // position tree and make it exist
      star.x = starX;
      star.y = this.game.rnd.integerInRange(0, this.game.height);
      star.exists = true;
    }

    // add new tree(s)
    while (this._nextClosestStarX < screenX) {
      // save new tree position
      const starX = this._nextClosestStarX;

      // calcultate position for next tree
      this._nextClosestStarX += this.game.rnd.integerInRange(
        StarFieldBackground.STAR_DIST_MIN, StarFieldBackground.STAR_DIST_MAX
      );

      // get unused tree sprite
      const star: Phaser.Sprite = this._closerStars.getFirstExists(false) as Phaser.Sprite;
      // if no free sprites, exit loop
      if (star === null) {
        break;
      }

      // position tree and make it exist
      star.x = starX;
      star.y = this.game.rnd.integerInRange(0, this.game.height);
      star.exists = true;
    }

  }
}

export default StarFieldBackground;
