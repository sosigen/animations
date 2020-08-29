const rand = function (min: number, max: number, exclude?: number): number {
  let random = Math.floor(Math.random() * (max - min)) + min;
  if (random === exclude) {
    random = rand(min, max, exclude);
  }
  return random;
};

class Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  constructor(mX: number, mY: number, palette: string[], distance: number) {
    this.x = rand(mX - distance, mX + distance),
    this.y = rand(mY - distance, mY + distance),
    this.vx = rand(-5, 5, 0),
    this.vy = rand(-5, 5, 0),
    this.size = rand(5, 15),
    this.color = palette[rand(0, palette.length)],
    this.alpha = 1;
  }
  draw(c: CanvasRenderingContext2D) {
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fillStyle = this.color;
    c.fill();
  }
  transform() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.03;
  }
  validate(balls: Array<Ball>, canvas: HTMLCanvasElement) {
    if (
      this.y + this.vy + this.size > canvas.height ||
      this.y + this.vy + this.size < 0
    ) {
      balls.splice(balls.indexOf(this), 1);
    }
    if (
      this.x + this.vx + this.size > canvas.width ||
      this.x + this.vx + this.size < 0
    ) {
      balls.splice(balls.indexOf(this), 1);
    }
    if (this.alpha <= 0) balls.splice(balls.indexOf(this), 1);
  }
}

class Scene {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  constructor() {
    this.canvas = document.querySelector("canvas")!;
    this.c = this.canvas.getContext("2d")!;

    window.addEventListener("resize", this.resize);
    this.resize()
  }
  clear() {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  resize() {
    this.canvas.width = window.innerWidth -5;
    this.canvas.height = window.innerHeight -5;
    console.log(window.innerHeight, window.innerWidth)
  }
  getMousePosition(canvas: HTMLCanvasElement, event: any) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
class PaintManager {
  balls: Array<Ball>;
  palette: string[];
  scene: Scene;
  distance: number;
  fps: number;
  now: number;
  delta: number;
  then: number;
  interval: number;
  constructor() {
    this.balls = new Array(20);
    this.palette = ["#e09f7d", "#ef5d60", "#ec4067", "#a01a7d", "#311847"];
    this.scene = new Scene();
    this.distance = 20;
    this.fps = 60;
    this.now = 0;
    this.delta = 0;
    this.then = Date.now();
    this.interval = 1000 / this.fps;
  }

  init(event: Event) {
    
    let mouse_position = this.scene.getMousePosition(this.scene.canvas, event);
    let mX = mouse_position.x;
    let mY = mouse_position.y;
    this.balls = this.balls.concat(new Array(10));
    //for (let ball of this.balls) {
    for(let i=0; i< this.balls.length; i++){
      if (!this.balls[i]) {
        this.balls[i] = new Ball(mX, mY, this.palette, this.distance);
      }
    }
    window.requestAnimationFrame(this.draw);
  }

  draw = () => {
    if (this.balls.length > 0) window.requestAnimationFrame(this.draw);
    this.now = Date.now();
    this.delta = this.now - this.then;
    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.scene.clear();

      for (let ball of this.balls) {
        ball.draw(this.scene.c);
        ball.transform();
        ball.validate(this.balls, this.scene.canvas);
      }
    }
  }
}
let painter = new PaintManager();
let canvas = new Scene();
let ball = new Ball(1,1,['#91293'], 1);
painter.scene.canvas.addEventListener("mousedown", (event) => {
  painter.init(event);
});
