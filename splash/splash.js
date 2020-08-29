var rand = function (min, max, exclude) {
    var random = Math.floor(Math.random() * (max - min)) + min;
    if (random === exclude) {
        random = rand(min, max, exclude);
    }
    return random;
};
var Ball = /** @class */ (function () {
    function Ball(mX, mY, palette, distance) {
        this.x = rand(mX - distance, mX + distance),
            this.y = rand(mY - distance, mY + distance),
            this.vx = rand(-5, 5, 0),
            this.vy = rand(-5, 5, 0),
            this.size = rand(5, 15),
            this.color = palette[rand(0, palette.length)],
            this.alpha = 1;
    }
    Ball.prototype.draw = function (c) {
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fillStyle = this.color;
        c.fill();
    };
    Ball.prototype.transform = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.03;
    };
    Ball.prototype.validate = function (balls, canvas) {
        if (this.y + this.vy + this.size > canvas.height ||
            this.y + this.vy + this.size < 0) {
            balls.splice(balls.indexOf(this), 1);
        }
        if (this.x + this.vx + this.size > canvas.width ||
            this.x + this.vx + this.size < 0) {
            balls.splice(balls.indexOf(this), 1);
        }
        if (this.alpha <= 0)
            balls.splice(balls.indexOf(this), 1);
    };
    return Ball;
}());
var Scene = /** @class */ (function () {
    function Scene() {
        this.canvas = document.querySelector("canvas");
        this.c = this.canvas.getContext("2d");
        window.addEventListener("resize", this.resize);
        this.resize();
    }
    Scene.prototype.clear = function () {
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Scene.prototype.resize = function () {
        this.canvas.width = window.innerWidth - 5;
        this.canvas.height = window.innerHeight - 5;
        console.log(window.innerHeight, window.innerWidth);
    };
    Scene.prototype.getMousePosition = function (canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };
    return Scene;
}());
var PaintManager = /** @class */ (function () {
    function PaintManager() {
        var _this = this;
        this.draw = function () {
            if (_this.balls.length > 0)
                window.requestAnimationFrame(_this.draw);
            _this.now = Date.now();
            _this.delta = _this.now - _this.then;
            if (_this.delta > _this.interval) {
                _this.then = _this.now - (_this.delta % _this.interval);
                _this.scene.clear();
                for (var _i = 0, _a = _this.balls; _i < _a.length; _i++) {
                    var ball_1 = _a[_i];
                    ball_1.draw(_this.scene.c);
                    ball_1.transform();
                    ball_1.validate(_this.balls, _this.scene.canvas);
                }
            }
        };
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
    PaintManager.prototype.init = function (event) {
        var mouse_position = this.scene.getMousePosition(this.scene.canvas, event);
        var mX = mouse_position.x;
        var mY = mouse_position.y;
        this.balls = this.balls.concat(new Array(10));
        //for (let ball of this.balls) {
        for (var i = 0; i < this.balls.length; i++) {
            if (!this.balls[i]) {
                this.balls[i] = new Ball(mX, mY, this.palette, this.distance);
            }
        }
        window.requestAnimationFrame(this.draw);
    };
    return PaintManager;
}());
var painter = new PaintManager();
var canvas = new Scene();
var ball = new Ball(1, 1, ['#91293'], 1);
painter.scene.canvas.addEventListener("mousedown", function (event) {
    painter.init(event);
});
