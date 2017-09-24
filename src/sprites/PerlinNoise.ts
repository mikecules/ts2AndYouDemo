import * as Phaser from 'phaser-ce';

class PerlinNoise extends Phaser.Sprite {

  public static TEXTURE_WIDTH: number = 256;
  public static FILTER_UNIFORM_VEC_LEN: number = 4;


  public static OLD_FRAGMENT_SHADER: string[] | string = [
    "precision mediump float;",

    "uniform vec2      resolution;",
    "uniform float     time;",

    "#define PI 90",

    "void main( void ) {",

    "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.0;",

    "float sx = 0.5 + 0.5 * sin( 100.0 * p.x - 1. * pow(time, 0.5)*5.) * sin( 5.0 * p.x - 1. * pow(time, 0.9)*5.);",

    "float dy = 1.0/ ( 1000. * abs(p.y - sx));",

    "dy += 1./ (25. * length(p - vec2(p.x, 0.)));",

    "gl_FragColor = vec4( (p.x + 0.3) * dy, 0.3 * dy, dy, 1.1 );",

    "}"

  ];

  // adapted from https://gpfault.net/posts/perlin-noise.txt.html
  public static FRAGMENT_SHADER: string[] | string = [`
  
precision mediump float;
  
#define TEXTURE_WIDTH ${PerlinNoise.TEXTURE_WIDTH}.0

uniform sampler2D iChannel0;
uniform float time;

vec3 gradient(vec3 p) {
	vec4 v = texture2D(iChannel0, vec2((p.x+p.z) / TEXTURE_WIDTH, (p.y-p.z) / TEXTURE_WIDTH));
    return normalize(v.xyz*2.0 - vec3(1.0));
}

/* S-shaped curve for 0 <= t <= 1 */
float fade(float t) {
  return t*t*t*(t*(t*6.0 - 15.0) + 10.0);
}


/* 3D noise */
float noise(vec3 p) {
  /* Calculate lattice points. */
  vec3 p0 = floor(p);
  vec3 p1 = p0 + vec3(1.0, 0.0, 0.0);
  vec3 p2 = p0 + vec3(0.0, 1.0, 0.0);
  vec3 p3 = p0 + vec3(1.0, 1.0, 0.0);
  vec3 p4 = p0 + vec3(0.0, 0.0, 1.0);
  vec3 p5 = p4 + vec3(1.0, 0.0, 0.0);
  vec3 p6 = p4 + vec3(0.0, 1.0, 0.0);
  vec3 p7 = p4 + vec3(1.0, 1.0, 0.0);
    
  /* Look up gradients at lattice points. */
  vec3 g0 = gradient(p0);
  vec3 g1 = gradient(p1);
  vec3 g2 = gradient(p2);
  vec3 g3 = gradient(p3);
  vec3 g4 = gradient(p4);
  vec3 g5 = gradient(p5);
  vec3 g6 = gradient(p6);
  vec3 g7 = gradient(p7);
    
  float t0 = p.x - p0.x;
  float fade_t0 = fade(t0); /* Used for interpolation in horizontal direction */

  float t1 = p.y - p0.y;
  float fade_t1 = fade(t1); /* Used for interpolation in vertical direction. */
    
  float t2 = p.z - p0.z;
  float fade_t2 = fade(t2);

  /* Calculate dot products and interpolate.*/
  float p0p1 = (1.0 - fade_t0) * dot(g0, (p - p0)) + fade_t0 * dot(g1, (p - p1)); 
  /* between upper two lattice points */
  float p2p3 = (1.0 - fade_t0) * dot(g2, (p - p2)) + fade_t0 * dot(g3, (p - p3)); 
  /* between lower two lattice points */

  float p4p5 = (1.0 - fade_t0) * dot(g4, (p - p4)) + fade_t0 * dot(g5, (p - p5)); 
  
  /* between upper two lattice points */
  float p6p7 = (1.0 - fade_t0) * dot(g6, (p - p6)) + fade_t0 * dot(g7, (p - p7)); 
  /* between lower two lattice points */

  float y1 = (1.0 - fade_t1) * p0p1 + fade_t1 * p2p3;
  float y2 = (1.0 - fade_t1) * p4p5 + fade_t1 * p6p7;

  /* Calculate final result */
  return (1.0 - fade_t2) * y1 + fade_t2 * y2;
}

void main(void)
{
    float n = noise(vec3(gl_FragCoord.xy, time * 30.0)/128.0)/ 1.0 +
        noise(vec3(gl_FragCoord.xy, time * 30.0)/64.0) / 2.0 +
        noise(vec3(gl_FragCoord.xy, time * 64.0)/32.0) / 16.0;
        
	gl_FragColor = vec4(
	    mix(mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.2, 0.0), n + 1.0), 
	    vec3(0.1, 0.0, 0.0), n*0.5 + 0.5), 
	    1.0);
}

`];

  public static FILTER_UNIFORM: any = {
    iChannel0: {
      type: 'sampler2D',
      value: null, // sprite.texture
      textureData: { repeat: true },
    },
  };

  private _filter: Phaser.Filter;
  private _gameDimensions: Phaser.Point = new Phaser.Point(0, 0);
  private _bmpData: Phaser.BitmapData;

  constructor(game: Phaser.Game, x?: number, y?: number) {
    super(game, x, y);
    this._bmpData = new Phaser.BitmapData(game, '_bmp', PerlinNoise.TEXTURE_WIDTH,  PerlinNoise.TEXTURE_WIDTH, true);

    const filterUniform = this._initFilterVec4Uniform();

    this._filter = new Phaser.Filter(game, filterUniform, PerlinNoise.FRAGMENT_SHADER);

    this.filters = [this._filter];
  }

  public render() {
    const shouldUpdateRes: boolean = this.game.width !== this._gameDimensions.x ||
      this.game.height !== this._gameDimensions.y;

    if (shouldUpdateRes) {
      this._gameDimensions.x = this.game.width;
      this._gameDimensions.y = this.game.height;
      this.height = this.game.height;
      this.width = this.game.width;
      this._filter.setResolution(this.game.width, this.game.height);
    }

    this._filter.update();
  }

  private _initFilterVec4Uniform(): any {
    const uniformObj: any = {
        ...PerlinNoise.FILTER_UNIFORM,
    };

    this._a(this._initVecPermutations(PerlinNoise.TEXTURE_WIDTH));
    const sprite: Phaser.Sprite = new Phaser.Sprite(this.game, 0 , 0, this._bmpData);
    //this.game.add.sprite(100, 100, this._bmpData);

    uniformObj.iChannel0.value = sprite.texture;

    return uniformObj;
  }

  private _a(data: number[]) {
    const ctx: any = this._bmpData.ctx;

    let x = 0;
    let y = 0;

    for (let i = 0; i < data.length; i = i + PerlinNoise.FILTER_UNIFORM_VEC_LEN) {
      const r: number = data[i];
      const g: number = data[i + 1];
      const b: number = data[i + 2];

      const a: number = data[i + 3];

      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillRect(x, y, 1, 1);

      x = x + 1;

      if (x === PerlinNoise.TEXTURE_WIDTH) {
        y = y + 1;
        x = 0;
      }
    }
  }

  private _initVecPermutations(
    len: number, vecLen: number = PerlinNoise.FILTER_UNIFORM_VEC_LEN
  ): number[] {
    const vectorLength = vecLen || 4;
    const mat: number[] = [];
    let count = 0;

    for (let y = 0; y < len; y++) {
      for (let x = 0; x < len; x++) {
        for (let k = 0; k < vectorLength; k++) {
          let p = this.game.rnd.realInRange(0, 1);

          // the first 3 values represent rgb so keep the values between 0 and 255
          // the fourth is an alpha val so let it stay within the 0...1 range
          if (k <= (vectorLength - 2)) {
            p = Math.round(p * 255);
          }

          mat[count] = p;
          count++;
        }
      }
    }

    return mat;
  }

}

export default PerlinNoise;
