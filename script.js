//DOM MANIPULATION
var appContainer = document.querySelector("container");
var canvasContainer = document.getElementById("canvas-container");
var canvas = document.createElement("canvas");
canvasContainer === null || canvasContainer === void 0 ? void 0 : canvasContainer.appendChild(canvas);
var restartButton = document.querySelector(".restart");
//COUNTER SETUP
var counter = document.querySelector(".counter");
restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener("click", function () {
    snake = new Snake;
    bait = new Bait(snake);
    //reset counter
    if (counter) {
        counter.innerHTML = String(0);
    }
    //reset speed
    frameRate = 100;
    //reset collision boolean
    collision = false;
    startAnimation();
});
//CANVAS STYLE
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerWidth;
var canvasUnit = 20;
if (window.innerWidth >= 800) {
    canvasWidth = 800;
    canvasHeight = 700;
}
if (appContainer) {
    appContainer.style.width = canvasWidth + "px";
}
canvas.width = canvasWidth;
canvas.height = canvasHeight;
//COLOR SETUP
var lightStyle = "#DDD";
var darkStyle = "#333";
var mainColorStyle = "crimson";
//CONTEXT SETUP
var ctx = canvas.getContext("2d");
ctx.lineWidth = "0";
//GENERAL SETUP
var frameRate = 100;
var animationInterval;
var collision = false;
var getCenter = function (particle) {
    return canvasUnit * Math.floor(particle) + canvasUnit / 2;
};
var collisionCheck = function (snake, bait) {
    var snakeSegments = snake.segments;
    var baitPos = bait.position;
    var getNewBait = function () { return bait["new"](); };
    //Snake with bait
    if (getCenter(snakeSegments[0].x) === getCenter(baitPos.x) && getCenter(snakeSegments[0].y) === getCenter(baitPos.y)) {
        getNewBait();
        snake.hasAte = true;
        if (frameRate > 20) {
            frameRate -= 3;
        }
        if (counter) {
            counter.innerHTML = ((snakeSegments.length - 2) * 10).toString();
        }
    }
    //Snake with itself
    for (var segment = 1; segment < snakeSegments.length; segment++) {
        if (getCenter(snakeSegments[segment].y) === getCenter(snakeSegments[0].y)) {
            if (getCenter(snakeSegments[segment].x) === getCenter(snakeSegments[0].x)) {
                collision = true;
                window.removeEventListener("focus", windowFocusEvent);
            }
        }
    }
};
var nextFrame = function () {
    //RELEASE KEYS
    snake.eventTriggered = false;
    //Background PAINTING
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    //Bait PAINTING
    ctx.fillStyle = mainColorStyle;
    ctx.fillRect(getCenter(bait.position.x) - canvasUnit / 2, getCenter(bait.position.y) - canvasUnit / 2, canvasUnit, canvasUnit);
    //Snake MOVE
    snake.move();
    //Snake PAINTING
    snake.segments.forEach(function (position) {
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position.x) - canvasUnit / 2, getCenter(position.y) - canvasUnit / 2, canvasUnit, canvasUnit);
    });
    //SNAKE METHODS
    snake.updatePosition();
    collisionCheck(snake, bait);
    snake.checkOutOfBounds();
    //REQUEST NEXT FRAME
    if (!collision) {
        animationInterval = setTimeout(function () { return nextFrame(snake, bait); }, frameRate);
    }
};
//CLASSES
var Snake = /** @class */ (function () {
    function Snake() {
        var _this = this;
        this.movementDirection = "ArrowRight";
        this.eventTriggered = false;
        this.hasAte = false;
        this.updatePosition = function () {
            switch (_this.movementDirection) {
                case "ArrowRight":
                    _this.position.x += 1;
                    break;
                case "ArrowLeft":
                    _this.position.x -= 1;
                    break;
                case "ArrowDown":
                    _this.position.y += 1;
                    break;
                case "ArrowUp":
                    _this.position.y -= 1;
                    break;
                default:
                    _this.position.x -= 0;
                    _this.position.y -= 0;
                    break;
            }
        };
        this.checkOutOfBounds = function () {
            var outOfBounds = getCenter(_this.position.x) < 0 || getCenter(_this.position.x) > canvasWidth || getCenter(_this.position.y) < 0 || getCenter(_this.position.y) > canvasHeight;
            if (outOfBounds) {
                if (getCenter(_this.position.x) < 0) {
                    _this.position.x = canvasWidth / canvasUnit;
                }
                else if (getCenter(_this.position.x) > canvasWidth) {
                    _this.position.x = 0;
                }
                if (getCenter(_this.position.y) < 0) {
                    _this.position.y = canvasHeight / canvasUnit;
                }
                else if (getCenter(_this.position.y) > canvasHeight) {
                    _this.position.y = 0;
                }
            }
        };
        this.listenForInput = function (event) {
            if (!_this.eventTriggered) {
                if (event.key === "ArrowUp" && _this.movementDirection !== "ArrowDown"
                    || event.key === "ArrowDown" && _this.movementDirection !== "ArrowUp"
                    || event.key === "ArrowLeft" && _this.movementDirection !== "ArrowRight"
                    || event.key === "ArrowRight" && _this.movementDirection !== "ArrowLeft") {
                    _this.movementDirection = event.key;
                    _this.eventTriggered = true;
                }
            }
        };
        this.move = function () {
            if (!_this.hasAte) {
                _this.segments.pop();
            }
            _this.segments.unshift({ x: _this.position.x, y: _this.position.y });
            _this.hasAte = false;
        };
        this.position = {
            x: Math.floor(Math.random() * canvasWidth / canvasUnit / 2 + canvasWidth / canvasUnit / 4),
            y: Math.floor(Math.random() * canvasHeight / canvasUnit / 2 + canvasHeight / canvasUnit / 4)
        };
        this.segments = [
            { x: this.position.x + 2, y: this.position.y },
            { x: this.position.x + 1, y: this.position.y },
            { x: this.position.x, y: this.position.y }
        ];
    }
    return Snake;
}());
var Bait = /** @class */ (function () {
    function Bait(snake) {
        var _this = this;
        this["new"] = function () {
            _this.position = {
                x: Math.floor(Math.random() * canvasWidth / canvasUnit),
                y: Math.floor(Math.random() * canvasHeight / canvasUnit)
            };
            var isBaitSuperposed = true;
            while (isBaitSuperposed) {
                for (var segment = 0; segment < _this.snakeSegments.length; segment++) {
                    if (getCenter(_this.snakeSegments[segment].x) === getCenter(_this.position.x) && getCenter(_this.snakeSegments[segment].y) === getCenter(_this.position.y)) {
                        _this.position = {
                            x: Math.floor(Math.random() * canvasWidth / canvasUnit),
                            y: Math.floor(Math.random() * canvasHeight / canvasUnit)
                        };
                        isBaitSuperposed = true;
                        break;
                    }
                    else {
                        isBaitSuperposed = false;
                    }
                }
            }
        };
        this.position = {
            x: Math.floor(Math.random() * canvasWidth / canvasUnit),
            y: Math.floor(Math.random() * canvasHeight / canvasUnit)
        };
        this.snakeSegments = snake.segments;
    }
    return Bait;
}());
//INIT OBJECTS
var snake = new Snake;
var bait = new Bait(snake);
//EVENT SETUP
var windowFocusEvent = function () {
    clearInterval(animationInterval);
    animationInterval = setTimeout(function () { return nextFrame(snake, bait); }, frameRate);
};
var startAnimation = function () {
    clearInterval(animationInterval);
    animationInterval = setTimeout(function () { return nextFrame(snake, bait); }, frameRate);
    //stop game if window not on focus
    window.addEventListener("blur", function () { clearInterval(animationInterval); });
    //resume game when window bakc on focus
    window.addEventListener("focus", windowFocusEvent);
    window.addEventListener("keydown", snake.listenForInput);
};
//START GAME
startAnimation();
