let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
const palette = ["#e09f7d", "#ef5d60", "#ec4067", "#a01a7d", "#311847"];
let distance = 50;
let circles = new Array(20);
let fps = 60;
let now, delta;
let then = Date.now();
let interval = 1000 / fps;

const resizeCanvas = (function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 5;
})();
const clear = () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
};
const rand = function (min, max, exclude) {
  let random = Math.floor(Math.random() * (max - min)) + min;
  if (random === exclude) {
    random = rand(min, max, exclude);
  }
  return random;
};
const mousePosition = function (canvas, event) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};
const drawBall = function (ball) {
  c.beginPath();
  c.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
  c.closePath();
  c.fillStyle = ball.color;
  c.fill();
};

window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("mousedown", (event) => {
  init(event);
});

function init() {
  window.requestAnimationFrame(draw);
  let mouse_position = mousePosition(canvas, event);
  let mX = mouse_position.x;
  let mY = mouse_position.y;
  circles = circles.concat(new Array(20));
  for (let i = 0; i < circles.length; i++) {
    if (!circles[i]) {
      circles[i] = {
        x: rand(mX - distance, mX + distance),
        y: rand(mY - distance, mY + distance),
        vx: rand(-5, 5, 0),
        vy: rand(-5, 5, 0),
        size: rand(10, 30),
        color: palette[rand(0, palette.length)],
      };
    }
  }
}

function draw() {
  if (circles.length > 0) window.requestAnimationFrame(draw);
  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    clear();
    for (ball of circles) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      drawBall(ball);
      if (
        ball.y + ball.vy + ball.size > canvas.height ||
        ball.y + ball.vy + ball.size < 0
      ) {
        circles.splice(circles.indexOf(ball), 1);
      }
      if (
        ball.x + ball.vx + ball.size > canvas.width ||
        ball.x + ball.vx + ball.size < 0
      ) {
        circles.splice(circles.indexOf(ball), 1);
      }
    }
  }
}
