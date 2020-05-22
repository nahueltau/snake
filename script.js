//CANVAS SETUP
var canvasContainer = document.getElementById("canvas-container");
var canvas = document.createElement("canvas");
if (canvasContainer) {
    canvasContainer.appendChild(canvas);
}
var canvasWidth = 640;
var canvasHeight = 480;
var canvasUnit = 20;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
//COLOR SETUP
var lightStyle = "#DDD";
var darkStyle = "#333";
var mainColorStyle = "red";
//CONTEXT SETUP
var ctx = canvas.getContext("2d");
ctx.lineWidth = "0";
//GENERAL SETUP
var getCenter = function (startPos) {
    return canvasUnit * startPos + canvasUnit / 2;
};
var collisionCheck = function () {
    if (getCenter(snakeSegments[0].x) === getCenter(baitPos.x) && getCenter(snakeSegments[0].y) === getCenter(baitPos.y)) {
        baitPos = newBait();
        hasAte = true;
    }
};
//BAIT SETUP
var newBait = function () {
    return {
        x: Math.floor(Math.random() * canvasWidth / canvasUnit),
        y: Math.floor(Math.random() * canvasHeight / canvasUnit)
    };
};
var baitPos = newBait();
//SNAKE SETUP
var startPosX = 0;
var startPosY = 0;
var snakeSegments = [{ x: startPosX, y: startPosY }];
var hasAte = false;
//Movement
var currentMovementDirection = "ArrowRight";
var movement = function () {
    switch (currentMovementDirection) {
        case "ArrowRight":
            startPosX++;
            break;
        case "ArrowLeft":
            startPosX--;
            break;
        case "ArrowDown":
            startPosY++;
            break;
        case "ArrowUp":
            startPosY--;
            break;
    }
};
var isOutOfBounds = function (outOfBounds) {
    if (outOfBounds) {
        if (getCenter(startPosX) < 0) {
            startPosX = canvasWidth / canvasUnit;
        }
        else if (getCenter(startPosX) > canvasWidth) {
            startPosX = -1;
        }
        if (getCenter(startPosY) < 0) {
            startPosY = canvasHeight / canvasUnit;
        }
        else if (getCenter(startPosY) > canvasHeight) {
            startPosY = -1;
        }
    }
};
//KEYBOARD EVENTS
var handleInput = function (event) {
    currentMovementDirection = event.key;
};
window.addEventListener("keydown", handleInput);
//ANIMATION SETUP
var animation = function () {
    //Background draw
    ctx.beginPath();
    ctx.fillStyle = darkStyle;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.stroke();
    //Bait
    ctx.beginPath();
    ctx.fillStyle = mainColorStyle;
    ctx.fillRect(getCenter(baitPos.x) - canvasUnit / 2, getCenter(baitPos.y) - canvasUnit / 2, canvasUnit, canvasUnit);
    ctx.stroke();
    //Snake length
    collisionCheck();
    snakeSegments.unshift({ x: startPosX, y: startPosY });
    if (!hasAte) {
        snakeSegments.pop();
    }
    hasAte = false;
    //Snake draw
    snakeSegments.forEach(function (position) {
        ctx.beginPath();
        ctx.fillStyle = lightStyle;
        ctx.fillRect(getCenter(position.x) - canvasUnit / 2, getCenter(position.y) - canvasUnit / 2, canvasUnit, canvasUnit);
        ctx.stroke();
    });
    //Snake movement and out of bounds check
    var outOfBounds = getCenter(startPosX) < 0 || getCenter(startPosX) > canvasWidth || getCenter(startPosY) < 0 || getCenter(startPosY) > canvasHeight;
    isOutOfBounds(outOfBounds);
    movement(currentMovementDirection);
};
//START ANIMATION
setInterval(animation, 200);
